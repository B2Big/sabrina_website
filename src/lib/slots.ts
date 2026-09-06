/**
 * Logique de calcul des créneaux disponibles (booking).
 *
 * Conventions :
 * - Toutes les dates sont stockées/manipulées en UTC (Date).
 * - Les entrées utilisateur ("YYYY-MM-DD", "HH:MM") sont en Europe/Paris.
 * - Un créneau disponible = plage d'ouverture − (chevauchements + buffers + verrous actifs).
 */

export type TimeSlot = { start: Date; end: Date };

export type AvailabilityRuleInput = {
  dayOfWeek: number; // 0 = dimanche ... 6 = samedi
  startTime: string; // "HH:MM" heure locale
  endTime: string; // "HH:MM" heure locale
  bufferMinutes: number;
};

export type SlotsInput = {
  dateStr: string; // "YYYY-MM-DD" (jour local Europe/Paris)
  durationMinutes: number; // durée d'une prestation
  rules: AvailabilityRuleInput[];
  unavailabilities: { startAt: Date; endAt: Date }[];
  bookings: { startAt: Date; endAt: Date }[];
  now?: Date;
};

const PARIS_TZ = 'Europe/Paris';

/** Pas de découpe : créneaux proposés toutes les 30 minutes */
export const STEP_MINUTES = 30;

/** Horaires par défaut si aucune règle n'est enregistrée (alignés sur le site) */
export const DEFAULT_AVAILABILITY: Omit<AvailabilityRuleInput, 'bufferMinutes'>[] = [
  { dayOfWeek: 1, startTime: '08:00', endTime: '20:00' }, // lundi
  { dayOfWeek: 2, startTime: '08:00', endTime: '20:00' }, // mardi
  { dayOfWeek: 3, startTime: '08:00', endTime: '20:00' }, // mercredi
  { dayOfWeek: 4, startTime: '08:00', endTime: '20:00' }, // jeudi
  { dayOfWeek: 5, startTime: '08:00', endTime: '20:00' }, // vendredi
  { dayOfWeek: 6, startTime: '09:00', endTime: '18:00' }, // samedi
  // dimanche : fermé
];

/**
 * Offset en minutes entre l'heure locale d'un fuseau et UTC, pour un instant donné.
 * Gère correctement les changements d'heure été/hiver (DST).
 */
export function tzOffsetMinutes(instant: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const parts: Record<string, number> = {};
  for (const part of dtf.formatToParts(instant)) {
    if (part.type !== 'literal') parts[part.type] = parseInt(part.value, 10);
  }

  const hour = parts.hour % 24; // Intl peut renvoyer 24 pour minuit
  const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, hour, parts.minute, parts.second);
  return Math.round((asUtc - instant.getTime()) / 60000);
}

/**
 * Valide "YYYY-MM-DD" et retourne [minuit local, minuit local + 24h] en UTC.
 * Retourne null si la date est invalide.
 */
export function parseDayDate(dateStr: string): { start: Date; end: Date } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);

  const midnightUtc = new Date(Date.UTC(year, month - 1, day));
  // Vérifie que la date est réelle (rejette 2026-02-30)
  if (
    midnightUtc.getUTCFullYear() !== year ||
    midnightUtc.getUTCMonth() !== month - 1 ||
    midnightUtc.getUTCDate() !== day
  ) {
    return null;
  }

  const offset = tzOffsetMinutes(midnightUtc, PARIS_TZ);
  const start = new Date(midnightUtc.getTime() - offset * 60000);
  const end = new Date(start.getTime() + 24 * 3600 * 1000);
  return { start, end };
}

/**
 * Jour de la semaine (0 = dimanche ... 6 = samedi) d'une date "YYYY-MM-DD".
 * Retourne null si la date est invalide.
 */
export function dayOfWeekOf(dateStr: string): number | null {
  const day = parseDayDate(dateStr);
  if (!day) return null;
  // Le jour calendaire est identique quel que soit le fuseau : utiliser la date UTC directe
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Convertit "HH:MM" (heure locale du jour) en instant UTC */
function localTimeToUtc(dayStart: Date, time: string): Date {
  const [h, m] = time.split(':').map(Number);
  return new Date(dayStart.getTime() + (h * 60 + m) * 60000);
}

function overlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && aEnd > bStart;
}

/**
 * Calcule les créneaux libres d'un jour donné pour une prestation.
 *
 * Logique : pour chaque règle d'ouverture du jour (ou les horaires par défaut),
 * découper des slots de `durationMinutes` (pas de STEP_MINUTES), puis exclure
 * ceux qui chevauchent une indisponibilité ou une réservation existante
 * (avec la marge buffer de la règle), et ceux déjà passés.
 */
export function getAvailableSlots(input: SlotsInput): TimeSlot[] {
  const { dateStr, durationMinutes, now = new Date() } = input;

  if (durationMinutes <= 0) return [];

  const day = parseDayDate(dateStr);
  if (!day) return [];

  const dayOfWeek = dayOfWeekOf(dateStr);
  if (dayOfWeek === null) return [];

  // Règles du jour (fallback : horaires par défaut)
  const dayRules: AvailabilityRuleInput[] = input.rules.filter((r) => r.dayOfWeek === dayOfWeek);
  const effectiveRules: AvailabilityRuleInput[] =
    dayRules.length > 0
      ? dayRules
      : DEFAULT_AVAILABILITY.filter((r) => r.dayOfWeek === dayOfWeek).map((r) => ({
          ...r,
          bufferMinutes: 0,
        }));

  const slots: TimeSlot[] = [];
  const seen = new Set<string>();

  for (const rule of effectiveRules) {
    const ruleStart = localTimeToUtc(day.start, rule.startTime);
    const ruleEnd = localTimeToUtc(day.start, rule.endTime);
    if (ruleEnd.getTime() <= ruleStart.getTime()) continue;

    const bufferMs = rule.bufferMinutes * 60000;

    for (
      let t = ruleStart.getTime();
      t + durationMinutes * 60000 <= ruleEnd.getTime();
      t += STEP_MINUTES * 60000
    ) {
      const slotStart = t;
      const slotEnd = t + durationMinutes * 60000;

      // Déjà passé ?
      if (slotStart <= now.getTime()) continue;

      // Chevauche une indisponibilité ?
      const blockedByUnavailability = input.unavailabilities.some((u) =>
        overlaps(slotStart, slotEnd, u.startAt.getTime(), u.endAt.getTime())
      );
      if (blockedByUnavailability) continue;

      // Chevauche une réservation existante (+ buffer autour) ?
      const blockedByBooking = input.bookings.some((b) =>
        overlaps(slotStart, slotEnd, b.startAt.getTime() - bufferMs, b.endAt.getTime() + bufferMs)
      );
      if (blockedByBooking) continue;

      const key = `${slotStart}-${slotEnd}`;
      if (seen.has(key)) continue;
      seen.add(key);

      slots.push({ start: new Date(slotStart), end: new Date(slotEnd) });
    }
  }

  return slots.sort((a, b) => a.start.getTime() - b.start.getTime());
}
