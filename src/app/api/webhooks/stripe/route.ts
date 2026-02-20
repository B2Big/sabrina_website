import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db-services'
import Stripe from 'stripe'
import { 
  sendConfirmationToCustomerPaye, 
  sendNotificationToSabrinaPaye 
} from '@/lib/resend'

/**
 * Webhook Stripe pour recevoir les événements de paiement
 *
 * Événements traités :
 * - checkout.session.completed : Paiement réussi
 * - checkout.session.async_payment_succeeded : Paiement asynchrone réussi (ex: virement)
 * - checkout.session.async_payment_failed : Paiement asynchrone échoué
 * - payment_intent.payment_failed : Échec de paiement
 * 
 * FLUX:
 * 1. La réservation est créée AVANT le paiement (status: attente_paiement_sur_place)
 * 2. Le webhook met à jour la réservation (status: paye_confirme)
 * 3. Les emails sont envoyés avec le statut "PAYÉ"
 */

// IMPORTANT: Forcer le runtime Node.js (pas Edge) car Prisma nécessite Node.js
export const runtime = 'nodejs'

// Désactiver le body parser pour recevoir le raw body nécessaire à la vérification Stripe
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('[WEBHOOK] Signature Stripe manquante')
    return NextResponse.json(
      { error: 'Signature manquante' },
      { status: 400 }
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('[WEBHOOK] STRIPE_WEBHOOK_SECRET non configuré')
    return NextResponse.json(
      { error: 'Configuration webhook manquante' },
      { status: 500 }
    )
  }

  let event: Stripe.Event

  try {
    // Vérifier la signature du webhook
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    console.log(`[WEBHOOK] Événement reçu`)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[WEBHOOK] Erreur de vérification de signature')
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    )
  }

  // Traiter l'événement
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleAsyncPaymentSucceeded(session)
        break
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleAsyncPaymentFailed(session)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      default:
        console.log(`[WEBHOOK] Événement non traité`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[WEBHOOK] Erreur lors du traitement')
    // Toujours retourner 200 pour éviter que Stripe retry indéfiniment
    return NextResponse.json({ received: true })
  }
}

/**
 * Paiement complété avec succès (carte, PayPal instantané)
 * Met à jour la réservation et envoie les emails de confirmation "PAYÉ"
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('💳 [WEBHOOK] Paiement réussi')

  try {
    // 1. RÉCUPÉRER LA RÉSERVATION PAR LE SESSION ID STRIPE
    const reservation = await prisma.reservation.findUnique({
      where: { stripeSessionId: session.id }
    })

    if (!reservation) {
      console.error('[WEBHOOK] Réservation non trouvée')
      // Créer une réservation de secours (cas où le checkout n'a pas créé la réservation)
      await createFallbackReservation(session)
      return
    }

    // 2. VÉRIFIER SI DÉJÀ TRAITÉ (éviter les doublons)
    if (reservation.status === 'paye_confirme') {
      console.log('[WEBHOOK] ℹ️ Réservation déjà marquée comme payée')
      return
    }

    // 3. METTRE À JOUR LA RÉSERVATION
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservation.id },
      data: {
        status: 'paye_confirme',
        stripePaymentId: session.payment_intent as string,
        paidAt: new Date()
      }
    })

    console.log('[WEBHOOK] ✅ Réservation mise à jour:', updatedReservation.id)
    console.log('[WEBHOOK] 📊 Nouveau statut:', updatedReservation.status)

    // 4. GÉRER LA NEWSLETTER
    await handleNewsletterSubscription(session)

    // 5. ENVOYER LES EMAILS "PAYÉS" (Bundle Reçu + Confirmation)
    await sendPaymentConfirmationEmails(session, updatedReservation)

  } catch (error) {
    console.error('[WEBHOOK] ❌ Erreur handleCheckoutCompleted:', error)
    // On ne throw pas pour éviter les retries Stripe infinis
  }
}

/**
 * Gère l'inscription à la newsletter depuis le webhook
 */
async function handleNewsletterSubscription(session: Stripe.Checkout.Session) {
  const customFields = session.custom_fields || []
  const newsletterField = customFields.find((field: any) => field.key === 'newsletter_consent')
  const newsletterFromForm = session.metadata?.newsletter_optin === 'yes'

  if ((newsletterField?.dropdown?.value === 'yes' || newsletterFromForm) && session.customer_details?.email) {
    try {
      const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email: session.customer_details.email }
      })

      if (existingSubscriber) {
        if (!existingSubscriber.isSubscribed) {
          await prisma.newsletterSubscriber.update({
            where: { email: session.customer_details.email },
            data: {
              isSubscribed: true,
              subscribedAt: new Date(),
              unsubscribedAt: null
            }
          })
          console.log('[WEBHOOK] ✅ Client réabonné à la newsletter')
        }
      } else {
        await prisma.newsletterSubscriber.create({
          data: {
            email: session.customer_details.email,
            name: session.customer_details.name || '',
            source: 'checkout_paid',
            consentGiven: true,
            isSubscribed: true
          }
        })
        console.log('[WEBHOOK] ✅ Nouvel abonné newsletter')
      }
    } catch (error) {
      console.error('[WEBHOOK] ❌ Erreur newsletter:', error)
      // Non bloquant
    }
  }
}

/**
 * Envoie les emails de confirmation après paiement réussi
 * - Client: Bundle (Reçu Stripe + Confirmation)
 * - Propriétaire: Notification "Payé"
 */
async function sendPaymentConfirmationEmails(
  session: Stripe.Checkout.Session, 
  reservation: any
) {
  console.log('[WEBHOOK] 📧 Envoi des emails de confirmation payée')

  try {
    // Récupérer les détails du reçu Stripe (via l'API si nécessaire)
    // Note: receipt_url n'est pas directement sur la session, il faut récupérer le payment intent
    let receiptUrl: string | null = null;
    
    if (session.payment_intent) {
      try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          session.payment_intent as string
        );
        // Récupérer la première charge associée
        if (paymentIntent.latest_charge) {
          const charge = await stripe.charges.retrieve(
            paymentIntent.latest_charge as string
          );
          receiptUrl = charge.receipt_url;
        }
      } catch (e) {
        console.log('[WEBHOOK] ℹ️ Impossible de récupérer le reçu Stripe:', e);
      }
    }

    // Construire les services pour l'email
    const services = [{
      title: reservation.serviceTitle,
      price: reservation.totalAmount.toString(),
      quantity: reservation.quantity
    }]

    // 1. EMAIL AU CLIENT (Bundle Reçu + Confirmation)
    try {
      await sendConfirmationToCustomerPaye({
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        reservationId: reservation.id,
        services: services,
        total: reservation.totalAmount,
        stripeReceiptUrl: receiptUrl,
        paidAt: reservation.paidAt!,
      })
      console.log('[WEBHOOK] ✅ Email CLIENT [PAYÉ] envoyé')
    } catch (emailError) {
      console.error('[WEBHOOK] ❌ Erreur email CLIENT')
    }

    // 2. EMAIL AU PROPRIÉTAIRE (Notification "Payé")
    try {
      await sendNotificationToSabrinaPaye({
        reservationId: reservation.id,
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        customerPhone: reservation.customerPhone,
        services: services,
        total: reservation.totalAmount,
        message: reservation.message,
        stripePaymentId: reservation.stripePaymentId!,
        paidAt: reservation.paidAt!,
      })
      console.log('[WEBHOOK] ✅ Email SABRINA [PAYÉ] envoyé')
    } catch (emailError) {
      console.error('[WEBHOOK] ❌ Erreur email SABRINA')
    }

  } catch (error) {
    console.error('[WEBHOOK] ❌ Erreur envoi emails')
  }
}

/**
 * Crée une réservation de secours si la réservation n'a pas été trouvée
 * (Cas extrême où le checkout n'a pas créé la réservation)
 */
async function createFallbackReservation(session: Stripe.Checkout.Session) {
  console.log('[WEBHOOK] ⚠️ Création d\'une réservation de secours')

  try {
    const reservation = await prisma.reservation.create({
      data: {
        status: 'paye_confirme',
        customerName: session.metadata?.customer_name || session.customer_details?.name || 'Client',
        customerEmail: session.metadata?.customer_email || session.customer_details?.email || '',
        customerPhone: session.metadata?.customer_phone || 'Non renseigné',
        message: session.metadata?.customer_message || null,
        serviceTitle: 'Services divers (récupération webhook)',
        servicePrice: (session.amount_total || 0) / 100,
        quantity: parseInt(session.metadata?.item_count || '1'),
        totalAmount: (session.amount_total || 0) / 100,
        paymentMethod: 'stripe',
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string,
        paidAt: new Date()
      }
    })

    console.log('[WEBHOOK] ✅ Réservation de secours créée')

    // Envoyer les emails quand même
    await sendPaymentConfirmationEmails(session, reservation)

  } catch (error) {
    console.error('[WEBHOOK] ❌ Erreur création réservation de secours')
  }
}

/**
 * Paiement asynchrone réussi (ex: virement SEPA)
 * Même traitement que checkout.session.completed
 */
async function handleAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
  console.log('[WEBHOOK] 💳 Paiement asynchrone réussi')
  await handleCheckoutCompleted(session)
}

/**
 * Paiement asynchrone échoué
 */
async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  console.log('[WEBHOOK] ❌ Paiement asynchrone échoué')

  try {
    // Mettre à jour la réservation si elle existe
    const reservation = await prisma.reservation.findUnique({
      where: { stripeSessionId: session.id }
    })

    if (reservation) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: { status: 'annule' }
      })
      console.log('[WEBHOOK] ✅ Réservation marquée comme annulée')
    }

    // TODO: Envoyer un email au client pour l'informer de l'échec
    console.log('[WEBHOOK] 📧 Email d\'échec à envoyer')

  } catch (error) {
    console.error('[WEBHOOK] ❌ Erreur handleAsyncPaymentFailed')
  }
}

/**
 * Échec de paiement (carte refusée, etc.)
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('[WEBHOOK] ❌ Échec de paiement:', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    errorMessage: paymentIntent.last_payment_error?.message
  })

  // TODO: Logger l'échec et éventuellement notifier le client
}
