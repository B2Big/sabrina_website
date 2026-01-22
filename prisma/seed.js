process.env.DATABASE_URL = "file:./dev.db";
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const SERVICES = [
  // COPIE DES DONNÉES DE content.ts
  {
    category: "Coaching",
    title: "Mix Running & Renfo",
    price: "149 €",
    duration: "Suivi mensuel",
    description: "L'alliance parfaite pour progresser. Un programme complet combinant course à pied et renforcement musculaire.",
    objective: "Performance globale, Prévention blessures.",
    bestValue: true,
    features: JSON.stringify([
      "Suivi hebdomadaire inclus",
      "Planification Running personnalisée",
      "Séances de Renfo adaptées",
      "Ajustements illimités"
    ])
  },
  {
    category: "Coaching",
    title: "Coaching 1-to-1",
    duration: "1h",
    price: "50 €",
    description: "Séance individuelle sur-mesure. Technique, motivation et dépassement de soi avec votre coach dédiée.",
    objective: "Progression rapide, Technique.",
    popular: true
  },
  {
    category: "Coaching",
    title: "Pack 5 Séances",
    duration: "5 x 1h",
    price: "225 €",
    originalPrice: "250 €",
    description: "Un premier cap à passer. Idéal pour ancrer de nouvelles habitudes et voir les premiers résultats.",
    objective: "Engagement court terme."
  },
  {
    category: "Coaching",
    title: "Pack 10 Séances",
    duration: "10 x 1h",
    price: "400 €",
    originalPrice: "500 €",
    description: "La transformation durable. Un accompagnement complet pour atteindre vos objectifs les plus ambitieux.",
    objective: "Transformation physique & mentale.",
    popular: true
  },
  {
    category: "Coaching",
    title: "Small Group",
    duration: "1h",
    price: "15 € / pers.",
    description: "L'énergie du collectif. Entraînez-vous entre amis ou collègues dans une ambiance motivante.",
    objective: "Fun, Cohésion, Challenge.",
    note: "⚠️ Min. 5 participants"
  },
  {
    category: "Massages",
    title: "Massage Signature",
    duration: "1h",
    price: "70 €",
    description: "Une heure de détente absolue ou de récupération sportive, adaptée à vos besoins du moment.",
    objective: "Détente, Récupération."
  },
  {
    category: "Massages",
    title: "Grand Soin",
    duration: "1h30",
    price: "95 €",
    description: "L'expérience bien-être prolongée. Prenez le temps de lâcher prise totalement.",
    objective: "Lâcher-prise profond."
  },
  {
    category: "Cures",
    title: "Cure Essentielle",
    duration: "5 x 1h",
    price: "320 €",
    originalPrice: "350 €",
    description: "Un rituel bien-être régulier pour maintenir votre équilibre physique et mental.",
    objective: "Entretien, Régularité."
  },
  {
    category: "Cures",
    title: "Cure Profonde",
    duration: "5 x 1h30",
    price: "450 €",
    originalPrice: "475 €",
    description: "L'immersion totale. 5 séances longues pour un travail en profondeur sur le corps et l'esprit.",
    objective: "Bien-être intense."
  },
  {
    category: "Coaching",
    title: "Pack Essentiel",
    price: "185 €",
    description: "L'équilibre. Combinez sport et récupération pour une approche santé globale.",
    objective: "Découverte Mixte.",
    features: JSON.stringify(["Training & Soin", "Approche holistique"])
  },
  {
    category: "Coaching",
    title: "Pack Performance",
    price: "330 €",
    description: "Passez au niveau supérieur avec un suivi plus poussé et une récupération optimisée.",
    objective: "Performance & Soin.",
    popular: true
  },
  {
    category: "Coaching",
    title: "Pack Premium",
    price: "650 €",
    description: "L'expérience ultime. Un accompagnement VIP sur tous les plans pour des résultats exceptionnels.",
    objective: "Excellence.",
    bestValue: true
  }
];

async function main() {
  console.log('Start seeding...');
  
  // Clean existing
  await prisma.service.deleteMany();

  for (const service of SERVICES) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
