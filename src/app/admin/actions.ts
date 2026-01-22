'use server'

import { prisma, getAllServices } from '@/lib/db-services'
import { revalidatePath } from 'next/cache'

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
    const formattedData = {
      text: data.text,
      link: data.link,
      isActive: data.isActive,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      discountPercent: data.discountPercent || null,
      services: {
        set: [], // Clear previous connections
        connect: data.serviceIds?.map(id => ({ id })) || [] // Connect new ones
      }
    }

    if (data.id) {
      await prisma.promotion.update({
        where: { id: data.id },
        data: formattedData
      })
    } else {
      await prisma.promotion.create({
        data: formattedData
      })
    }
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Failed to upsert promotion:", error)
    return { success: false, error: 'Failed to save promotion' }
  }
}

export async function deletePromotion(id: string) {
  try {
    await prisma.promotion.delete({ where: { id } })
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete promotion' }
  }
}

export async function togglePromotion(id: string, isActive: boolean) {
  try {
    await prisma.promotion.update({
      where: { id },
      data: { isActive }
    })
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to toggle promotion' }
  }
}

export async function upsertService(data: ServiceFormData) {
  try {
    if (data.id) {
      await prisma.service.update({
        where: { id: data.id },
        data: {
          title: data.title,
          category: data.category,
          price: data.price,
          originalPrice: data.originalPrice,
          description: data.description,
          duration: data.duration,
          objective: data.objective,
          popular: data.popular,
          bestValue: data.bestValue,
          note: data.note,
          features: data.features,
          paymentLink: data.paymentLink
        }
      })
    } else {
      await prisma.service.create({
        data: {
          title: data.title,
          category: data.category,
          price: data.price,
          originalPrice: data.originalPrice,
          description: data.description,
          duration: data.duration,
          objective: data.objective,
          popular: data.popular,
          bestValue: data.bestValue,
          note: data.note,
          features: data.features,
          paymentLink: data.paymentLink
        }
      })
    }
    revalidatePath('/admin')
    revalidatePath('/') // Update public site too
    return { success: true }
  } catch (error) {
    console.error("Failed to upsert service:", error)
    return { success: false, error: 'Failed to save service' }
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({
      where: { id }
    })
    revalidatePath('/admin')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error("Failed to delete service:", error)
    return { success: false, error: 'Failed to delete service' }
  }
}
