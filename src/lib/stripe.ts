import Stripe from 'stripe';

// Fallback to a dummy key during build/dev if env var is missing to prevent crash
// The actual payment will fail if the key is not set in production
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build';

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-12-15.clover',
  typescript: true,
});
