'use server'

import { prisma } from '@/lib/db-services'
import { requireAdmin } from '@/lib/auth/session'

/**
 * Récupérer tous les abonnés newsletter
 */
export async function getNewsletterSubscribers() {
  try {
    await requireAdmin()

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' }
    })

    return subscribers
  } catch (error) {
    console.error('Failed to fetch newsletter subscribers:', error)
    return []
  }
}

/**
 * Statistiques newsletter
 */
export async function getNewsletterStats() {
  try {
    await requireAdmin()

    const total = await prisma.newsletterSubscriber.count()
    const active = await prisma.newsletterSubscriber.count({
      where: { isSubscribed: true }
    })
    const unsubscribed = await prisma.newsletterSubscriber.count({
      where: { isSubscribed: false }
    })

    // Nouveaux abonnés cette semaine
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const newThisWeek = await prisma.newsletterSubscriber.count({
      where: {
        subscribedAt: { gte: oneWeekAgo },
        isSubscribed: true
      }
    })

    return {
      total,
      active,
      unsubscribed,
      newThisWeek
    }
  } catch (error) {
    console.error('Failed to fetch newsletter stats:', error)
    return {
      total: 0,
      active: 0,
      unsubscribed: 0,
      newThisWeek: 0
    }
  }
}

/**
 * Désabonner un utilisateur (action admin)
 */
export async function unsubscribeUser(email: string) {
  try {
    await requireAdmin()

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isSubscribed: false,
        unsubscribedAt: new Date()
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to unsubscribe user:', error)
    return { success: false, error: 'Failed to unsubscribe user' }
  }
}

/**
 * Réabonner un utilisateur
 */
export async function resubscribeUser(email: string) {
  try {
    await requireAdmin()

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: {
        isSubscribed: true,
        subscribedAt: new Date(),
        unsubscribedAt: null
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to resubscribe user:', error)
    return { success: false, error: 'Failed to resubscribe user' }
  }
}

/**
 * Supprimer définitivement un abonné (RGPD)
 */
export async function deleteSubscriber(email: string) {
  try {
    await requireAdmin()

    await prisma.newsletterSubscriber.delete({
      where: { email }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to delete subscriber:', error)
    return { success: false, error: 'Failed to delete subscriber' }
  }
}
