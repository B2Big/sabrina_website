import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-services';
import { requireAdminApi } from '@/lib/auth/api-guard';

export async function POST() {
  try {
    // 🔒 Vérification de l'authentification admin
    const { user, error } = await requireAdminApi();
    
    if (error || !user) {
      return error || NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    console.log('🧹 Nettoyage des liens de paiement TEST...');

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

  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error);

    return NextResponse.json({
      success: false,
      error: 'Erreur lors du nettoyage'
    }, { status: 500 });
  }
}
