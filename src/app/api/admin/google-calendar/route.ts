import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/auth/api-guard';
import {
  syncGoogleUnavailabilities,
  disconnectGoogleCalendar,
  getConnectedCalendarEmail,
} from '@/lib/google-calendar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/google-calendar
 * Body : { action: 'sync' | 'disconnect' | 'status' }
 * Admin uniquement.
 */
export async function POST(req: Request) {
  await requireAdminApi();

  const { action } = await req.json().catch(() => ({ action: 'sync' }));

  if (action === 'disconnect') {
    await disconnectGoogleCalendar();
    return NextResponse.json({ connected: false });
  }

  if (action === 'status') {
    const email = await getConnectedCalendarEmail();
    return NextResponse.json({ connected: email !== null, email });
  }

  try {
    const result = await syncGoogleUnavailabilities(30);
    return NextResponse.json({ success: true, imported: result.imported });
  } catch (error) {
    console.error('[GOOGLE-SYNC] Erreur:', error);
    return NextResponse.json(
      { error: 'Synchronisation échouée — vérifiez la connexion Google Calendar' },
      { status: 500 }
    );
  }
}
