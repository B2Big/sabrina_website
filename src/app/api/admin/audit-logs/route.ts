import { NextRequest, NextResponse } from 'next/server'
import { getAdminLogs, getAuditStats } from '@/lib/audit'
import { requireAdmin } from '@/lib/auth/session'

export async function GET(request: NextRequest) {
  try {
    // 🔒 Vérifier que l'utilisateur est admin
    await requireAdmin()

    // Récupérer les paramètres
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Récupérer les logs et stats en parallèle
    const [{ logs, total }, stats] = await Promise.all([
      getAdminLogs(limit, offset),
      getAuditStats()
    ])

    return NextResponse.json({ logs, total, stats })
  } catch (error) {
    console.error('Erreur API audit-logs:', error)
    
    if (error instanceof Error && error.message.includes('Non autorisé')) {
      return NextResponse.json(
        { error: 'Accès interdit' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
