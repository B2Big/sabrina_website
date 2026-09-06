import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth/api-guard';
import { getGoogleAuthUrl, isGoogleCalendarConfigured } from '@/lib/google-calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/google-calendar/auth
 * Démarre le flux OAuth2 (redirection vers Google). Admin uniquement.
 */
export async function GET() {
  await requireAdminApi();

  if (!isGoogleCalendarConfigured()) {
    return NextResponse.json(
      { error: 'Google Calendar non configuré (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET / CALENDAR_ENCRYPTION_KEY)' },
      { status: 503 }
    );
  }

  return NextResponse.redirect(getGoogleAuthUrl());
}
