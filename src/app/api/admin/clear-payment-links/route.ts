import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-services';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { hasAdminAccess } from '@/lib/auth/roles';

export async function POST() {
  try {
    // 🔒 Vérification de l'authentification
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignoré si appelé depuis un Server Component
            }
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !hasAdminAccess(user)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      );
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
