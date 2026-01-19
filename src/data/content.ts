
export const CONTACT_INFO = {
  phone: "06 66 26 24 29",
  email: "sabcompan8306@gmail.com",
  instagram: "https://www.instagram.com/sab.fit_coaching83",
  location: "Var (83) - À domicile ou en cabinet"
};

export const CATEGORIES = ["Massages", "Coaching", "Cures"] as const;

export type Service = {
  id: string;
  category: typeof CATEGORIES[number];
  title: string;
  duration?: string;
  price: string;
  description: string;
  objective?: string;
};

export const SERVICES: Service[] = [
  // MASSAGES
  {
    id: "madero",
    category: "Massages",
    title: "Madérothérapie",
    duration: "1h",
    price: "À partir de 70 €",
    description: "Remodelage silhouette, réduction cellulite, tonification.",
    objective: "Stimuler la circulation, lisser la peau, déstocker localement."
  },
  {
    id: "jambes-legeres",
    category: "Massages",
    title: "Jambes légères",
    duration: "45 min",
    price: "45 €",
    description: "Sensation de lourdeur, station debout/assise prolongée.",
    objective: "Activer la circulation veineuse/lymphatique, soulager rapidement."
  },
  {
    id: "californien-balinais-1h",
    category: "Massages",
    title: "Californien / Balinais (1h)",
    duration: "1h",
    price: "70 €",
    description: "Détente globale, lâcher-prise, apaisement nerveux.",
    objective: "Relaxation profonde, harmonisation du corps."
  },
  {
    id: "californien-balinais-1h30",
    category: "Massages",
    title: "Californien / Balinais (1h30)",
    duration: "1h30",
    price: "80 €",
    description: "Détente longue, relâchement complet.",
    objective: "Séance enveloppante et rythmée pour une relaxation maximale."
  },
  {
    id: "sportif-1h",
    category: "Massages",
    title: "Massage Sportif (1h)",
    duration: "1h",
    price: "70 €",
    description: "Avant/après l’effort, sportifs réguliers ou ponctuels.",
    objective: "Récupération, relâchement musculaire, prévention des blessures."
  },
  {
    id: "sportif-1h30",
    category: "Massages",
    title: "Massage Sportif (1h30)",
    duration: "1h30",
    price: "80 €",
    description: "Besoin de travail plus profond ou zones multiples.",
    objective: "Récupération approfondie et préparation à la performance."
  },

  // COACHING
  {
    id: "coaching-boxe",
    category: "Coaching",
    title: "Coaching Boxe",
    duration: "1h",
    price: "50 €",
    description: "Remise en forme, cardio, anti-stress.",
    objective: "Endurance, coordination, explosivité, confiance."
  },
  {
    id: "one-to-one",
    category: "Coaching",
    title: "Coaching 1-to-1",
    duration: "1h",
    price: "50 €",
    description: "Objectifs spécifiques (perte de poids, tonus, posture).",
    objective: "Programme sur-mesure, suivi personnalisé."
  },
  {
    id: "small-group",
    category: "Coaching",
    title: "Small Group",
    duration: "1h",
    price: "10 € / pers. (min. 5)",
    description: "Amis / équipe motivée.",
    objective: "Motivation collective, coût accessible."
  },
  {
    id: "forfait-5",
    category: "Coaching",
    title: "Forfait 5 séances",
    duration: "Pack",
    price: "225 €",
    description: "Engagement court terme.",
    objective: "Suivi continu, économie."
  },
  {
    id: "forfait-10",
    category: "Coaching",
    title: "Forfait 10 séances",
    duration: "Pack",
    price: "400 €",
    description: "Transformation sur 2–3 mois.",
    objective: "Suivi long terme, économie."
  },

  // CURES
  {
    id: "cure-lymphatique",
    category: "Cures",
    title: "Cure Lymphatique",
    duration: "5 ou 10 séances",
    price: "Sur devis",
    description: "Rétention d’eau chronique, jambes lourdes.",
    objective: "Drainage régulier, légèreté durable."
  },
  {
    id: "cure-madero",
    category: "Cures",
    title: "Cure Madérothérapie",
    duration: "5 ou 10 séances",
    price: "Sur devis",
    description: "Programme minceur / remodelage.",
    objective: "Tonification, peau lissée."
  }
];
