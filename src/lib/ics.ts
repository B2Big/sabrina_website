/**
 * Génération de fichiers iCalendar (.ics) pour les emails de confirmation.
 * Le fichier .ics permet au client d'ajouter le rendez-vous à son agenda
 * (iPhone, Android, Google Calendar) en un clic.
 */

export type IcsEventInput = {
  start: Date; // UTC
  end: Date; // UTC
  title: string;
  description?: string;
  location?: string;
  uid: string; // identifiant unique stable (ex: id de réservation)
};

/** Format iCalendar : 20260914T080000Z */
function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Échappement des caractères spéciaux iCalendar (RFC 5545) */
function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

export function createIcsEvent({ start, end, title, description, location, uid }: IcsEventInput): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sab-Fit//Rendez-vous//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}@sab-fit.com`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcs(title)}`,
  ];

  if (description) {
    lines.push(`DESCRIPTION:${escapeIcs(description)}`);
  }
  if (location) {
    lines.push(`LOCATION:${escapeIcs(location)}`);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

/**
 * Construit la pièce jointe au format attendu par l'API Resend
 * (contenu encodé en base64).
 */
export function buildIcsAttachment(
  event: IcsEventInput
): { filename: string; content: string } {
  const ics = createIcsEvent(event);
  return {
    filename: 'rendez-vous-sab-fit.ics',
    content: Buffer.from(ics, 'utf-8').toString('base64'),
  };
}
