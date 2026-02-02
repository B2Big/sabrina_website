import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-services';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { hasAdminAccess } from '@/lib/auth/roles';
import { serviceSchema } from '@/lib/validations/schemas';
import { z } from 'zod';

/**
 * GET /api/services
 * Public - Récupère la liste des services
 */
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('[API] Error fetching services:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des services' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/services
 * Protégé - Crée un nouveau service (Admin uniquement)
 */
export async function POST(req: Request) {
  try {
    // 🔒 Vérification de l'authentification et des permissions
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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Vérifier que l'utilisateur est connecté et a un rôle admin
    if (!user || !hasAdminAccess(user)) {
      return NextResponse.json(
        { error: 'Non autorisé - Rôle admin requis' },
        { status: 403 }
      );
    }

    // Créer le service
    const body = await req.json();

    // 🔒 Validation Zod
    const validatedData = serviceSchema.parse(body);

    const service = await prisma.service.create({
      data: {
        title: validatedData.title,
        category: validatedData.category,
        price: validatedData.price,
        originalPrice: validatedData.originalPrice,
        description: validatedData.description,
        duration: validatedData.duration,
        objective: validatedData.objective,
        popular: validatedData.popular,
        bestValue: validatedData.bestValue,
        note: validatedData.note,
        features: validatedData.features,
        paymentLink: validatedData.paymentLink,
      },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error('[API] Error creating service:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du service' },
      { status: 500 }
    );
  }
}
