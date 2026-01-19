// Stripe Configuration and Product IDs
// These IDs should match the products created in the Stripe Dashboard.

export const STRIPE_CONFIG = {
  // Recurring Subscriptions
  SUBSCRIPTIONS: {
    SAAS_CLUB_RUN: {
      id: 'price_saas_29',
      name: 'Club Run (App)',
      price: 2990, // in cents
      interval: 'month',
    },
    COACHING_ELITE: {
      id: 'price_premium_149',
      name: 'Coaching Elite',
      price: 14900, // in cents
      interval: 'month',
    },
  },

  // One-Time Payments
  ONE_TIME: {
    MASSAGE_1H: {
      id: 'price_massage_70',
      name: 'Massage 1h',
      price: 7000, // in cents
    },
    COACHING_1TO1: {
      id: 'price_coaching_60',
      name: 'Coaching 1-to-1',
      price: 6000, // in cents
    },
    PACK_TRANSFORMATION: {
      id: 'price_pack_550',
      name: 'Pack Transformation (10 Séances)',
      price: 55000, // in cents
    },
    CARDIO_BOXE: {
      id: 'price_boxe_50',
      name: 'Cardio Boxe',
      price: 5000, // in cents
    },
    SMALL_GROUP: {
      id: 'price_group_10',
      name: 'Small Group',
      price: 1000, // in cents
    },
  },
};

// Helper to determine mode based on price ID
export const getStripeMode = (priceId: string): 'subscription' | 'payment' => {
  const allSubscriptions = Object.values(STRIPE_CONFIG.SUBSCRIPTIONS).map((p) => p.id);
  return allSubscriptions.includes(priceId) ? 'subscription' : 'payment';
};
