import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db-services'
import Stripe from 'stripe'
import { 
  sendConfirmationToCustomerPaye, 
  sendNotificationToSabrinaPaye,
  sendPaymentFailedToCustomer,
  sendRefundNotificationToCustomer
} from '@/lib/resend'
import { createGoogleEventForReservation, deleteGoogleEventForReservation } from '@/lib/google-calendar'

/**
 * Webhook Stripe pour recevoir les événements de paiement
 *
 * Événements traités :
 * - checkout.session.completed : Paiement réussi
 * - checkout.session.async_payment_succeeded : Paiement asynchrone réussi (ex: virement)
 * - checkout.session.async_payment_failed : Paiement asynchrone échoué
 * - checkout.session.expired : Session expirée sans paiement → annulation + libération du créneau
 * - payment_intent.payment_failed : Échec de paiement
 * - charge.refunded : Remboursement → annulation + libération du créneau
 *
 * FLUX:
 * 1. La réservation est créée AVANT le paiement (status: attente_paiement_sur_place)
 * 2. Le webhook met à jour la réservation (status: paye_confirme) de façon ATOMIQUE (updateMany)
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
    console.error('[WEBHOOK] Erreur de vérification de signature')
    return NextResponse.json(
      { error: 'Webhook Error: signature invalide' },
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
        await handleCheckoutCompleted(session)
        break
      }

      case 'checkout.session.async_payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleAsyncPaymentFailed(session)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleSessionExpired(session)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentFailed(paymentIntent)
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        await handleRefund(charge)
        break
      }

      default:
        console.log(`[WEBHOOK] Événement non traité`)
    }

    // 200 : événement traité (ou déjà traité — idempotence)
    return NextResponse.json({ received: true })
  } catch (error) {
    // 500 : erreur réelle → Stripe retry avec backoff exponentiel
    console.error('[WEBHOOK] Erreur lors du traitement', error)
    return NextResponse.json({ error: 'Traitement échoué' }, { status: 500 })
  }
}

/**
 * Paiement complété avec succès (carte, PayPal instantané)
 * Met à jour la réservation et envoie les emails de confirmation "PAYÉ"
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  // Détecter le mode de paiement utilisé
  const paymentMethod = session.payment_method_types?.[0] || 'unknown';
  console.log(`💳 [WEBHOOK] Paiement réussi via ${paymentMethod.toUpperCase()}`)

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

  // 🔒 VÉRIFICATION DU MONTANT (défense en profondeur)
  const expectedCents = Math.round((reservation.totalAmount || 0) * 100);
  const paidCents = session.amount_total || 0;
  if (expectedCents > 0 && paidCents > 0 && Math.abs(expectedCents - paidCents) > 1) {
    console.error(
      `[WEBHOOK] ⚠️ MONTANT INCOHÉRENT réservation=${reservation.id} : DB=${expectedCents}c Stripe=${paidCents}c`
    );
    // Le paiement est réel : on confirme quand même, mais l'anomalie est journalisée pour enquête
  }

  // 🔒 IDEMPOTENCE ATOMIQUE : un seul passage à paye_confirme possible
  // (protège contre les doubles livraisons du webhook → double envoi d'emails)
  const updated = await prisma.reservation.updateMany({
    where: {
      id: reservation.id,
      status: { not: 'paye_confirme' }
    },
    data: {
      status: 'paye_confirme',
      stripePaymentId: session.payment_intent as string,
      paidAt: new Date()
    }
  })

  if (updated.count === 0) {
    console.log('[WEBHOOK] ℹ️ Réservation déjà marquée comme payée (idempotence)')
    return
  }

  const updatedReservation = await prisma.reservation.findUnique({
    where: { id: reservation.id }
  })

  if (!updatedReservation) {
    throw new Error(`Réservation ${reservation.id} introuvable après mise à jour`)
  }

  console.log('[WEBHOOK] ✅ Réservation mise à jour:', updatedReservation.id)
  console.log('[WEBHOOK] 📊 Nouveau statut:', updatedReservation.status)

  // 2. GÉRER LA NEWSLETTER
  await handleNewsletterSubscription(session)

  // 3. ENVOYER LES EMAILS "PAYÉS" (Bundle Reçu + Confirmation)
  await sendPaymentConfirmationEmails(session, updatedReservation)

  // 4. GOOGLE CALENDAR : ajouter le RDV à l'agenda de Sabrina (no-op si non connecté)
  try {
    await createGoogleEventForReservation({
      id: updatedReservation.id,
      startAt: updatedReservation.startAt,
      endAt: updatedReservation.endAt,
      serviceTitle: updatedReservation.serviceTitle,
      customerName: updatedReservation.customerName,
      customerPhone: updatedReservation.customerPhone,
    });
  } catch (googleError) {
    console.error('[WEBHOOK] ❌ Erreur Google Calendar:', googleError);
    // Non bloquant
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

    // Créneau réservé (si la réservation a un créneau)
    const slot = reservation.startAt && reservation.endAt
      ? { start: new Date(reservation.startAt), end: new Date(reservation.endAt) }
      : null;

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
        slot,
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
        slot,
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
 * Paiement asynchrone échoué → annulation + libération du créneau + email client
 */
async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  console.log('[WEBHOOK] ❌ Paiement asynchrone échoué')

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { stripeSessionId: session.id }
    })

    if (!reservation) {
      console.log('[WEBHOOK] ℹ️ Aucune réservation liée à cette session')
      return
    }

    const updated = await prisma.reservation.updateMany({
      where: { id: reservation.id, status: { not: 'paye_confirme' } },
      data: { status: 'annule' }
    })

    if (updated.count === 0) {
      console.log('[WEBHOOK] ℹ️ Réservation déjà payée — rien à annuler')
      return
    }

    console.log('[WEBHOOK] ✅ Réservation annulée, créneau libéré')

    // Supprimer l'événement Google Calendar correspondant (no-op si non connecté)
    try {
      await deleteGoogleEventForReservation(reservation.googleEventId)
    } catch (googleError) {
      console.error('[WEBHOOK] ❌ Erreur suppression événement Google:', googleError)
    }

    // Email client : paiement non abouti
    try {
      await sendPaymentFailedToCustomer({
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        reservationId: reservation.id,
        slot: reservation.startAt && reservation.endAt
          ? { start: reservation.startAt, end: reservation.endAt }
          : null,
      })
      console.log('[WEBHOOK] ✅ Email échec envoyé au client')
    } catch (emailError) {
      console.error('[WEBHOOK] ❌ Erreur email échec client:', emailError)
    }
  } catch (error) {
    console.error('[WEBHOOK] ❌ Erreur handleAsyncPaymentFailed', error)
    throw error
  }
}

/**
 * Session Stripe expirée sans paiement (le client a abandonné)
 * → annulation + libération du créneau + email d'échec
 */
async function handleSessionExpired(session: Stripe.Checkout.Session) {
  console.log('[WEBHOOK] ⏳ Session expirée sans paiement')

  try {
    const reservation = await prisma.reservation.findUnique({
      where: { stripeSessionId: session.id }
    })

    if (!reservation) return

    // N'annuler que si jamais payée
    const updated = await prisma.reservation.updateMany({
      where: { id: reservation.id, status: { not: 'paye_confirme' } },
      data: { status: 'annule' }
    })

    if (updated.count === 0) return

    console.log('[WEBHOOK] ✅ Réservation annulée (session expirée), créneau libéré')

    // Supprimer l'événement Google Calendar correspondant (no-op si non connecté)
    try {
      await deleteGoogleEventForReservation(reservation.googleEventId)
    } catch (googleError) {
      console.error('[WEBHOOK] ❌ Erreur suppression événement Google:', googleError)
    }

    try {
      await sendPaymentFailedToCustomer({
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        reservationId: reservation.id,
        slot: reservation.startAt && reservation.endAt
          ? { start: reservation.startAt, end: reservation.endAt }
          : null,
      })
    } catch (emailError) {
      console.error('[WEBHOOK] ❌ Erreur email échec client:', emailError)
    }
  } catch (error) {
    console.error('[WEBHOOK] ❌ Erreur handleSessionExpired', error)
    throw error
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

  // Si une réservation est déjà liée à ce payment intent, l'annuler et libérer le créneau
  try {
    const reservation = await prisma.reservation.findFirst({
      where: { stripePaymentId: paymentIntent.id }
    })

    if (reservation && reservation.status !== 'paye_confirme') {
      await prisma.reservation.updateMany({
        where: { id: reservation.id, status: { not: 'paye_confirme' } },
        data: { status: 'annule' }
      })

      try {
        await sendPaymentFailedToCustomer({
          customerName: reservation.customerName,
          customerEmail: reservation.customerEmail,
          reservationId: reservation.id,
          slot: reservation.startAt && reservation.endAt
            ? { start: reservation.startAt, end: reservation.endAt }
            : null,
        })
      } catch (emailError) {
        console.error('[WEBHOOK] ❌ Erreur email échec client:', emailError)
      }
    }
  } catch (error) {
    console.error('[WEBHOOK] ❌ Erreur handlePaymentFailed', error)
    throw error
  }
}

/**
 * Remboursement Stripe → annulation + libération du créneau + email client
 */
async function handleRefund(charge: Stripe.Charge) {
  console.log('[WEBHOOK] 💸 Remboursement détecté')

  const paymentIntentId = charge.payment_intent as string | undefined
  if (!paymentIntentId) {
    console.log('[WEBHOOK] ℹ️ Charge sans payment_intent — ignorée')
    return
  }

  try {
    const reservation = await prisma.reservation.findFirst({
      where: { stripePaymentId: paymentIntentId }
    })

    if (!reservation) {
      console.log('[WEBHOOK] ℹ️ Aucune réservation liée à ce remboursement')
      return
    }

    const updated = await prisma.reservation.updateMany({
      where: { id: reservation.id, status: { not: 'annule' } },
      data: { status: 'annule' }
    })

    if (updated.count === 0) {
      console.log('[WEBHOOK] ℹ️ Réservation déjà annulée')
      return
    }

    console.log('[WEBHOOK] ✅ Réservation annulée (remboursement), créneau libéré')

    // Supprimer l'événement Google Calendar correspondant (no-op si non connecté)
    try {
      await deleteGoogleEventForReservation(reservation.googleEventId)
    } catch (googleError) {
      console.error('[WEBHOOK] ❌ Erreur suppression événement Google:', googleError)
    }

    try {
      await sendRefundNotificationToCustomer({
        customerName: reservation.customerName,
        customerEmail: reservation.customerEmail,
        reservationId: reservation.id,
      })
      console.log('[WEBHOOK] ✅ Email remboursement envoyé au client')
    } catch (emailError) {
      console.error('[WEBHOOK] ❌ Erreur email remboursement:', emailError)
    }
  } catch (error) {
    console.error('[WEBHOOK] ❌ Erreur handleRefund', error)
    throw error
  }
}
