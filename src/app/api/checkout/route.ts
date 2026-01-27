import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db-services';
import { checkoutSchema } from '@/lib/validations/schemas';
import { rateLimit, RateLimitConfigs, getClientIp, rateLimitExceededResponse } from '@/lib/rate-limit';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    // 🔒 RATE LIMITING : Protection contre les abus de checkout
    const clientIp = getClientIp(req);
    const rateLimitKey = `checkout:${clientIp}`;
    const rateLimitResult = rateLimit(rateLimitKey, RateLimitConfigs.CHECKOUT);

    if (!rateLimitResult.success) {
      console.warn(`🚫 Rate limit dépassé pour checkout depuis ${clientIp}`);
      return rateLimitExceededResponse(rateLimitResult.reset);
    }

    const body = await req.json();

    // 🔒 Validation Zod
    const { items } = checkoutSchema.parse(body);

    // 🔒 SÉCURITÉ : Récupérer les prix RÉELS depuis la base de données
    // Ne JAMAIS faire confiance aux prix envoyés par le client !
    const serviceIds = items.map(item => item.id);
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

    // Vérifier que tous les services existent
    if (servicesFromDb.length !== items.length) {
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

    // Calculer le montant total pour les métadonnées
    const totalAmount = lineItems.reduce((sum, item) => {
      return sum + (item.price_data.unit_amount * item.quantity);
    }, 0);

    // Créer la session Stripe
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?canceled=true#contact`,
      metadata: {
        item_count: items.length.toString(),
        total_amount: (totalAmount / 100).toFixed(2), // En euros
        service_ids: serviceIds.join(','),
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[STRIPE_ERROR]', error);

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
