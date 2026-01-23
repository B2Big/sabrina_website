import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SERVICES = [
  // --- COACHING (Bleu) ---

  // MIX RUNNING & RENFO (149€)
  {
    id: "mix-running-renfo",
    category: "Coaching",
    title: "Mix Running & Renfo",
    price: "149 €",
    duration: "Suivi mensuel",
    description: "L'alliance parfaite pour progresser. Un programme complet combinant course à pied et renforcement musculaire.",
    objective: "Performance globale, Prévention blessures.",
    bestValue: true,
    paymentLink: "https://buy.stripe.com/test_mix_149",
    features: [
      "Suivi hebdomadaire inclus",
      "Planification Running personnalisée",
      "Séances de Renfo adaptées",
      "Ajustements illimités"
    ]
  },

  // COACHING 1-TO-1 (50€ / 225€ / 400€)
  {
    id: "one-to-one-unit",
    category: "Coaching",
    title: "Coaching 1-to-1",
    duration: "1h",
    price: "50 €",
    description: "Séance individuelle sur-mesure. Technique, motivation et dépassement de soi avec votre coach dédiée.",
    objective: "Progression rapide, Technique.",
    paymentLink: "https://buy.stripe.com/test_coaching_50"
  },
  {
    id: "one-to-one-5",
    category: "Coaching",
    title: "Pack 5 Séances",
    duration: "5 x 1h",
    price: "225 €",
    originalPrice: "250 €",
    description: "Un premier cap à passer. Idéal pour ancrer de nouvelles habitudes et voir les premiers résultats.",
    objective: "Engagement court terme.",
    paymentLink: "https://buy.stripe.com/test_coaching_225"
  },
  {
    id: "one-to-one-10",
    category: "Coaching",
    title: "Pack 10 Séances",
    duration: "10 x 1h",
    price: "400 €",
    originalPrice: "500 €",
    description: "La transformation durable. Un accompagnement complet pour atteindre vos objectifs les plus ambitieux.",
    objective: "Transformation physique & mentale.",
    popular: true,
    paymentLink: "https://buy.stripe.com/test_coaching_400"
  },

  // SMALL GROUP (15€)
  {
    id: "small-group",
    category: "Coaching",
    title: "Small Group",
    duration: "1h",
    price: "15 € / pers.",
    description: "L'énergie du collectif. Entraînez-vous entre amis ou collègues dans une ambiance motivante.",
    objective: "Fun, Cohésion, Challenge.",
    note: "⚠️ Min. 5 participants",
    paymentLink: "https://buy.stripe.com/test_group_15"
  },


  // --- MASSAGES & SOINS (Rose/Corail) ---

  // MASSAGES (70€ / 95€)
  {
    id: "massage-1h",
    category: "Massages",
    title: "Massage Signature",
    duration: "1h",
    price: "70 €",
    description: "Une heure de détente absolue ou de récupération sportive, adaptée à vos besoins du moment.",
    objective: "Détente, Récupération.",
    paymentLink: "https://buy.stripe.com/test_massage_70"
  },
  {
    id: "massage-1h30",
    category: "Massages",
    title: "Grand Soin",
    duration: "1h30",
    price: "95 €",
    description: "L'expérience bien-être prolongée. Prenez le temps de lâcher prise totalement.",
    objective: "Lâcher-prise profond.",
    paymentLink: "https://buy.stripe.com/test_massage_95"
  },

  // CURES (320€ / 450€)
  {
    id: "cure-5-1h",
    category: "Cures",
    title: "Cure Essentielle",
    duration: "5 x 1h",
    price: "320 €",
    originalPrice: "350 €",
    description: "Un rituel bien-être régulier pour maintenir votre équilibre physique et mental.",
    objective: "Entretien, Régularité.",
    paymentLink: "https://buy.stripe.com/test_cure_320"
  },
  {
    id: "cure-5-1h30",
    category: "Cures",
    title: "Cure Profonde",
    duration: "5 x 1h30",
    price: "450 €",
    originalPrice: "475 €",
    description: "L'immersion totale. 5 séances longues pour un travail en profondeur sur le corps et l'esprit.",
    objective: "Bien-être intense.",
    paymentLink: "https://buy.stripe.com/test_cure_450"
  },

  // FORFAITS COMBINÉS (185€ / 330€ / 650€)
  {
    id: "combo-essentiel",
    category: "Coaching",
    title: "Pack Essentiel",
    price: "185 €",
    description: "L'équilibre. Combinez sport et récupération pour une approche santé globale.",
    objective: "Découverte Mixte.",
    features: ["Training & Soin", "Approche holistique"],
    paymentLink: "https://buy.stripe.com/test_combo_185"
  },
  {
    id: "combo-perf",
    category: "Coaching",
    title: "Pack Performance",
    price: "330 €",
    description: "Passez au niveau supérieur avec un suivi plus poussé et une récupération optimisée.",
    objective: "Performance & Soin.",
    popular: true,
    paymentLink: "https://buy.stripe.com/test_combo_330"
  },
  {
    id: "combo-premium",
    category: "Coaching",
    title: "Pack Premium",
    price: "650 €",
    description: "L'expérience ultime. Un accompagnement VIP sur tous les plans pour des résultats exceptionnels.",
    objective: "Excellence.",
    bestValue: true,
    paymentLink: "https://buy.stripe.com/test_combo_650"
  }
]

async function main() {
  console.log('🌱 Start seeding...')
  
  for (const service of SERVICES) {
    const result = await prisma.service.upsert({
      where: { id: service.id },
      update: {
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
      },
      create: {
        id: service.id,
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
    console.log(`Created service with id: ${result.id}`)
  }
  
  console.log('✅ Seeding finished.')
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