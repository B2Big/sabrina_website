import { PrismaClient } from '@prisma/client'
import { SERVICES } from '../src/data/content'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')
  
  // Clear existing services to avoid duplicates if running multiple times (optional, but safer for dev)
  // await prisma.service.deleteMany() 

  for (const service of SERVICES) {
    const existing = await prisma.service.findUnique({
      where: { id: service.id }
    })

    if (!existing) {
      await prisma.service.create({
        data: {
            id: service.id, // Keep the same IDs
            title: service.title,
            category: service.category,
            price: service.price,
            originalPrice: service.originalPrice,
            description: service.description,
            duration: service.duration,
            objective: service.objective,
            popular: service.popular || false,
            bestValue: service.bestValue || false,
            note: service.note,
            features: service.features || [],
            paymentLink: service.paymentLink
        }
      })
      console.log(`Created service: ${service.title}`)
    } else {
        console.log(`Service already exists: ${service.title}`)
    }
  }
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
