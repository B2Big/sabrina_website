import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db-services';
import { checkoutSchema } from '@/lib/validations/schemas';
import { rateLimit, RateLimitConfigs, getClientIp, rateLimitExceededResponse } from '@/lib/rate-limit';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    console.log('🛒 [CHECKOUT] Début de la requête checkout');

    // 🔒 RATE LIMITING : Protection contre les abus de checkout
    const clientIp = getClientIp(req);
    const rateLimitKey = `checkout:${clientIp}`;
    const rateLimitResult = rateLimit(rateLimitKey, RateLimitConfigs.CHECKOUT);

    if (!rateLimitResult.success) {
      console.warn(`🚫 Rate limit dépassé pour checkout depuis ${clientIp}`);
      return rateLimitExceededResponse(rateLimitResult.reset);
    }

    const body = await req.json();
    console.log('📦 [CHECKOUT] Body reçu:', JSON.stringify(body));

    // 🔒 Validation Zod
    const { items, customerName, customerEmail, customerPhone, message, newsletter } = checkoutSchema.parse(body);
    console.log('✅ [CHECKOUT] Validation Zod OK:', items.length, 'items', '- Client:', customerName, customerEmail);

    // 🔒 SÉCURITÉ : Récupérer les prix RÉELS depuis la base de données
    const serviceIds = items.map(item => item.id);
    console.log('🔍 [CHECKOUT] Recherche services DB:', serviceIds);

    const servicesFromDb = await prisma.service.findMany({
      where: {
        id: { in: serviceIds }
      },
      select: {
        id: true,
        title: true,
        category: true,
        price: true,
        description: true
      }
    });

    console.log('📊 [CHECKOUT] Services trouvés:', servicesFromDb.length, '/', items.length);

    // Vérifier que tous les services existent
    if (servicesFromDb.length !== items.length) {
      console.error('❌ [CHECKOUT] Services manquants!');
      return NextResponse.json(
        { error: 'Certains services n\'existent pas' },
        { status: 404 }
      );
    }

    // Créer un Map pour accès rapide
    const servicesMap = new Map(
      servicesFromDb.map(s => [s.id, s])
    );

    // Construire les line items avec les VRAIS prix de la DB
    const lineItems = items.map((item) => {
      const service = servicesMap.get(item.id);

      if (!service) {
        throw new Error(`Service ${item.id} introuvable`);
      }

      // Parser le prix depuis la DB (format: "70 €" -> 70)
      const priceNumber = parseFloat(service.price.replace(/[^0-9.]/g, ''));

      if (isNaN(priceNumber) || priceNumber <= 0) {
        throw new Error(`Prix invalide pour ${service.title}`);
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: service.title,
            description: service.category,
          },
          unit_amount: Math.round(priceNumber * 100), // Centimes
        },
        quantity: item.quantity,
      };
    });

    // Calculer le montant total
    const totalAmount = lineItems.reduce((sum, item) => {
      return sum + (item.price_data.unit_amount * item.quantity)
    }, 0);

    // 💾 ÉTAPE 1: CRÉER LA RÉSERVATION EN BASE DE DONNÉES
    console.log('💾 [CHECKOUT] Création de la réservation en DB...');
    
    const reservation = await prisma.reservation.create({
      data: {
        status: 'attente_paiement_sur_place',
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone,
        message: message || null,
        serviceTitle: servicesFromDb.map(s => s.title).join(', '),
        servicePrice: parseFloat(servicesFromDb[0].price.replace(/[^0-9.]/g, '')) || 0,
        quantity: items.reduce((acc, item) => acc + item.quantity, 0),
        totalAmount: totalAmount / 100, // Convertir centimes -> euros
        paymentMethod: 'stripe',
        requestedDate: body.serviceDate ? new Date(body.serviceDate) : null,
      }
    });

    console.log('✅ [CHECKOUT] Réservation créée:', reservation.id);

    // Créer la session Stripe
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    console.log('💳 [CHECKOUT] Création session Stripe...');
    console.log('🔑 [CHECKOUT] Stripe key présente:', !!process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true#contact`,

      // Pré-remplir l'email client sur la page Stripe
      customer_email: customerEmail,

      // 📧 Champ personnalisé : Newsletter
      custom_fields: [
        {
          key: 'newsletter_consent',
          label: {
            type: 'custom',
            custom: 'Recevoir nos offres par email'
          },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'Oui, je m\'abonne', value: 'yes' },
              { label: 'Non merci', value: 'no' }
            ]
          },
          optional: true
        }
      ],

      // 💾 Lier la session Stripe à notre réservation
      metadata: {
        reservation_id: reservation.id,
        item_count: items.length.toString(),
        total_amount: (totalAmount / 100).toFixed(2),
        service_ids: serviceIds.join(','),
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        customer_message: message?.substring(0, 500) || '',
        newsletter_optin: newsletter ? 'yes' : 'no',
      }
    });

    // 💾 ÉTAPE 2: METTRE À JOUR LA RÉSERVATION AVEC LE SESSION ID STRIPE
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { stripeSessionId: session.id }
    });

    console.log('✅ [CHECKOUT] Session Stripe créée et liée:', session.id);
    console.log('🔗 [CHECKOUT] URL de paiement:', session.url);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('❌ [CHECKOUT] ERREUR GLOBALE:', error);
    console.error('❌ [CHECKOUT] Type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('❌ [CHECKOUT] Message:', error instanceof Error ? error.message : String(error));

    // Erreur de validation Zod
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    // Ne pas exposer les détails techniques en production
    const isDev = process.env.NODE_ENV === 'development';

    if (error instanceof Error) {
      return NextResponse.json(
        { error: isDev ? error.message : 'Erreur lors du paiement' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne lors du paiement' },
      { status: 500 }
    );
  }
}
