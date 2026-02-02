'use server'

import { prisma, getAllServices } from '@/lib/db-services'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { hasAdminAccess, getUserRole } from '@/lib/auth/roles'
import { serviceSchema, promotionSchema } from '@/lib/validations/schemas'
import { rateLimit, RateLimitConfigs } from '@/lib/rate-limit'
import { z } from 'zod'

/**
 * Vérifie l'authentification, les permissions admin et le rate limiting
 * Lève une erreur si l'utilisateur n'est pas connecté ou n'a pas de rôle admin
 */
async function checkAuth() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Vérifier que l'utilisateur est connecté
  if (!user) {
    throw new Error('Non authentifié - Connexion requise')
  }

  // Vérifier que l'utilisateur a un rôle admin (ADMIN ou DEVELOPER)
  if (!hasAdminAccess(user)) {
    const role = getUserRole(user)
    console.warn(`Tentative d'action admin non autorisée par ${user.email} (rôle: ${role})`)
    throw new Error('Non autorisé - Rôle admin requis')
  }

  // Rate limiting par utilisateur (email)
  const rateLimitKey = `admin-action:${user.email}`
  const rateLimitResult = rateLimit(rateLimitKey, RateLimitConfigs.ADMIN_ACTIONS)

  if (!rateLimitResult.success) {
    console.warn(`🚫 Rate limit dépassé pour actions admin par ${user.email}`)
    throw new Error('Trop de modifications rapides. Veuillez patienter quelques instants.')
  }

  return user
}

export async function signOut() {
  console.log('Server Action: signOut called');
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
          }
        },
      },
    }
  )
  const { error } = await supabase.auth.signOut()
  if (error) console.error('SignOut Error:', error)
  else console.log('SignOut Success')
  
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
    await checkAuth() // Security Check

    // 🔒 Validation Zod
    const validatedData = promotionSchema.parse(data)

    if (validatedData.id) {
      await prisma.promotion.update({
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
    } else {
      await prisma.promotion.create({
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
    await checkAuth()
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
    await checkAuth()
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
    await checkAuth()

    // 🔒 Validation Zod
    const validatedData = serviceSchema.parse(data)

    if (validatedData.id) {
      await prisma.service.update({
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
    } else {
      await prisma.service.create({
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
    await checkAuth()
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
