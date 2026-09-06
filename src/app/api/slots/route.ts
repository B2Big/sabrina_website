import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db-services';
import { fetchBlockingRanges } from '@/lib/booking';
import { getAvailableSlots, parseDayDate, dayOfWeekOf, DEFAULT_AVAILABILITY } from '@/lib/slots';

/**
 * GET /api/slots?serviceId=xxx&date=YYYY-MM-DD
 *
 * Retourne les créneaux libres du jour (Europe/Paris) pour une prestation.
 * - Les horaires viennent des règles admin (ou des horaires par défaut).
 * - Réservations actives, indisponibilités et verrous actifs retirent les créneaux.
 * - Les verrous expirés sont ignorés (libération paresseuse).
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

    // 3. Tout ce qui occupe des créneaux ce jour-là (indispos + réservations + verrous)
    const blocking = await fetchBlockingRanges(day.start, day.end);
    const bookings = [...blocking.bookings, ...blocking.locks.map((l) => ({ startAt: l.startAt, endAt: l.endAt }))];

    // 4. Calcul des créneaux libres
    const slots = getAvailableSlots({
      dateStr,
      durationMinutes: service.durationMinutes,
      rules: rules.length > 0 ? rules : DEFAULT_AVAILABILITY.map((r) => ({ ...r, bufferMinutes: 0 })),
      unavailabilities: blocking.unavailabilities.map((u) => ({ startAt: u.startAt, endAt: u.endAt })),
      bookings,
      now: new Date(),
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
