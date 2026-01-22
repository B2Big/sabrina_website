import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { type Service } from '@/data/content';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // Transformation des items du panier en "Line Items" Stripe
    const lineItems = items.map((item: Service & { quantity: number }) => {
        // Extraction du prix (ex: "50 €" -> 50)
        const priceNumber = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        
        return {
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.title,
                    description: item.category,
                    // images: [item.image] // Si on avait des images dans l'objet Service
                },
                unit_amount: Math.round(priceNumber * 100), // En centimes
            },
            quantity: item.quantity,
        };
    });

    // Création de la session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/?canceled=true#contact`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('[STRIPE_ERROR]', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
