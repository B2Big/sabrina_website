import Stripe from 'stripe';

// Fallback pour le build (Next.js évalue ce fichier au build même s'il n'est pas utilisé)
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_for_build';

if (process.env.NODE_ENV === 'production' && !process.env.STRIPE_SECRET_KEY) {
  console.error('❌ [STRIPE] STRIPE_SECRET_KEY manquante en production !');
}

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});
