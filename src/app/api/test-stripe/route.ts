import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/db-services';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {}
  };

  try {
    // 1. Vérifier clé Stripe
    diagnostics.checks.stripeKey = {
      present: !!process.env.STRIPE_SECRET_KEY,
      prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 10) || 'missing',
      length: process.env.STRIPE_SECRET_KEY?.length || 0
    };

    // 2. Tester connexion Stripe
    try {
      const balance = await stripe.balance.retrieve();
      diagnostics.checks.stripeConnection = {
        success: true,
        currency: balance.available[0]?.currency || 'unknown'
      };
    } catch (stripeError: any) {
      diagnostics.checks.stripeConnection = {
        success: false,
        error: stripeError.message,
        type: stripeError.type
      };
    }

    // 3. Vérifier connexion DB
    try {
      const serviceCount = await prisma.service.count();
      diagnostics.checks.database = {
        success: true,
        serviceCount
      };
    } catch (dbError: any) {
      diagnostics.checks.database = {
        success: false,
        error: dbError.message,
        code: dbError.code
      };
    }

    // 4. Vérifier variables env
    diagnostics.checks.environment = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL || 'missing',
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET
    };

    return NextResponse.json(diagnostics, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      ...diagnostics,
      globalError: {
        message: error.message,
        stack: error.stack
      }
    }, { status: 500 });
  }
}
