
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
  popular?: boolean;
  bestValue?: boolean;
};

export const SERVICES: Service[] = [
  // MASSAGES & SOINS
  {
    id: "madero",
    category: "Massages",
    title: "Madérothérapie",
    duration: "1h",
    price: "À partir de 70 €",
    description: "Le secret pour lisser la peau et casser la cellulite. Résultats visibles et silhouette sculptée dès la première séance.",
    objective: "Sculpter, Drainer, Lisser.",
    popular: true
  },
  {
    id: "jambes-legeres",
    category: "Massages",
    title: "Jambes légères",
    duration: "45 min",
    price: "45 €",
    description: "Adieu la rétention d'eau. Un drainage express pour retrouver des jambes fines, légères et dégonflées instantanément.",
    objective: "Drainage express, Soulagement immédiat."
  },
  {
    id: "californien-balinais-1h",
    category: "Massages",
    title: "Californien / Balinais",
    duration: "1h",
    price: "70 €",
    description: "Débranchez le cerveau. Un cocon de douceur absolue pour évacuer tout le stress accumulé et mieux dormir.",
    objective: "Lâcher-prise total, Anti-stress."
  },
  {
    id: "sportif-1h",
    category: "Massages",
    title: "Massage Sportif",
    duration: "1h",
    price: "70 €",
    description: "Réparez la machine. Élimine les toxines, dénoue les tensions profondes et prépare votre corps au prochain effort.",
    objective: "Récupération, Performance, Souplesse.",
    popular: true
  },

  // COACHING
  {
    id: "one-to-one",
    category: "Coaching",
    title: "Coaching Premium 1-to-1",
    duration: "1h",
    price: "50 €",
    description: "L'accélérateur de résultats. Un plan d'attaque sur-mesure et une motivation constante pour dépasser vos objectifs.",
    objective: "Sur-mesure, Motivation, Résultats rapides.",
    popular: true
  },
  {
    id: "coaching-boxe",
    category: "Coaching",
    title: "Cardio Boxe",
    duration: "1h",
    price: "50 €",
    description: "L'anti-stress ultime. Videz-vous la tête et brûlez un max de calories dans une séance explosive et ludique.",
    objective: "Cardio, Mental d'acier, Défouloir."
  },
  {
    id: "small-group",
    category: "Coaching",
    title: "Small Group",
    duration: "1h",
    price: "10 € / pers.",
    description: "Seul on va vite, ensemble on va loin. Challengez-vous en équipe dans une ambiance fun et motivante (min. 5 pers).",
    objective: "Esprit d'équipe, Fun, Accessible."
  },
  {
    id: "forfait-10",
    category: "Coaching",
    title: "Pack Transformation",
    duration: "10 Séances",
    price: "400 €",
    description: "3 mois pour tout changer. Un engagement envers vous-même pour une métamorphose physique et mentale durable.",
    objective: "Transformation, Suivi long terme.",
    bestValue: true
  }
];
