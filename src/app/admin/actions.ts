'use server'

import { prisma, getAllServices } from '@/lib/db-services'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/session'
import { serviceSchema, promotionSchema } from '@/lib/validations/schemas'
import { z } from 'zod'
import { logAdminAction } from '@/lib/audit'

export async function signOut() {
  const { signOut: serverSignOut } = await import('@/lib/auth/session')
  await serverSignOut()
  revalidatePath('/', 'layout')
  return { success: true }
}

export type ServiceFormData = {
  id?: string
  title: string
  category: string
  price: string
  originalPrice?: string
  description: string
  duration?: string
  objective?: string
  popular: boolean
  bestValue: boolean
  note?: string
  features: string[]
  paymentLink?: string
  order?: number
}

export type PromotionFormData = {
  id?: string
  text: string
  link?: string
  isActive: boolean
  startDate?: string | null
  endDate?: string | null
  discountPercent?: number
  serviceIds?: string[]
}

export async function getServices() {
  await requireAdmin()
  return await getAllServices()
}

export async function getPromotions() {
  await requireAdmin()
  try {
    return await prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' },
      include: { services: true }
    })
  } catch (error) {
    console.error("Failed to fetch promotions:", error)
    return []
  }
}

export async function upsertPromotion(data: PromotionFormData) {
  try {
    const user = await requireAdmin()

    // 🔒 Validation Zod
    const validatedData = promotionSchema.parse(data)

    if (validatedData.id) {
      const updated = await prisma.promotion.update({
        where: { id: validatedData.id },
        data: {
          text: validatedData.text,
          link: validatedData.link,
          isActive: validatedData.isActive,
          startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
          endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
          discountPercent: validatedData.discountPercent || null,
          services: {
            set: [], // Clear previous connections
            connect: validatedData.serviceIds?.map(id => ({ id })) || [] // Connect new ones
          }
        }
      })
      
      // 📝 Audit trail
      await logAdminAction(
        user.id,
        user.email,
        'UPDATE_PROMOTION',
        'Promotion',
        updated.id,
        { text: validatedData.text, isActive: validatedData.isActive }
      )
    } else {
      const created = await prisma.promotion.create({
        data: {
          text: validatedData.text,
          link: validatedData.link,
          isActive: validatedData.isActive,
          startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
          endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
          discountPercent: validatedData.discountPercent || null,
          services: {
            connect: validatedData.serviceIds?.map(id => ({ id })) || []
          }
        }
      })
      
      // 📝 Audit trail
      await logAdminAction(
        user.id,
        user.email,
        'CREATE_PROMOTION',
        'Promotion',
        created.id,
        { text: validatedData.text }
      )
    }
    
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Failed to upsert promotion:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to save promotion' }
  }
}

export async function deletePromotion(id: string) {
  try {
    const user = await requireAdmin()
    
    await prisma.promotion.delete({ where: { id } })
    
    // 📝 Audit trail
    await logAdminAction(
      user.id,
      user.email,
      'DELETE_PROMOTION',
      'Promotion',
      id,
      { deletedAt: new Date().toISOString() }
    )
    
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete promotion' }
  }
}

export async function togglePromotion(id: string, isActive: boolean) {
  try {
    const user = await requireAdmin()
    
    await prisma.promotion.update({
      where: { id },
      data: { isActive }
    })
    
    // 📝 Audit trail
    await logAdminAction(
      user.id,
      user.email,
      'TOGGLE_PROMOTION',
      'Promotion',
      id,
      { isActive }
    )
    
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to toggle promotion' }
  }
}

export async function upsertService(data: ServiceFormData) {
  try {
    const user = await requireAdmin()

    // 🔒 Validation Zod
    const validatedData = serviceSchema.parse(data)

    if (validatedData.id) {
      const updated = await prisma.service.update({
        where: { id: validatedData.id },
        data: {
          title: validatedData.title,
          category: validatedData.category,
          price: validatedData.price,
          originalPrice: validatedData.originalPrice,
          description: validatedData.description,
          duration: validatedData.duration,
          objective: validatedData.objective,
          popular: validatedData.popular,
          bestValue: validatedData.bestValue,
          note: validatedData.note,
          features: validatedData.features,
          paymentLink: validatedData.paymentLink
        }
      })
      
      // 📝 Audit trail
      await logAdminAction(
        user.id,
        user.email,
        'UPDATE_SERVICE',
        'Service',
        updated.id,
        { title: validatedData.title, category: validatedData.category }
      )
    } else {
      const created = await prisma.service.create({
        data: {
          title: validatedData.title,
          category: validatedData.category,
          price: validatedData.price,
          originalPrice: validatedData.originalPrice,
          description: validatedData.description,
          duration: validatedData.duration,
          objective: validatedData.objective,
          popular: validatedData.popular,
          bestValue: validatedData.bestValue,
          note: validatedData.note,
          features: validatedData.features,
          paymentLink: validatedData.paymentLink
        }
      })
      
      // 📝 Audit trail
      await logAdminAction(
        user.id,
        user.email,
        'CREATE_SERVICE',
        'Service',
        created.id,
        { title: validatedData.title, category: validatedData.category }
      )
    }
    
    revalidatePath('/admin')
    revalidatePath('/') // Update public site too
    return { success: true }
  } catch (error) {
    console.error("Failed to upsert service:", error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Failed to save service' }
  }
}

export async function deleteService(id: string) {
  try {
    const user = await requireAdmin()
    
    await prisma.service.delete({
      where: { id }
    })
    
    // 📝 Audit trail
    await logAdminAction(
      user.id,
      user.email,
      'DELETE_SERVICE',
      'Service',
      id,
      { deletedAt: new Date().toISOString() }
    )
    
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Failed to delete service:", error)
    return { success: false, error: 'Failed to delete service' }
  }
}


export async function reorderServices(orderedIds: string[]) {
  try {
    const user = await requireAdmin()
    
    // Mettre à jour l'ordre de chaque service
    const updates = orderedIds.map((id, index) => 
      prisma.service.update({
        where: { id },
        data: { order: index }
      })
    )
    await Promise.all(updates)
    
    // 📝 Audit trail
    await logAdminAction(
      user.id,
      user.email,
      'REORDER_SERVICES',
      'Service',
      undefined,
      { count: orderedIds.length }
    )
    
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Failed to reorder services:", error)
    return { success: false, error: 'Failed to reorder services' }
  }
}

// ============================================
// BOOKING — GESTION DES CRÉNEAUX & RÉSERVATIONS
// ============================================

export async function getBookingData() {
  await requireAdmin()

  const now = new Date()
  const horizon = new Date(now.getTime() + 30 * 24 * 3600 * 1000)

  const [reservations, unavailabilities, rules] = await Promise.all([
    prisma.reservation.findMany({
      where: {
        AND: [
          { startAt: { not: null } },
          { startAt: { gte: now } },
          { startAt: { lte: horizon } },
          { status: { not: 'annule' } },
        ],
      },
      orderBy: { startAt: 'asc' },
    }),
    prisma.unavailability.findMany({
      where: { endAt: { gte: now } },
      orderBy: { startAt: 'asc' },
    }),
    prisma.availabilityRule.findMany({
      orderBy: { dayOfWeek: 'asc' },
    }),
  ])

  return {
    reservations: reservations.map((r) => ({
      id: r.id,
      status: r.status,
      customerName: r.customerName,
      customerEmail: r.customerEmail,
      customerPhone: r.customerPhone,
      message: r.message,
      serviceTitle: r.serviceTitle,
      totalAmount: r.totalAmount,
      paymentMethod: r.paymentMethod,
      startAt: r.startAt ? r.startAt.toISOString() : null,
      endAt: r.endAt ? r.endAt.toISOString() : null,
    })),
    unavailabilities: unavailabilities.map((u) => ({
      id: u.id,
      startAt: u.startAt.toISOString(),
      endAt: u.endAt.toISOString(),
      reason: u.reason,
    })),
    rules: rules.map((r) => ({
      id: r.id,
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime,
      endTime: r.endTime,
      bufferMinutes: r.bufferMinutes,
      isActive: r.isActive,
    })),
  }
}

export async function addUnavailability(input: {
  start: string
  end: string
  reason?: string | null
}) {
  const user = await requireAdmin()

  const start = new Date(input.start)
  const end = new Date(input.end)
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end.getTime() <= start.getTime()) {
    return { success: false, error: 'Plage invalide' }
  }

  await prisma.unavailability.create({
    data: {
      startAt: start,
      endAt: end,
      reason: input.reason?.trim() || null,
    },
  })

  await logAdminAction(user.id, user.email, 'CLEANUP_DATA', 'Unavailability', undefined, {
    booking: 'block',
    start: input.start,
    end: input.end,
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function removeUnavailability(id: string) {
  const user = await requireAdmin()

  await prisma.unavailability.deleteMany({ where: { id } })

  await logAdminAction(user.id, user.email, 'CLEANUP_DATA', 'Unavailability', id, {
    booking: 'unblock',
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function saveAvailabilityRule(input: {
  dayOfWeek: number
  startTime: string
  endTime: string
  bufferMinutes?: number
}) {
  const user = await requireAdmin()

  const dayOfWeek = Number(input.dayOfWeek)
  if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
    return { success: false, error: 'Jour invalide' }
  }
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.startTime) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.endTime)) {
    return { success: false, error: 'Heure invalide (format HH:MM)' }
  }
  if (input.endTime <= input.startTime) {
    return { success: false, error: 'L\'heure de fin doit être après l\'heure de début' }
  }

  const bufferMinutes = Math.max(0, Math.min(120, Number(input.bufferMinutes) || 0))

  await prisma.availabilityRule.upsert({
    where: { id: 'rule-' + dayOfWeek },
    update: {
      startTime: input.startTime,
      endTime: input.endTime,
      bufferMinutes,
      isActive: true,
    },
    create: {
      id: 'rule-' + dayOfWeek,
      dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      bufferMinutes,
      isActive: true,
    },
  })

  await logAdminAction(user.id, user.email, 'CLEANUP_DATA', 'AvailabilityRule', `rule-${dayOfWeek}`, {
    booking: 'update-hours',
    startTime: input.startTime,
    endTime: input.endTime,
    bufferMinutes,
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function cancelReservation(id: string) {
  const user = await requireAdmin()

  const updated = await prisma.reservation.updateMany({
    where: { id, status: { not: 'annule' } },
    data: { status: 'annule' },
  })

  if (updated.count === 0) {
    return { success: false, error: 'Réservation déjà annulée ou introuvable' }
  }

  await logAdminAction(user.id, user.email, 'CLEANUP_DATA', 'Reservation', id, {
    booking: 'cancel',
  })

  revalidatePath('/admin')
  return { success: true }
}
