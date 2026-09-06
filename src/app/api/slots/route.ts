import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-services';
import { getAvailableSlots, parseDayDate, dayOfWeekOf, DEFAULT_AVAILABILITY } from '@/lib/slots';

/**
 * GET /api/slots?serviceId=xxx&date=YYYY-MM-DD
 *
 * Retourne les créneaux libres du jour (Europe/Paris) pour une prestation.
 * - Les horaires viennent des règles admin (ou des horaires par défaut).
 * - Les réservations actives et les indisponibilités retirent les créneaux.
 * - Les verrous temporaires expirés (en_attente > 15 min) sont ignorés (libération paresseuse).
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Statuts qui bloquent un créneau
const BLOCKING_STATUSES = ['paye_confirme', 'attente_paiement_sur_place', 'en_attente'] as const;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get('serviceId');
    const dateStr = searchParams.get('date');

    if (!serviceId || !dateStr) {
      return NextResponse.json(
        { error: 'Paramètres manquants : serviceId et date (YYYY-MM-DD) requis' },
        { status: 400 }
      );
    }

    const day = parseDayDate(dateStr);
    if (!day) {
      return NextResponse.json(
        { error: 'Date invalide — format attendu : YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const dayOfWeek = dayOfWeekOf(dateStr);
    if (dayOfWeek === null) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 });
    }

    // 1. Prestation (durée en minutes pour le découpage)
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { durationMinutes: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Service introuvable' }, { status: 404 });
    }

    // 2. Règles de disponibilité actives
    const rules = await prisma.availabilityRule.findMany({
      where: { isActive: true },
      select: { dayOfWeek: true, startTime: true, endTime: true, bufferMinutes: true },
    });

    // 3. Indisponibilités du jour
    const unavailabilities = await prisma.unavailability.findMany({
      where: {
        AND: [{ startAt: { lt: day.end } }, { endAt: { gt: day.start } }],
      },
      select: { startAt: true, endAt: true },
    });

    // 4. Réservations actives du jour
    const bookingsRaw = await prisma.reservation.findMany({
      where: {
        AND: [
          { startAt: { not: null } },
          { startAt: { lt: day.end } },
          { endAt: { gt: day.start } },
          { status: { in: [...BLOCKING_STATUSES] } },
        ],
      },
      select: { startAt: true, endAt: true, status: true, holdExpiresAt: true },
    });

    // Libération paresseuse : ignorer les verrous expirés
    const now = new Date();
    const bookings = bookingsRaw
      .filter((b) => !(b.status === 'en_attente' && b.holdExpiresAt && b.holdExpiresAt < now))
      .map((b) => ({ startAt: b.startAt as Date, endAt: b.endAt as Date }));

    // 5. Calcul des créneaux libres
    const slots = getAvailableSlots({
      dateStr,
      durationMinutes: service.durationMinutes,
      rules: rules.length > 0 ? rules : DEFAULT_AVAILABILITY.map((r) => ({ ...r, bufferMinutes: 0 })),
      unavailabilities,
      bookings,
      now,
    });

    return NextResponse.json({
      date: dateStr,
      timezone: 'Europe/Paris',
      durationMinutes: service.durationMinutes,
      dayOfWeek,
      slots: slots.map((s) => ({ start: s.start.toISOString(), end: s.end.toISOString() })),
    });
  } catch (error) {
    console.error('[SLOTS] Erreur lors du calcul des créneaux:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
