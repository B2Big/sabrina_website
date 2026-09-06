import { NextResponse } from 'next/server';
import { createSlotLock, HOLD_MINUTES } from '@/lib/booking';

/**
 * POST /api/slots/lock
 * Body : { start: ISO, end: ISO, serviceId?: string }
 *
 * Pose un verrou temporaire (soft-lock) sur un créneau le temps de la saisie
 * de paiement. Retourne 409 si le créneau vient d'être pris.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LOCK_HOURS = 12;
const MAX_FORWARD_DAYS = 120;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const startStr = typeof body?.start === 'string' ? body.start : null;
    const endStr = typeof body?.end === 'string' ? body.end : null;
    const serviceId = typeof body?.serviceId === 'string' && body.serviceId ? body.serviceId : undefined;

    if (!startStr || !endStr) {
      return NextResponse.json({ error: 'start et end (ISO) requis' }, { status: 400 });
    }

    const start = new Date(startStr);
    const end = new Date(endStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json({ error: 'Dates invalides' }, { status: 400 });
    }

    if (end.getTime() <= start.getTime()) {
      return NextResponse.json({ error: 'end doit être après start' }, { status: 400 });
    }

    if (end.getTime() - start.getTime() > MAX_LOCK_HOURS * 3600 * 1000) {
      return NextResponse.json({ error: 'Durée de créneau trop longue' }, { status: 400 });
    }

    const now = new Date();
    if (start.getTime() <= now.getTime()) {
      return NextResponse.json({ error: 'Le créneau est déjà passé' }, { status: 400 });
    }

    if (start.getTime() > now.getTime() + MAX_FORWARD_DAYS * 24 * 3600 * 1000) {
      return NextResponse.json({ error: 'Créneau trop éloigné' }, { status: 400 });
    }

    const lock = await createSlotLock(start, end, serviceId);

    if (!lock) {
      return NextResponse.json(
        { error: 'Ce créneau vient d\'être réservé par quelqu\'un d\'autre' },
        { status: 409 }
      );
    }

    return NextResponse.json({
      lockId: lock.id,
      expiresAt: lock.expiresAt.toISOString(),
      holdMinutes: HOLD_MINUTES,
    });
  } catch (error) {
    console.error('[SLOTS-LOCK] Erreur lors du verrouillage:', error);
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 });
  }
}
