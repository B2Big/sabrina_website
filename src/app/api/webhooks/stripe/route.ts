import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db-services'
import Stripe from 'stripe'
import { sendReservationToSabrina, sendConfirmationToCustomer } from '@/lib/resend'

/**
 * Webhook Stripe pour recevoir les événements de paiement
 *
 * Événements traités :
 * - checkout.session.completed : Paiement réussi
 * - checkout.session.async_payment_succeeded : Paiement asynchrone réussi (ex: virement)
 * - checkout.session.async_payment_failed : Paiement asynchrone échoué
 * - payment_intent.payment_failed : Échec de paiement
 */

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
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error('[WEBHOOK] Erreur de vérification de signature:', errorMessage)
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
        console.log(`[WEBHOOK] Événement non traité: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[WEBHOOK] Erreur lors du traitement:', error)
    return NextResponse.json(
      { error: 'Erreur de traitement' },
      { status: 500 }
    )
  }
}

/**
 * Paiement complété avec succès (carte, PayPal instantané)
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Paiement réussi:', {
    sessionId: session.id,
    amount: session.amount_total ? session.amount_total / 100 : 0,
    currency: session.currency,
    customerEmail: session.customer_details?.email,
    metadata: session.metadata
  })

  try {
    // Vérifier si la commande existe déjà (éviter les doublons)
    const existingOrder = await prisma.order.findUnique({
      where: { stripeSessionId: session.id }
    })

    if (existingOrder) {
      console.log('⚠️  Commande déjà enregistrée:', session.id)

      // Mettre à jour si le statut a changé
      if (existingOrder.status !== 'COMPLETED') {
        await prisma.order.update({
          where: { id: existingOrder.id },
          data: {
            status: 'COMPLETED',
            paidAt: new Date(),
            stripePaymentId: session.payment_intent as string
          }
        })
        console.log('✅ Statut de commande mis à jour')
      }
    } else {
      // Créer la nouvelle commande
      const order = await prisma.order.create({
        data: {
          stripeSessionId: session.id,
          stripePaymentId: session.payment_intent as string,
          amount: session.amount_total! / 100,
          currency: session.currency || 'eur',
          status: 'COMPLETED',
          customerEmail: session.customer_details?.email || '',
          customerName: session.customer_details?.name || '',
          serviceIds: session.metadata?.service_ids?.split(',') || [],
          itemCount: parseInt(session.metadata?.item_count || '0'),
          paidAt: new Date()
        }
      })

      console.log('✅ Commande enregistrée en base de données:', order.id)
    }

    // 📧 Gérer l'abonnement newsletter
    const customFields = session.custom_fields || []
    const newsletterField = customFields.find((field: any) => field.key === 'newsletter_consent')

    if (newsletterField?.dropdown?.value === 'yes' && session.customer_details?.email) {
      try {
        // Vérifier si l'email existe déjà
        const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
          where: { email: session.customer_details.email }
        })

        if (existingSubscriber) {
          // Réabonner si désinscrit
          if (!existingSubscriber.isSubscribed) {
            await prisma.newsletterSubscriber.update({
              where: { email: session.customer_details.email },
              data: {
                isSubscribed: true,
                subscribedAt: new Date(),
                unsubscribedAt: null
              }
            })
            console.log('✅ Client réabonné à la newsletter:', session.customer_details.email)
          } else {
            console.log('ℹ️  Client déjà abonné à la newsletter')
          }
        } else {
          // Créer un nouvel abonné
          await prisma.newsletterSubscriber.create({
            data: {
              email: session.customer_details.email,
              name: session.customer_details.name || '',
              source: 'checkout',
              consentGiven: true,
              isSubscribed: true
            }
          })
          console.log('✅ Nouvel abonné newsletter:', session.customer_details.email)
        }
      } catch (error) {
        console.error('❌ Erreur lors de l\'enregistrement newsletter:', error)
        // Ne pas bloquer le reste du traitement
      }
    }

    // 📧 Envoyer les emails de confirmation après paiement
    const customerEmail = session.customer_details?.email
    const customerName = session.customer_details?.name || 'Client'

    if (customerEmail) {
      try {
        // Récupérer les line items de la session Stripe pour le récap
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

        const cartItems = lineItems.data.map(item => ({
          title: item.description || 'Prestation',
          price: `${(item.amount_total / 100).toFixed(0)} €`,
          quantity: item.quantity || 1,
        }))

        const total = session.amount_total ? (session.amount_total / 100).toFixed(0) : '0'

        // Email de confirmation au client
        try {
          await sendConfirmationToCustomer({
            customerName,
            customerEmail,
            message: 'Paiement en ligne effectué avec succès.',
            cartItems,
            total,
          })
          console.log('✅ Email de confirmation envoyé au client:', customerEmail)
        } catch (emailError) {
          console.error('❌ Erreur envoi email client:', emailError)
        }

        // Email de notification à Sabrina (propriétaire)
        try {
          await sendReservationToSabrina({
            customerName,
            customerEmail,
            customerPhone: 'Non renseigné (paiement en ligne)',
            message: `Paiement en ligne confirmé - ${total} €`,
            cartItems,
            total,
          })
          console.log('✅ Email de notification envoyé à Sabrina')
        } catch (emailError) {
          console.error('❌ Erreur envoi email Sabrina:', emailError)
        }
      } catch (error) {
        console.error('❌ Erreur récupération line items pour emails:', error)
      }
    } else {
      console.warn('⚠️ Pas d\'email client disponible, emails non envoyés')
    }

  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement de la commande:', error)
    // On ne throw pas l'erreur pour éviter que Stripe retry indéfiniment
    // À la place, on log et on pourrait envoyer une alerte
  }
}

/**
 * Paiement asynchrone réussi (ex: virement SEPA)
 */
async function handleAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
  console.log('✅ Paiement asynchrone réussi:', session.id)

  // Même traitement que checkout.session.completed
  await handleCheckoutCompleted(session)
}

/**
 * Paiement asynchrone échoué
 */
async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  console.log('❌ Paiement asynchrone échoué:', session.id)

  try {
    // Enregistrer ou mettre à jour la commande comme échouée
    await prisma.order.upsert({
      where: { stripeSessionId: session.id },
      update: {
        status: 'FAILED'
      },
      create: {
        stripeSessionId: session.id,
        stripePaymentId: session.payment_intent as string,
        amount: session.amount_total! / 100,
        currency: session.currency || 'eur',
        status: 'FAILED',
        customerEmail: session.customer_details?.email || '',
        customerName: session.customer_details?.name || '',
        serviceIds: session.metadata?.service_ids?.split(',') || [],
        itemCount: parseInt(session.metadata?.item_count || '0')
      }
    })

    console.log('✅ Échec enregistré en base de données')
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement de l\'échec:', error)
  }

  // TODO: Envoyer un email à la cliente pour l'informer
  console.log('📧 Email d\'échec à envoyer à:', session.customer_details?.email)
}

/**
 * Échec de paiement (carte refusée, etc.)
 */
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Échec de paiement:', {
    paymentIntentId: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    errorMessage: paymentIntent.last_payment_error?.message
  })

  // TODO: Logger l'échec
  // TODO: Possiblement envoyer un email si on a l'info du client
}
