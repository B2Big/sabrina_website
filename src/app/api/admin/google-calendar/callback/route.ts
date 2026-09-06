import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth/api-guard';
import { handleGoogleAuthCallback } from '@/lib/google-calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/google-calendar/callback?code=...
 * Callback OAuth2 après consentement Google. Stocke le token chiffré puis
 * redirige vers l'admin. Admin uniquement (cookie de session).
 */
export async function GET(req: Request) {
  try {
    await requireAdminApi();
  } catch {
    return NextResponse.redirect(new URL('/forbidden', req.url));
  }

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/admin?calendar=error', req.url));
  }

  try {
    await handleGoogleAuthCallback(code);
    return NextResponse.redirect(new URL('/admin?calendar=connected', req.url));
  } catch (err) {
    console.error('[GOOGLE-CALLBACK] Erreur:', err);
    return NextResponse.redirect(new URL('/admin?calendar=error', req.url));
  }
}
