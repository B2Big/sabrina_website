/**
 * Fonctions serveur de booking : verrou temporaire de créneau et vérification
 * de disponibilité au moment de finaliser une réservation.
 */

import { prisma } from '@/lib/db-services';

/** Durée de validité d'un verrou temporaire de créneau (minutes) */
export const HOLD_MINUTES = 15;

// Statuts de réservation qui occupent un créneau
const BLOCKING_STATUSES = ['paye_confirme', 'attente_paiement_sur_place', 'en_attente'] as const;

export type BlockingRange = {
  startAt: Date;
  endAt: Date;
  lockId?: string;
};

/**
 * Récupère toutes les plages qui occupent un créneau sur une fenêtre donnée :
 * indisponibilités, réservations actives (verrous expirés ignorés) et locks actifs.
 */
export async function fetchBlockingRanges(startUtc: Date, endUtc: Date): Promise<{
  unavailabilities: BlockingRange[];
  bookings: BlockingRange[];
  locks: BlockingRange[];
}> {
  const now = new Date();

  const [unavailabilities, bookingsRaw, locksRaw] = await Promise.all([
    prisma.unavailability.findMany({
      where: {
        AND: [{ startAt: { lt: endUtc } }, { endAt: { gt: startUtc } }],
      },
      select: { startAt: true, endAt: true },
    }),
    prisma.reservation.findMany({
      where: {
        AND: [
          { startAt: { not: null } },
          { startAt: { lt: endUtc } },
          { endAt: { gt: startUtc } },
          { status: { in: [...BLOCKING_STATUSES] } },
        ],
      },
      select: { startAt: true, endAt: true, status: true, holdExpiresAt: true },
    }),
    prisma.slotLock.findMany({
      where: {
        AND: [
          { startAt: { lt: endUtc } },
          { endAt: { gt: startUtc } },
          { expiresAt: { gt: now } },
        ],
      },
      select: { id: true, startAt: true, endAt: true },
    }),
  ]);

  // Libération paresseuse : ignorer les réservations en_attente dont le verrou a expiré
  const bookings: BlockingRange[] = bookingsRaw
    .filter((b) => !(b.status === 'en_attente' && b.holdExpiresAt && b.holdExpiresAt < now))
    .map((b) => ({ startAt: b.startAt as Date, endAt: b.endAt as Date }));

  const locks: BlockingRange[] = locksRaw.map((l) => ({
    startAt: l.startAt,
    endAt: l.endAt,
    lockId: l.id,
  }));

  return {
    unavailabilities: unavailabilities.map((u) => ({ startAt: u.startAt, endAt: u.endAt })),
    bookings,
    locks,
  };
}

function overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart.getTime() < bEnd.getTime() && aEnd.getTime() > bStart.getTime();
}

/**
 * Vérifie qu'un créneau est encore libre au moment de finaliser.
 * `excludeLockId` : le verrou du client courant (pour ne pas se bloquer soi-même).
 * Retourne true si libre.
 */
export async function isSlotFree(
  startUtc: Date,
  endUtc: Date,
  excludeLockId?: string
): Promise<boolean> {
  const { unavailabilities, bookings, locks } = await fetchBlockingRanges(startUtc, endUtc);

  const blockers: BlockingRange[] = [
    ...unavailabilities,
    ...bookings,
    ...locks.filter((l) => l.lockId !== excludeLockId),
  ];

  return !blockers.some((b) => overlaps(startUtc, endUtc, b.startAt, b.endAt));
}

/**
 * Crée un verrou temporaire de créneau (soft-lock).
 * Retourne le verrou créé, ou null si le créneau est déjà pris.
 */
export async function createSlotLock(
  startUtc: Date,
  endUtc: Date,
  serviceId?: string
): Promise<{ id: string; expiresAt: Date } | null> {
  const free = await isSlotFree(startUtc, endUtc);
  if (!free) return null;

  const expiresAt = new Date(Date.now() + HOLD_MINUTES * 60000);

  const lock = await prisma.slotLock.create({
    data: {
      startAt: startUtc,
      endAt: endUtc,
      serviceId: serviceId ?? null,
      expiresAt,
    },
    select: { id: true, expiresAt: true },
  });

  return lock;
}

/**
 * Libère un verrou de créneau (appelé après finalisation de la réservation).
 * Silencieux si le verrou n'existe plus.
 */
export async function releaseSlotLock(lockId?: string | null): Promise<void> {
  if (!lockId) return;
  try {
    await prisma.slotLock.deleteMany({ where: { id: lockId } });
  } catch (error) {
    console.error('[BOOKING] Erreur libération du verrou:', error);
  }
}
