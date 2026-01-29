import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-services';

export async function POST() {
  try {
    console.log('🧹 Nettoyage des liens de paiement TEST...');

    // Mettre à jour tous les services pour vider le champ paymentLink
    const result = await prisma.service.updateMany({
      where: {
        paymentLink: {
          not: null
        }
      },
      data: {
        paymentLink: null
      }
    });

    console.log(`✅ ${result.count} services mis à jour`);

    return NextResponse.json({
      success: true,
      message: `${result.count} liens de paiement supprimés avec succès`,
      count: result.count
    });

  } catch (error: any) {
    console.error('❌ Erreur lors du nettoyage:', error);

    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
