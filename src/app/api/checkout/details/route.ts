import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json({ error: 'session_id requis' }, { status: 400 });
    }

    // Vérifier que le session_id a le bon format Stripe
    if (!sessionId.startsWith('cs_')) {
      return NextResponse.json({ error: 'session_id invalide' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 400 });
    }

    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);

    return NextResponse.json({
      amount: session.amount_total,
      currency: session.currency,
      customerName: session.metadata?.customer_name || session.customer_details?.name || '',
      items: lineItems.data.map(item => ({
        description: item.description,
        quantity: item.quantity,
        amount_total: item.amount_total,
      })),
    });
  } catch {
    return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
  }
}
