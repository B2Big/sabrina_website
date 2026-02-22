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
  return await getAllServices()
}

export async function getPromotions() {
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
