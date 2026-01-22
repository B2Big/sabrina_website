import { PrismaClient } from '@prisma/client'

// Use a global variable to prevent multiple instances in dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function getAllServices() {
  try {
    return await prisma.service.findMany({
      orderBy: { createdAt: 'asc' } // Keep original order if possible, or use a specific order field
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
