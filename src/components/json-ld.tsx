import { CONTACT_INFO } from '@/data/content';
import { getAllServices } from '@/lib/db-services';
import { parsePriceToNumber } from '@/lib/pricing';

const SITE_URL = 'https://sab-fit.com';

// FAQ alignée sur la FAQ visible de la page (faq-visual.tsx) — exigence Google & cohérence IA
const FAQ_ITEMS = [
  {
    q: 'Je débute complètement, est-ce que c\'est pour moi ?',
    a: 'Absolument ! Chaque programme est 100% adapté à votre niveau. Que vous soyez débutant ou sportif confirmé, Sabrina ajuste l\'intensité et les exercices pour vous faire progresser en toute sécurité.'
  },
  {
    q: 'Où se passent les séances ?',
    a: 'À votre domicile dans tout le Var (83) ou en cabinet selon vos préférences et la prestation choisie. Le coaching à domicile inclut tout le matériel nécessaire.'
  },
  {
    q: 'Quels sont les moyens de paiement ?',
    a: 'Carte bancaire en ligne (via Stripe), paiement en 3x sans frais avec Klarna, ou espèces/CB sur place le jour de la séance.'
  },
  {
    q: 'Puis-je offrir une séance en cadeau ?',
    a: 'Oui ! Contactez-nous via le formulaire pour un bon cadeau personnalisé. Une belle idée pour faire découvrir le coaching ou le massage à vos proches.'
  },
  {
    q: 'Quelle tenue pour une séance de coaching ?',
    a: 'Une tenue de sport confortable et des baskets. Sabrina apporte tout le matériel nécessaire (haltères, élastiques, tapis, etc.).'
  },
  {
    q: 'Le massage est-il remboursé ?',
    a: 'Les massages bien-être ne sont pas remboursés par la Sécurité Sociale, mais certaines mutuelles prennent en charge les séances de kiné. Renseignez-vous auprès de la vôtre.'
  },
  {
    q: 'Combien de temps avant de voir des résultats ?',
    a: 'Dès les premières semaines avec un suivi régulier. La plupart des clients ressentent une différence dès la 3ème séance et des résultats visibles après 1 mois.'
  },
  {
    q: 'Comment annuler ou déplacer un rendez-vous ?',
    a: 'Contactez Sabrina par téléphone ou email au moins 24h à l\'avance. L\'annulation tardive peut entraîner des frais selon les conditions de la prestation.'
  },
];

export async function StructuredData() {
  // Catalogue généré depuis la base de données (prix toujours synchronisés avec le site)
  let offerCatalog: Record<string, unknown>[] = [];
  try {
    const services = await getAllServices();
    offerCatalog = services.map((service) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: service.title,
        description: service.description,
        provider: {
          '@type': 'ProfessionalService',
          name: 'Sab-Fit'
        },
        areaServed: 'Var (83)'
      },
      price: parsePriceToNumber(service.price).toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/#${service.category === 'Coaching' ? 'coaching' : 'massage'}`
    }));
  } catch (error) {
    console.error('StructuredData: impossible de charger les services', error);
  }

  // 0. Person - Sabrina Compan (Propriétaire/Founder)
  const personOwner = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#sabrina-compan`,
    name: 'Sabrina Compan',
    givenName: 'Sabrina',
    familyName: 'Compan',
    jobTitle: 'Coach Sportif & Masseuse Professionnelle',
    description: 'Fondatrice de Sab-Fit, coach sportif certifiée et praticienne en massages bien-être avec 15 ans d\'expérience dans le Var (83).',
    url: SITE_URL,
    image: `${SITE_URL}/img/sabrina/sab.webp`,
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    sameAs: [
      'https://www.instagram.com/sab.fit_coaching83'
    ],
    worksFor: {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#business`
    },
    alumniOf: [
      {
        '@type': 'EducationalOrganization',
        name: 'BP JEPS AGFF (Activités Gymniques de la Forme et de Force)'
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Préparation physique - Diplôme fédéral'
      }
    ],
    knowsAbout: [
      'Coaching sportif personnalisé',
      'Perte de poids et remodelage corporel',
      'Préparation physique',
      'Rééducation post-natale',
      'Madérothérapie',
      'Massage sportif',
      'Massage californien',
      'Drainage lymphatique'
    ]
  };

  // 1. ProfessionalService - Sabrina comme professionnelle
  const professionalService: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: 'Sab-Fit Coaching & Massage',
    alternateName: 'Sabrina Coaching Sportif',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    image: [
      `${SITE_URL}/img/sabrina/sab.webp`,
      `${SITE_URL}/img/sabrina/sabrina-1.webp`
    ],
    telephone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    founder: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#sabrina-compan`
    },
    owner: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#sabrina-compan`
    },
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: ['Cash', 'Credit Card', 'PayPal', 'Stripe', 'Klarna'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '20:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '18:00'
      }
    ],
    areaServed: [
      {
        '@type': 'City',
        name: 'Toulon',
        '@id': 'https://www.wikidata.org/wiki/Q44189'
      },
      {
        '@type': 'City',
        name: 'Hyères',
        '@id': 'https://www.wikidata.org/wiki/Q203253'
      },
      {
        '@type': 'City',
        name: 'La Seyne-sur-Mer',
        '@id': 'https://www.wikidata.org/wiki/Q234743'
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Var',
        '@id': 'https://www.wikidata.org/wiki/Q12789'
      }
    ],
    description: 'Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83). Programmes fitness sur mesure, perte de poids, récupération sportive, madérothérapie.',
    sameAs: [
      'https://www.instagram.com/sab.fit_coaching83'
    ]
  };

  if (offerCatalog.length > 0) {
    professionalService.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Services de Coaching et Massage',
      itemListElement: offerCatalog
    };
  }

  // 2. FAQPage - alignée sur la FAQ visible de la page
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/#faq`,
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a
      }
    }))
  };

  // 3. WebSite - Pour la recherche de site
  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Sab-Fit Coaching & Massage',
    alternateName: 'Sabrina Coaching Sportif Var',
    description: 'Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83)',
    publisher: {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#business`
    },
    potentialAction: [
      {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/#contact`,
          actionPlatform: [
            'http://schema.org/DesktopWebPlatform',
            'http://schema.org/MobileWebPlatform'
          ]
        },
        result: {
          '@type': 'Reservation',
          name: 'Réserver une séance'
        }
      }
    ]
  };

  // 4. WebPage - Pour la page spécifique
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: 'Sab-Fit | Coaching Fitness & Massage Var (83) - Domicile',
    description: 'Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83). Programmes fitness sur mesure, madérothérapie, récupération sportive.',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`
    },
    about: {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#business`
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/img/sabrina/sab.webp`
    }
  };

  // 5. BreadcrumbList - Pour la navigation
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: SITE_URL
      }
    ]
  };

  // Combiner tous les schémas
  const structuredData = [
    personOwner,
    professionalService,
    webSite,
    webPage,
    faqPage,
    breadcrumbList
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
