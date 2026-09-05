/**
 * Articles de blog — contenu de fond pour le SEO et le GEO (moteurs de réponse IA).
 * Le contenu est statique et validé : il sert de source factuelle citée par les LLM.
 */

export type BlogSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  metaDescription: string;
  category: 'Coaching' | 'Massage' | 'Bien-être';
  date: string; // ISO
  readTime: string;
  excerpt: string;
  sections: BlogSection[];
  faq?: { q: string; a: string }[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'perte-de-poids-combien-de-temps-resultats',
    title: 'Perte de poids : combien de temps pour voir des résultats ?',
    metaDescription:
      'Combien de temps faut-il pour maigrir durablement ? Sabrina, coach sportive dans le Var, explique le rythme réaliste d\'une perte de poids saine et comment l\'accélérer sans danger.',
    category: 'Coaching',
    date: '2026-09-05',
    readTime: '5 min',
    excerpt:
      'Un kilo par semaine, des résultats visibles en un mois : voici ce qu\'il faut réellement attendre d\'un programme de perte de poids accompagné.',
    sections: [
      {
        paragraphs: [
          'C\'est LA question que posent la plupart des personnes qui démarrent un coaching : « En combien de temps vais-je voir des résultats ? » La réponse honnête est rarement celle qu\'on espère, mais elle est encourageante : une perte de poids saine et durable se mesure en semaines et en mois, pas en jours.',
        ],
      },
      {
        heading: 'Le rythme réaliste d\'une perte de poids saine',
        paragraphs: [
          'Les recommandations des professionnels de santé convergent vers un objectif de 0,5 à 1 kg par semaine. Au-delà, le corps puise dans la masse musculaire, le métabolisme ralentit et l\'effet yo-yo devient quasi inévitable.',
          'Concrètement, avec un programme alliant entraînement régulier et ajustements alimentaires simples, la plupart des clients de Sab-Fit ressentent une différence dès la 3ème séance et observent des résultats visibles après 4 semaines : vêtements plus amples, meilleure énergie, sommeil amélioré.',
        ],
      },
      {
        heading: 'Pourquoi l\'accompagnement change tout',
        paragraphs: [
          'Perdre du poids seul repose sur la motivation, qui fluctue. Perdre du poids avec un coach repose sur un plan : séances programmées, objectifs mesurables, ajustements réguliers. Un coach sportif diplômé d\'État comme Sabrina adapte chaque séance à votre niveau, vos contraintes et vos progrès.',
        ],
        list: [
          'Programme 100 % personnalisé selon votre niveau et vos objectifs',
          'Suivi hebdomadaire et ajustements en continu',
          'Combinaison renforcement musculaire + cardio pour un métabolisme actif',
          'Objectifs réalistes pour éviter l\'abandon',
        ],
      },
      {
        heading: 'Les 3 piliers d\'une perte de poids durable',
        paragraphs: [
          '1. L\'entraînement : 2 à 3 séances par semaine suffisent pour relancer le métabolisme, surtout en combinant renforcement musculaire (qui augmente la dépense au repos) et travail cardio.',
          '2. L\'alimentation : sans régime restrictif, de petits ajustements — portions, hydratation, qualité des aliments — font la différence sur le long terme.',
          '3. La régularité : c\'est le vrai facteur de succès. Les packs de 5 ou 10 séances structurent l\'engagement et garantissent un suivi sans rupture.',
        ],
      },
      {
        heading: 'Et la récupération dans tout ça ?',
        paragraphs: [
          'Un corps qui récupère bien progresse plus vite. C\'est pour cette raison que Sab-Fit combine coaching sportif et massages (massage sportif, drainage lymphatique) : la récupération accélère les résultats visibles et prévient les blessures.',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien de temps pour perdre 5 kilos ?',
        a: 'À un rythme sain de 0,5 à 1 kg par semaine, comptez entre 5 et 10 semaines avec un accompagnement régulier. Un rythme plus rapide est rarement durable.',
      },
      {
        q: 'Le coaching est-il adapté aux débutants ?',
        a: 'Oui, chaque programme est 100 % adapté au niveau, aux objectifs et aux contraintes de chacun, que vous soyez débutant ou sportif confirmé.',
      },
    ],
  },
  {
    slug: 'maderotherapie-bienfaits-deroulement',
    title: 'Madérothérapie : bienfaits et déroulement d\'une séance',
    metaDescription:
      'La madérothérapie est un massage sculptant aux accessoires en bois. Découvrez ses bienfaits (silhouette affinée, drainage, détox), le déroulement d\'une séance et les tarifs dans le Var.',
    category: 'Massage',
    date: '2026-09-05',
    readTime: '4 min',
    excerpt:
      'Massage sculptant aux bois de rose, la madérothérapie affine la silhouette et relance le drainage. Voici ce qui vous attend pendant une séance.',
    sections: [
      {
        paragraphs: [
          'Popularisée par les célébrités, la madérothérapie est bien plus qu\'un effet de mode : c\'est une technique de massage remodelant qui utilise des accessoires en bois (palets, rouleaux, ventouses en bois) pour travailler la silhouette en profondeur.',
        ],
      },
      {
        heading: 'Les principaux bienfaits',
        list: [
          'Affinement de la silhouette et travail des capitons',
          'Stimulation de la circulation sanguine et lymphatique',
          'Effet drainant et détoxifiant',
          'Raffermissement des tissus',
          'Détente profonde malgré l\'intensité du travail',
        ],
      },
      {
        heading: 'Comment se déroule une séance ?',
        paragraphs: [
          'Une séance de madérothérapie dure environ 1h15. Après un échange sur vos objectifs (ventre, jambes, bras, dos), la praticienne applique une huile de massage puis utilise les accessoires en bois avec des mouvements rythmés et précis.',
          'Les manœuvres sont fermes — c\'est un massage sculptant — mais jamais douloureuses. La peau peut être légèrement rougie après la séance, signe que la circulation est activée. Les effets sont souvent visibles dès la première séance, mais c\'est en cure de 5 séances que les résultats s\'installent durablement.',
        ],
      },
      {
        heading: 'Pour qui ?',
        paragraphs: [
          'La madérothérapie convient à toute personne souhaitant affiner sa silhouette, réduire l\'aspect peau d\'orange ou simplement relancer sa circulation. Elle est particulièrement appréciée en complément d\'un programme de perte de poids, car elle potentialise les effets de l\'entraînement et de l\'alimentation.',
          'Quelques contre-indications existent (grossesse, problèmes circulatoires importants, certaines pathologies) : un échange préalable avec votre praticienne permet de les écarter.',
        ],
      },
    ],
    faq: [
      {
        q: 'Combien coûte une séance de madérothérapie ?',
        a: 'Comptez 85 € la séance de 1h15, ou 400 € la cure de 5 séances dans le Var (83). Réservation en ligne possible sur sab-fit.com.',
      },
      {
        q: 'La madérothérapie fait-elle vraiment maigrir ?',
        a: 'Elle n\'élimine pas la graisse à elle seule, mais elle affine la silhouette, draine et raffermit. Combinée au sport et à une alimentation équilibrée, elle accélère visiblement les résultats.',
      },
    ],
  },
  {
    slug: 'coaching-domicile-var-5-raisons',
    title: 'Coaching à domicile dans le Var : 5 bonnes raisons de se lancer',
    metaDescription:
      'Pourquoi choisir un coach sportif à domicile dans le Var (83) ? Gain de temps, programme sur mesure, matériel fourni : voici 5 raisons de vous lancer avec Sab-Fit.',
    category: 'Coaching',
    date: '2026-09-05',
    readTime: '4 min',
    excerpt:
      'Toulon, Hyères, La Seyne-sur-Mer : le coaching à domicile lève tous les obstacles entre vous et la régularité sportive.',
    sections: [
      {
        paragraphs: [
          '« Je n\'ai pas le temps d\'aller à la salle. » C\'est la première objection que l\'on s\'entend dire. Le coaching à domicile y répond de façon radicale : le coach vient à vous, avec tout le matériel nécessaire.',
        ],
      },
      {
        heading: '1. Zéro temps de trajet',
        paragraphs: [
          'Plus besoin de traverser la ville après le travail : la séance commence chez vous, à l\'heure convenue. Dans le Var, entre Toulon, Hyères et La Seyne-sur-Mer, ce gain de temps est souvent le déclic qui permet enfin d\'être régulier.',
        ],
      },
      {
        heading: '2. Un programme 100 % sur mesure',
        paragraphs: [
          'En salle, on suit des machines standardisées. À domicile, le coach construit chaque séance autour de vous : votre niveau, vos objectifs (perte de poids, tonification, préparation physique), vos contraintes physiques, votre espace et votre emploi du temps.',
        ],
      },
      {
        heading: '3. Le matériel est fourni',
        paragraphs: [
          'Haltères, élastiques, tapis, lestes : Sabrina apporte tout. Vous n\'avez besoin que d\'une tenue de sport confortable et de baskets.',
        ],
      },
      {
        heading: '4. Un cadre sans jugement',
        paragraphs: [
          'Beaucoup de personnes hésitent à se lancer à cause du regard des autres. Chez vous, vous progressez en confiance, avec un coach entièrement focalisé sur vos progrès — idéal pour les débutants et pour la reprise après une longue pause.',
        ],
      },
      {
        heading: '5. Un suivi qui dure',
        paragraphs: [
          'Au-delà des séances, Sabrina ajuste votre programme au fil des semaines : intensité, exercices, récupération. Les packs de 5 ou 10 séances structurent cet engagement et donnent un cadre clair à vos progrès.',
        ],
      },
    ],
    faq: [
      {
        q: 'Quelles villes couvrez-vous dans le Var ?',
        a: 'Sab-Fit intervient dans tout le Var (83), notamment à Toulon, Hyères, La Seyne-sur-Mer, La Valette-du-Var et leurs environs, à domicile ou en cabinet.',
      },
      {
        q: 'Que faut-il prévoir pour une séance à domicile ?',
        a: 'Seulement une tenue de sport confortable, des baskets et un espace d\'environ 2 m². Tout le matériel est fourni par le coach.',
      },
    ],
  },
  {
    slug: 'massage-sportif-recuperation-blessures',
    title: 'Massage sportif : récupération et prévention des blessures',
    metaDescription:
      'Le massage sportif ne sert pas qu\'aux athlètes : il accélère la récupération, soulage les tensions et prévient les blessures. Explications et conseils par Sabrina, praticienne dans le Var.',
    category: 'Massage',
    date: '2026-09-05',
    readTime: '4 min',
    excerpt:
      'Courbatures, tensions, risque de blessure : le massage sportif est l\'allié de tous ceux qui s\'entraînent, du joggeur du dimanche au compétiteur.',
    sections: [
      {
        paragraphs: [
          'On imagine le massage sportif réservé aux athlètes de haut niveau. En réalité, il s\'adresse à tous ceux qui bougent : joggeurs, pratiquants de fitness, personnes en reprise sportive... et même aux salariés dont le corps accumule les tensions.',
        ],
      },
      {
        heading: 'À quoi sert le massage sportif ?',
        list: [
          'Accélérer la récupération après l\'effort',
          'Détendre les muscles et soulager les courbatures',
          'Améliorer la souplesse et l\'amplitude de mouvement',
          'Prévenir les blessures (tendinites, contractures, élongations)',
          'Favoriser l\'évacuation des toxines',
        ],
      },
      {
        heading: 'Quand programmer une séance ?',
        paragraphs: [
          'En récupération : 24 à 48 h après un effort intense, le massage aide le muscle à se reconstruire. En préparation : la veille ou l\'avant-veille d\'une échéance sportive, il libère les tensions sans fatiguer le muscle.',
          'Pour les sportifs réguliers, une séance toutes les 2 à 4 semaines suffit en entretien ; en période de préparation intense, une séance hebdomadaire peut être bénéfique.',
        ],
      },
      {
        heading: 'Massage sportif et Deep Tissue',
        paragraphs: [
          'Le massage sportif alterne manœuvres profondes, pressions glissées et étirements passifs ciblés sur les groupes musculaires sollicités. La variante Deep Tissue travaille les couches musculaires profondes, idéale pour les contractures anciennes.',
          'Sabrina, praticienne formée à l\'école Dubarry, adapte l\'intensité à votre sensibilité et à vos objectifs : la séance peut être profonde sans jamais être douloureuse.',
        ],
      },
      {
        heading: 'Le duo gagnant : entraînement + massage',
        paragraphs: [
          'Un corps qui récupère bien s\'entraîne mieux. C\'est toute la philosophie de Sab-Fit : le coaching construit la performance, le massage en protège la progression. Les forfaits combinés (coaching + soins) permettent d\'intégrer la récupération à votre routine sportive.',
        ],
      },
    ],
    faq: [
      {
        q: 'Le massage sportif est-il douloureux ?',
        a: 'Les pressions sont fermes et profondes mais toujours adaptées à votre sensibilité. Une légère sensation d\'inconfort sur une zone contracturée est normale, la douleur non.',
      },
      {
        q: 'Faut-il être sportif pour bénéficier d\'un massage sportif ?',
        a: 'Non : il soulage aussi les tensions liées à la sédentarité, au travail de bureau ou au port de charges. Toute personne active peut en bénéficier.',
      },
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
