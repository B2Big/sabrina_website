'use server'

import { prisma } from '@/lib/db-services'
import { headers } from 'next/headers'
import { DEFAULT_AUDIT_LOG_LIMIT, ONE_DAY } from './constants'

export type AdminAction = 
  | 'CREATE_SERVICE'
  | 'UPDATE_SERVICE'
  | 'DELETE_SERVICE'
  | 'CREATE_PROMOTION'
  | 'UPDATE_PROMOTION'
  | 'DELETE_PROMOTION'
  | 'TOGGLE_PROMOTION'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT_DATA'
  | 'CLEANUP_DATA'

export type AuditDetails = Record<string, unknown>

/**
 * Enregistre une action admin dans l'audit trail
 */
export async function logAdminAction(
  userId: string,
  userEmail: string,
  action: AdminAction,
  entityType: string,
  entityId?: string,
  details?: AuditDetails
) {
  try {
    const headersList = await headers()
    
    await prisma.adminLog.create({
      data: {
        userId,
        userEmail,
        action,
        entityType,
        entityId,
        details: details ? JSON.stringify(details) : null,
        ipAddress: headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown',
        userAgent: headersList.get('user-agent') || 'unknown',
      }
    })
    
    console.log(`📝 Audit: ${action} par ${userEmail} sur ${entityType}${entityId ? ` (${entityId})` : ''}`)
  } catch (error) {
    // Ne pas bloquer l'action si l'audit échoue, mais logger l'erreur
    console.error('❌ Erreur lors de l\'enregistrement de l\'audit:', error)
  }
}

/**
 * Récupère les logs d'audit (pour la page audit admin)
 */
export async function getAdminLogs(
  limit: number = DEFAULT_AUDIT_LOG_LIMIT,
  offset: number = 0,
  filters?: {
    userId?: string
    action?: AdminAction
    entityType?: string
    startDate?: Date
    endDate?: Date
  }
) {
  const where: Record<string, unknown> = {}
  
  if (filters?.userId) where.userId = filters.userId
  if (filters?.action) where.action = filters.action
  if (filters?.entityType) where.entityType = filters.entityType
  if (filters?.startDate || filters?.endDate) {
    where.createdAt = {}
    if (filters.startDate) (where.createdAt as Record<string, Date>).gte = filters.startDate
    if (filters.endDate) (where.createdAt as Record<string, Date>).lte = filters.endDate
  }
  
  const [logs, total] = await Promise.all([
    prisma.adminLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.adminLog.count({ where })
  ])
  
  return { logs, total }
}

/**
 * Récupère les statistiques d'audit
 */
export async function getAuditStats() {
  const [
    totalActions,
    actionsToday,
    uniqueAdmins,
    recentActions
  ] = await Promise.all([
    prisma.adminLog.count(),
    prisma.adminLog.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - ONE_DAY)
        }
      }
    }),
    prisma.adminLog.groupBy({
      by: ['userId'],
      _count: { userId: true }
    }).then(result => result.length),
    prisma.adminLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        action: true,
        userEmail: true,
        createdAt: true,
        entityType: true
      }
    })
  ])
  
  return {
    totalActions,
    actionsToday,
    uniqueAdmins,
    recentActions
  }
}
