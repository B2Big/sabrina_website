/**
 * Intégration Google Calendar (OAuth2 mono-compte — l'agenda de Sabrina).
 *
 * - Connexion OAuth2 (authorization code) avec refresh token chiffré en base.
 * - Sync descendante : les événements "occupés" de l'agenda deviennent des
 *   indisponibilités (source = "google") qui masquent les créneaux du site.
 * - Sync montante : chaque réservation confirmée crée un événement dans l'agenda.
 *
 * L'intégration est INACTIVE tant que GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET /
 * CALENDAR_ENCRYPTION_KEY ne sont pas configurés.
 */

import { prisma } from '@/lib/db-services';
import crypto from 'node:crypto';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_CALENDAR_API = 'https://www.googleapis.com/calendar/v3';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

export function isGoogleCalendarConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.CALENDAR_ENCRYPTION_KEY
  );
}

function getRedirectUri(): string {
  const base = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  return `${base}/api/admin/google-calendar/callback`;
}

// ============================================
// CHIFFREMENT DES TOKENS (AES-256-GCM)
// ============================================

function getEncryptionKey(): Buffer {
  const key = process.env.CALENDAR_ENCRYPTION_KEY;
  if (!key) throw new Error('CALENDAR_ENCRYPTION_KEY non configurée');
  return crypto.createHash('sha256').update(key).digest();
}

export function encryptToken(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}.${tag.toString('base64')}.${encrypted.toString('base64')}`;
}

export function decryptToken(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split('.');
  if (!ivB64 || !tagB64 || !dataB64) throw new Error('Token chiffré invalide');
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    getEncryptionKey(),
    Buffer.from(ivB64, 'base64')
  );
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

// ============================================
// FLUX OAuth2
// ============================================

export function getGoogleAuthUrl(): string {
  if (!isGoogleCalendarConfigured()) return '';
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: getRedirectUri(),
    response_type: 'code',
    access_type: 'offline', // → refresh token
    prompt: 'consent',
    scope: SCOPES.join(' '),
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function handleGoogleAuthCallback(code: string): Promise<{ email: string }> {
  if (!isGoogleCalendarConfigured()) throw new Error('Google Calendar non configuré');

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: getRedirectUri(),
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Échec échange du code OAuth : ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const accessToken: string = data.access_token;
  const refreshToken: string | undefined = data.refresh_token;
  const expiresIn: number = data.expires_in ?? 3600;

  if (!refreshToken) {
    throw new Error('Refresh token manquant (réessayez avec un compte non déjà autorisé)');
  }

  // Récupérer l'email du compte connecté
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = await profileRes.json();
  const email: string = profile.email || 'agenda-sabrina';

  // Upsert du token chiffré
  const expiresAt = new Date(Date.now() + expiresIn * 1000);
  await prisma.googleCalendarToken.upsert({
    where: { email },
    update: {
      accessToken: encryptToken(accessToken),
      refreshToken: encryptToken(refreshToken),
      expiresAt,
    },
    create: {
      email,
      accessToken: encryptToken(accessToken),
      refreshToken: encryptToken(refreshToken),
      expiresAt,
    },
  });

  return { email };
}

export async function disconnectGoogleCalendar(): Promise<void> {
  await prisma.googleCalendarToken.deleteMany({});
}

export async function getConnectedCalendarEmail(): Promise<string | null> {
  const token = await prisma.googleCalendarToken.findFirst({ select: { email: true } });
  return token?.email ?? null;
}

/** Retourne un access token valide (rafraîchi si expiré), ou null si non connecté. */
async function getValidAccessToken(): Promise<string | null> {
  if (!isGoogleCalendarConfigured()) return null;

  const stored = await prisma.googleCalendarToken.findFirst();
  if (!stored) return null;

  if (stored.expiresAt.getTime() > Date.now() + 60 * 1000) {
    return decryptToken(stored.accessToken);
  }

  // Rafraîchir
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: decryptToken(stored.refreshToken),
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) {
    console.error('[GOOGLE] Refresh token rejeté — reconnexion nécessaire');
    return null;
  }

  const data = await res.json();
  await prisma.googleCalendarToken.update({
    where: { id: stored.id },
    data: {
      accessToken: encryptToken(data.access_token),
      expiresAt: new Date(Date.now() + (data.expires_in ?? 3600) * 1000),
    },
  });

  return data.access_token;
}

// ============================================
// SYNC DESCENDANTE : indispos Google → blocages
// ============================================

/**
 * Récupère les événements "occupés" de l'agenda sur une fenêtre donnée
 * et les transforme en indisponibilités (source = "google").
 */
export async function syncGoogleUnavailabilities(daysAhead = 30): Promise<{ imported: number }> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) return { imported: 0 };

  const timeMin = new Date();
  const timeMax = new Date(timeMin.getTime() + daysAhead * 24 * 3600 * 1000);

  const res = await fetch(
    `${GOOGLE_CALENDAR_API}/calendars/primary/events?` +
      new URLSearchParams({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '250',
      }),
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) {
    throw new Error(`Google API error: ${res.status}`);
  }

  const data = await res.json();
  const events: Array<{ id: string; start?: { dateTime?: string; date?: string }; end?: { dateTime?: string; date?: string }; summary?: string }> =
    data.items || [];

  // 1. Supprimer les anciennes indispos "google" (on réimporte tout)
  await prisma.unavailability.deleteMany({ where: { source: 'google' } });

  // 2. Importer les événements occupés (ceux qui ont une heure précise)
  let imported = 0;
  for (const event of events) {
    const start = event.start?.dateTime;
    const end = event.end?.dateTime;
    if (!start || !end) continue; // événements journée entière : ignorés pour l'instant

    const startAt = new Date(start);
    const endAt = new Date(end);
    if (endAt.getTime() <= startAt.getTime()) continue;
    if (startAt.getTime() < Date.now()) continue; // déjà passé

    await prisma.unavailability.create({
      data: {
        startAt,
        endAt,
        reason: event.summary || 'Indisponible (agenda)',
        source: 'google',
      },
    });
    imported++;
  }

  return { imported };
}

// ============================================
// SYNC MONTANTE : réservations → événements Google
// ============================================

export async function createGoogleEventForReservation(reservation: {
  id: string;
  startAt: Date | null;
  endAt: Date | null;
  serviceTitle: string;
  customerName: string;
  customerPhone: string;
}): Promise<void> {
  const accessToken = await getValidAccessToken();
  if (!accessToken) return;
  if (!reservation.startAt || !reservation.endAt) return;

  const res = await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      summary: `${reservation.serviceTitle} — ${reservation.customerName}`,
      description: `Réservation Sab-Fit\nClient : ${reservation.customerName}\nTéléphone : ${reservation.customerPhone}\nRéf : ${reservation.id.slice(0, 8).toUpperCase()}`,
      start: { dateTime: reservation.startAt.toISOString(), timeZone: 'Europe/Paris' },
      end: { dateTime: reservation.endAt.toISOString(), timeZone: 'Europe/Paris' },
    }),
  });

  if (!res.ok) {
    console.error('[GOOGLE] Échec création événement:', res.status);
    return;
  }

  const event = await res.json();
  if (event.id) {
    await prisma.reservation.update({
      where: { id: reservation.id },
      data: { googleEventId: event.id },
    });
  }
}

export async function deleteGoogleEventForReservation(googleEventId: string | null): Promise<void> {
  if (!googleEventId) return;
  const accessToken = await getValidAccessToken();
  if (!accessToken) return;

  try {
    await fetch(`${GOOGLE_CALENDAR_API}/calendars/primary/events/${googleEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (error) {
    console.error('[GOOGLE] Échec suppression événement:', error);
  }
}
