import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SERVICES = [
  // ╔══════════════════════════════════════════════════════════════╗
  // ║                    COACHING INDIVIDUEL                       ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "seance-individuelle",
    category: "Coaching",
    title: "Séance Individuelle",
    duration: "1h",
    price: "50 €",
    description: "Un coaching 100% sur-mesure axé sur la technique, la motivation et le dépassement de soi. Chaque séance est unique et adaptée à vos objectifs du moment.",
    objective: "Progression rapide & technique personnalisée.",
    popular: false,
    bestValue: false,
    note: "🔥 Prix Discovery : 35€ la 1ère séance (économie de 30%)",
    features: [
      "Coaching personnalisé (1h)",
      "Technique & motivation",
      "Prix Discovery 1ère séance : 35€"
    ]
  },

  {
    id: "pack-initial",
    category: "Coaching",
    title: "Pack Initial",
    duration: "5 x 1h",
    price: "225 €",
    originalPrice: "250 €",
    description: "Pour ancrer de nouvelles habitudes et voir les premiers résultats. 5 séances structurées pour poser les bases solides de votre transformation.",
    objective: "Ancrage des habitudes & premiers résultats visibles.",
    popular: false,
    bestValue: false,
    note: "💰 45€ / séance au lieu de 50€",
    features: [
      "Économie immédiate : 25€",
      "5 séances structurées",
      "Planification personnalisée",
      "Suivi de progression inclus"
    ]
  },

  {
    id: "pack-transformation",
    category: "Coaching",
    title: "Pack Transformation",
    duration: "10 x 1h",
    price: "400 €",
    originalPrice: "500 €",
    description: "Accompagnement complet pour atteindre vos objectifs les plus ambitieux. 10 séances pour transformer votre corps et votre mental en profondeur.",
    objective: "Transformation physique & mentale complète.",
    popular: true,
    bestValue: false,
    note: "💰 40€ / séance au lieu de 50€ — le meilleur rapport résultats/prix",
    features: [
      "Économie record : 100€",
      "10 séances pour une transformation complète",
      "Suivi et ajustements continus",
      "Plan d'entraînement évolutif",
      "Le pack le plus demandé 🔥"
    ]
  },

  {
    id: "pack-ultime",
    category: "Coaching",
    title: "Pack Ultime",
    duration: "20 x 1h",
    price: "700 €",
    originalPrice: "1 000 €",
    description: "L'ancrage durable : le corps s'adapte, les habitudes sont installées. 20 séances pour graver votre nouvelle routine dans le marbre et atteindre l'excellence.",
    objective: "Ancrage durable & excellence sportive.",
    popular: false,
    bestValue: true,
    note: "💰 35€ / séance au lieu de 50€ — l'offre la plus rentable",
    features: [
      "Économie massive : 300€",
      "20 séances pour un ancrage durable",
      "L'habitude devient naturelle",
      "Accompagnement VIP complet",
      "Valeur sûre pour les objectifs ambitieux",
      "⭐ Top Choix"
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║                    COACHING COLLECTIF                        ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "coaching-duo",
    category: "Coaching",
    title: "Coaching Duo",
    duration: "1h",
    price: "50 €",
    description: "Motivation, dépassement de soi et bonne humeur garantis à deux. Entraînez-vous avec votre partenaire, votre ami ou votre collègue et partagez la progression.",
    objective: "Fun, cohésion & challenge à deux.",
    popular: false,
    bestValue: false,
    note: "25€ / personne — Économie : 50€ vs 2 séances solo",
    features: [
      "Économie : 50€ vs 2 séances solo",
      "Motivation à deux = résultats doublés",
      "Partagez l'effort, partagez la réussite",
      "Ambiance fun et stimulante"
    ]
  },

  {
    id: "coaching-trio",
    category: "Coaching",
    title: "Coaching Trio",
    duration: "1h",
    price: "60 €",
    description: "L'énergie du groupe booste encore plus la séance ! À trois, la dynamique est encore plus puissante et la motivation contagieuse.",
    objective: "Énergie de groupe & challenge renforcé.",
    popular: false,
    bestValue: false,
    note: "20€ / personne — Économie : 90€ vs 3 séances solo",
    features: [
      "Économie : 90€ vs 3 séances solo",
      "L'énergie du groupe booste les performances",
      "L'ambiance = le carburant de la motivation",
      "Parfait pour les groupes d'amis"
    ]
  },

  {
    id: "small-group-bootcamp",
    category: "Coaching",
    title: "Small Group Bootcamp",
    duration: "1h",
    price: "15 € / pers.",
    description: "L'énergie du collectif. Entraînez-vous entre amis ou collègues dans une ambiance motivante et dépasser vos limites ensemble.",
    objective: "Fun, cohésion, challenge collectif.",
    popular: false,
    bestValue: false,
    note: "⚠️ Minimum 5 participants",
    features: [
      "Le prix le plus accessible",
      "Énergie collective garantie",
      "Parfait pour les team buildings",
      "Entre amis ou collègues"
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║                    PROGRAMMES SPÉCIALISÉS                    ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "mix-running-renfo",
    category: "Coaching",
    title: "Mix Running & Renfo",
    duration: "1 mois",
    price: "149 €",
    description: "L'alliance parfaite pour progresser. Un programme mensuel complet combinant course à pied et renforcement musculaire avec un suivi hebdomadaire personnalisé.",
    objective: "Performance globale & prévention des blessures.",
    popular: false,
    bestValue: false,
    features: [
      "Suivi hebdomadaire inclus",
      "4 Planifications Running personnalisées",
      "4 Séances de Renfo adaptées",
      "Ajustements illimités selon votre ressenti",
      "Accompagnement complet sur 1 mois"
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║                    PACKS COMPLETS                            ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "pack-essentiel",
    category: "Coaching",
    title: "Pack Essentiel",
    duration: "1 mois",
    price: "185 €",
    description: "L'équilibre parfait entre effort et récupération. Combinez sport et bien-être pour une approche santé globale qui respecte votre corps.",
    objective: "Découverte mixte : sport + soin.",
    popular: false,
    bestValue: false,
    note: "46€ / séance (soin inclus)",
    features: [
      "3 Coachings Individuels (1h)",
      "1 Massage Signature (1h)",
      "Sport + Récupération = Équilibre parfait",
      "Découverte de l'approche holistique"
    ]
  },

  {
    id: "pack-performance",
    category: "Coaching",
    title: "Pack Performance",
    duration: "1 mois",
    price: "330 €",
    originalPrice: "380 €",
    description: "Passez au niveau supérieur avec un suivi plus poussé et une récupération optimisée. Le pack complet pour les sportifs qui veulent performer.",
    objective: "Performance & soin optimisé.",
    popular: false,
    bestValue: false,
    note: "66€ / séance (avec services additionnels)",
    features: [
      "Économie : 50€",
      "5 Coachings Individuels (1h)",
      "1 Bilan Bio-mécanique complet",
      "Plan de nutrition personnalisé",
      "Pack complet pour performer"
    ]
  },

  {
    id: "pack-premium",
    category: "Coaching",
    title: "Pack Premium",
    duration: "2 mois",
    price: "650 €",
    originalPrice: "780 €",
    description: "L'expérience ultime Sab-Fit. Un accompagnement VIP sur tous les plans pour des résultats exceptionnels et une transformation durable.",
    objective: "Excellence & expérience VIP.",
    popular: false,
    bestValue: false,
    note: "65€ / séance (avec services additionnels)",
    features: [
      "Économie : 130€",
      "10 Coachings Individuels (1h)",
      "Suivi nutritionnel hebdomadaire",
      "Accès à l'application VIP Sab-Fit",
      "1 Massage Signature (1h) offert",
      "L'expérience ultime Sab-Fit 💎"
    ]
  },

  // ╔══════════════════════════════════════════════════════════════╗
  // ║                    MASSAGES & SOINS                          ║
  // ╚══════════════════════════════════════════════════════════════╝

  {
    id: "massage-signature",
    category: "Massages",
    title: "Massage Signature",
    duration: "1h",
    price: "70 €",
    description: "Une heure de détente absolue ou de récupération sportive, adaptée à vos besoins du moment. Techniques personnalisées selon votre corps et vos tensions.",
    objective: "Détente, Récupération & lâcher-prise.",
    features: [
      "Techniques adaptées à vos besoins",
      "Récupération sportive ou détente",
      "Ambiance relaxante garantie"
    ]
  },

  {
    id: "grand-soin",
    category: "Massages",
    title: "Grand Soin",
    duration: "1h30",
    price: "95 €",
    description: "L'expérience bien-être prolongée. Prenez le temps de lâcher prise totalement avec un soin complet de 90 minutes pour un relâchement en profondeur.",
    objective: "Lâcher-prise profond & régénération.",
    features: [
      "1h30 de pure détente",
      "Travail en profondeur des tensions",
      "Régénération complète corps & esprit"
    ]
  },

  {
    id: "cure-essentielle",
    category: "Cures",
    title: "Cure Essentielle",
    duration: "5 x 1h",
    price: "320 €",
    originalPrice: "350 €",
    description: "Un rituel bien-être régulier pour maintenir votre équilibre physique et mental. 5 séances d'1h pour prendre soin de vous durablement.",
    objective: "Entretien & régularité du bien-être.",
    note: "64€ / séance au lieu de 70€",
    features: [
      "Économie : 30€",
      "5 Massages Signature (1h)",
      "Suivi de votre évolution",
      "Prise de rendez-vous prioritaire"
    ]
  },

  {
    id: "cure-profonde",
    category: "Cures",
    title: "Cure Profonde",
    duration: "5 x 1h30",
    price: "450 €",
    originalPrice: "475 €",
    description: "L'immersion totale. 5 séances longues pour un travail en profondeur sur le corps et l'esprit. Le soin le plus complet pour une transformation intérieure.",
    objective: "Bien-être intense & transformation.",
    note: "90€ / séance au lieu de 95€",
    features: [
      "Économie : 25€",
      "5 Grands Soins (1h30)",
      "Travail en profondeur complet",
      "Transformation corps & esprit"
    ]
  },

  {
    id: "maderotherapie-1h",
    category: "Massages",
    title: "Madérothérapie",
    duration: "1h",
    price: "70 €",
    description: "Soin remodelant et drainant réalisé à l'aide d'outils en bois spécialement conçus pour stimuler la circulation, lisser la peau et relancer le système lymphatique. Cette séance permet de cibler les zones de rétention d'eau, les tensions musculaires et l'aspect cellulite tout en offrant un vrai moment de récupération et de bien-être.",
    objective: "Silhouette, drainage & récupération.",
    features: [
      "Active la circulation sanguine et lymphatique",
      "Réduit la sensation de jambes lourdes",
      "Favorise le déstockage des tensions et toxines",
      "Améliore l'aspect de la peau et la tonicité",
      "Idéal en complément d'une routine sportive"
    ]
  },

  {
    id: "maderotherapie-1h30",
    category: "Massages",
    title: "Madérothérapie Intense",
    duration: "1h30",
    price: "90 €",
    description: "Soin remodelant et drainant réalisé à l'aide d'outils en bois spécialement conçus pour stimuler la circulation, lisser la peau et relancer le système lymphatique. En 1h30, profitez d'une séance complète pour cibler en profondeur les zones de rétention d'eau, les tensions musculaires et l'aspect cellulite.",
    objective: "Silhouette, drainage & récupération intense.",
    popular: false,
    bestValue: false,
    features: [
      "Séance longue pour un travail en profondeur",
      "Active la circulation sanguine et lymphatique",
      "Réduit la sensation de jambes lourdes",
      "Améliore l'aspect de la peau et la tonicité",
      "Idéal en complément d'une routine sportive"
    ]
  },

  {
    id: "massage-lymphatique",
    category: "Massages",
    title: "Massage lymphatique",
    duration: "1h",
    price: "70 €",
    description: "Massage doux et drainant visant à stimuler la circulation lymphatique et aider le corps à éliminer les toxines naturellement. Ce soin apporte une profonde sensation de légèreté tout en favorisant la récupération et le bien-être général.",
    objective: "Légèreté, drainage & élimination des toxines.",
    features: [
      "Réduit la sensation de jambes lourdes",
      "Aide à diminuer la rétention d'eau",
      "Favorise l'élimination des toxines",
      "Apaise les tensions et la fatigue",
      "Améliore la récupération sportive"
    ]
  },

  {
    id: "glow-recovery",
    category: "Massages",
    title: "Glow Recovery",
    duration: "1h",
    price: "60 €",
    description: "Soin Signature Visage & Relaxation. Une véritable parenthèse de détente et de lâcher-prise. À travers des gestes doux et enveloppants, ce soin associe relaxation profonde, massage visage et relâchement des tensions au niveau de la nuque et des trapèzes.",
    objective: "Détente, éclat du visage & lâcher-prise.",
    note: "🔥 Offre découverte jusqu'à fin mai",
    popular: true,
    features: [
      "Démaquillage, nettoyage & exfoliation",
      "Masque hydratant + massage mains/pieds",
      "Massage relaxant du visage",
      "Travail de la nuque et des trapèzes",
      "Sérum & crème hydratante glow"
    ]
  },

  {
    id: "massage-cible",
    category: "Massages",
    title: "Massage ciblé",
    duration: "30 min",
    price: "45 €",
    description: "Massage ciblé sur une zone spécifique : dos ou jambes, selon vos besoins du moment. Cette séance courte mais efficace permet de soulager les tensions musculaires, favoriser la récupération et apporter une sensation immédiate de détente et de légèreté.",
    objective: "Soulagement rapide & récupération ciblée.",
    features: [
      "Dos : relâche les tensions, le stress et les douleurs musculaires",
      "Jambes : parfait après le sport ou en cas de jambes lourdes",
      "Détend les muscles en profondeur",
      "Favorise la récupération sportive",
      "Améliore la circulation",
      "Pause récupération idéale au quotidien"
    ]
  }
]

async function main() {
  console.log('🌱 Mise à jour des offres (mode sécurisé — upsert, pas de suppression)...')

  for (const service of SERVICES as any[]) {
    const result = await prisma.service.upsert({
      where: { id: service.id },
      update: {
        title: service.title,
        category: service.category,
        price: service.price,
        originalPrice: service.originalPrice || null,
        description: service.description,
        duration: service.duration || null,
        objective: service.objective || null,
        popular: service.popular || false,
        bestValue: service.bestValue || false,
        note: service.note || null,
        features: service.features || [],
        paymentLink: service.paymentLink || null
      },
      create: {
        id: service.id,
        title: service.title,
        category: service.category,
        price: service.price,
        originalPrice: service.originalPrice || null,
        description: service.description,
        duration: service.duration || null,
        objective: service.objective || null,
        popular: service.popular || false,
        bestValue: service.bestValue || false,
        note: service.note || null,
        features: service.features || [],
        paymentLink: service.paymentLink || null
      }
    })
    console.log(`✅ ${result.title} — ${result.price}`)
  }

  console.log('\n🎉 Mise à jour terminée !')
  console.log(`📊 ${SERVICES.length} offres synchronisées avec succès`)
  console.log('⚠️  Les services ajoutés via le dashboard ne sont PAS supprimés.')
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
