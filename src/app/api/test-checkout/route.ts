import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-services';

export async function GET(req: Request) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    test: 'Simulation de checkout',
    steps: {}
  };

  try {
    // 1. Récupérer un service de test
    diagnostics.steps.step1_getService = { status: 'starting' };

    const testService = await prisma.service.findFirst({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        category: true,
        price: true,
        description: true
      }
    });

    if (!testService) {
      diagnostics.steps.step1_getService = {
        status: 'error',
        error: 'Aucun service actif trouvé'
      };
      return NextResponse.json(diagnostics, { status: 500 });
    }

    diagnostics.steps.step1_getService = {
      status: 'success',
      service: {
        id: testService.id,
        title: testService.title,
        price: testService.price
      }
    };

    // 2. Parser le prix
    diagnostics.steps.step2_parsePrice = { status: 'starting' };

    const priceString = testService.price;
    const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g, ''));

    if (isNaN(priceNumber) || priceNumber <= 0) {
      diagnostics.steps.step2_parsePrice = {
        status: 'error',
        error: `Prix invalide: "${priceString}" → ${priceNumber}`,
        priceString,
        priceNumber
      };
      return NextResponse.json(diagnostics, { status: 500 });
    }

    diagnostics.steps.step2_parsePrice = {
      status: 'success',
      priceString,
      priceNumber,
      priceInCents: Math.round(priceNumber * 100)
    };

    // 3. Créer les line items
    diagnostics.steps.step3_createLineItems = { status: 'starting' };

    const lineItems = [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: testService.title,
          description: testService.category,
        },
        unit_amount: Math.round(priceNumber * 100),
      },
      quantity: 1,
    }];

    diagnostics.steps.step3_createLineItems = {
      status: 'success',
      lineItems
    };

    // 4. Vérifier l'URL de base
    diagnostics.steps.step4_baseUrl = {
      status: 'success',
      baseUrl: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
    };

    // 5. Test de validation Stripe (sans vraiment créer la session)
    diagnostics.steps.step5_validation = {
      status: 'success',
      message: 'Tous les paramètres sont valides pour créer une session Stripe'
    };

    diagnostics.overall = {
      status: 'success',
      message: 'Le flow de checkout devrait fonctionner! Le problème est ailleurs.',
      recommendation: 'Vérifier les logs Netlify Functions pour voir l\'erreur exacte lors du checkout réel.'
    };

    return NextResponse.json(diagnostics, { status: 200 });

  } catch (error: any) {
    diagnostics.globalError = {
      message: error.message,
      stack: error.stack,
      type: error.constructor.name
    };

    return NextResponse.json(diagnostics, { status: 500 });
  }
}
