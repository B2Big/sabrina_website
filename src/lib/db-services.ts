import { PrismaClient } from '@prisma/client'
import { slugify } from '@/lib/slug'

// Use a global variable to prevent multiple instances in dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getAllServices() {
  try {
    return await prisma.service.findMany({
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error("Failed to fetch services from DB", error)
    return []
  }
}

export async function getServiceById(id: string) {
  return await prisma.service.findUnique({ where: { id } })
}

export async function getActivePromotions() {
  try {
    const now = new Date()
    return await prisma.promotion.findMany({
      where: { 
        isActive: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: { services: true }
    })
  } catch (error) {
    console.error("Failed to fetch active promotions:", error)
    return []
  }
}

/**
 * Slug SEO d'un service (basé sur le titre, accents normalisés).
 * Utilisé pour les pages dédiées /services/[slug] et le sitemap.
 */
export function getServiceSlug(service: { title: string }): string {
  return slugify(service.title)
}

/**
 * Récupère un service par son slug (avec résolution des collisions éventuelles).
 */
export async function getServiceBySlug(slug: string) {
  const services = await getAllServices()

  // Résolution de collision : le premier service garde le slug de base,
  // les suivants reçoivent un suffixe -2, -3...
  const counts = new Map<string, number>()
  const slugs = new Map<string, string>()

  for (const service of services) {
    const base = getServiceSlug(service)
    const count = counts.get(base) ?? 0
    counts.set(base, count + 1)
    slugs.set(service.id, count === 0 ? base : `${base}-${count + 1}`)
  }

  const found = services.find((service) => slugs.get(service.id) === slug)
  return found ?? null
}
