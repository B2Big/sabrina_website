'use client';

import { CONTACT_INFO } from '@/data/content';

export function StructuredData() {
  // 1. ProfessionalService - Sabrina comme professionnelle
  const professionalService = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': 'https://sab-fit.com/#business',
    name: 'Sab-Fit Coaching & Massage',
    alternateName: 'Sabrina Coaching Sportif',
    url: 'https://sab-fit.com',
    logo: 'https://sab-fit.com/logo.svg',
    image: [
      'https://sab-fit.com/img/sabrina/sab.webp',
      'https://sab-fit.com/img/sabrina/sabrina-1.jpg'
    ],
    telephone: CONTACT_INFO.phone,
    email: 'contact@sab-fit.com',
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: ['Cash', 'Credit Card', 'PayPal', 'Stripe'],
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
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Domicile ou Cabinet - Déplacements sur tout le Var',
      addressLocality: 'Toulon',
      addressRegion: 'Provence-Alpes-Côte d\'Azur',
      postalCode: '83000',
      addressCountry: 'FR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 43.1242,
      longitude: 5.9280
    },
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
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Services de Coaching et Massage',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Coaching Sportif Personnalisé',
            description: 'Programmes sur mesure pour perte de poids, prise de masse ou récupération post-natale',
            provider: {
              '@type': 'ProfessionalService',
              name: 'Sab-Fit'
            },
            areaServed: 'Var (83)'
          },
          price: '50.00',
          priceCurrency: 'EUR',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: 'https://sab-fit.com/#coaching'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Pack 10 Séances Coaching',
            description: '10 séances de coaching sportif personnalisé - Engagement optimal',
            provider: {
              '@type': 'ProfessionalService',
              name: 'Sab-Fit'
            }
          },
          price: '450.00',
          priceCurrency: 'EUR',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: 'https://sab-fit.com/#coaching'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Massage Madérothérapie',
            description: 'Massage sculptant aux bois de rose pour affiner la silhouette et drainer',
            provider: {
              '@type': 'ProfessionalService',
              name: 'Sab-Fit'
            }
          },
          price: '85.00',
          priceCurrency: 'EUR',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: 'https://sab-fit.com/#massage'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Massage Sportif',
            description: 'Relâchement musculaire profond pour sportifs et récupération',
            provider: {
              '@type': 'ProfessionalService',
              name: 'Sab-Fit'
            }
          },
          price: '70.00',
          priceCurrency: 'EUR',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: 'https://sab-fit.com/#massage'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Massage Californien',
            description: 'Détente profonde et lâcher-prise pour évacuer le stress',
            provider: {
              '@type': 'ProfessionalService',
              name: 'Sab-Fit'
            }
          },
          price: '70.00',
          priceCurrency: 'EUR',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: 'https://sab-fit.com/#massage'
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cure Profonde - 5 Massages',
            description: 'Cure complète de 5 massages pour transformation profonde',
            provider: {
              '@type': 'ProfessionalService',
              name: 'Sab-Fit'
            }
          },
          price: '400.00',
          priceCurrency: 'EUR',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          url: 'https://sab-fit.com/#massage'
        }
      ]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5',
      worstRating: '1'
    }
  };

  // 2. FAQPage - Pour les extraits enrichis
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': 'https://sab-fit.com/#faq',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Quels sont les tarifs du coaching sportif avec Sab-Fit ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Les tarifs du coaching sportif à domicile dans le Var sont : Séance découverte à 50€, Pack 5 séances à 250€, Pack 10 séances à 450€ (meilleure valeur), et Pack 20 séances à 800€. Paiement possible en espèces, carte bancaire ou en ligne via Stripe.'
        }
      },
      {
        '@type': 'Question',
        name: 'Où se déroulent les séances de coaching et massage ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Les séances se déroulent à domicile sur tout le Var (83), principalement autour de Toulon, Hyères et La Seyne-sur-Mer. Je me déplace avec mon matériel professionnel. Possibilité également en cabinet sur rendez-vous.'
        }
      },
      {
        '@type': 'Question',
        name: 'Qu\'est-ce que la madérothérapie et combien ça coûte ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'La madérothérapie est un massage sculptant aux bois de rose qui affine la silhouette, draine et détoxifie. Tarif : 85€ la séance de 1h15. Cure de 5 séances à 400€. Réservation en ligne possible avec paiement sécurisé Stripe.'
        }
      },
      {
        '@type': 'Question',
        name: 'Comment réserver un créneau avec Sabrina ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Vous pouvez réserver directement en ligne sur sab-fit.com avec paiement sécurisé Stripe, ou choisir "Réserver uniquement" pour payer sur place (espèces ou CB). Je vous recontacte sous 24h pour fixer les rendez-vous selon vos disponibilités.'
        }
      },
      {
        '@type': 'Question',
        name: 'Quels types de massage proposez-vous ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Je propose plusieurs types de massages bien-être à domicile : Madérothérapie (sculptant aux bois de rose), Massage Sportif (récupération musculaire), Massage Californien (détente profonde), et Drainage Lymphatique. Tarifs de 70€ à 85€ la séance.'
        }
      },
      {
        '@type': 'Question',
        name: 'Le coaching est-il adapté aux débutants ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolument ! Les programmes sont 100% personnalisés selon votre niveau, vos objectifs (perte de poids, tonification, récupération post-natale) et vos contraintes. Que vous soyez débutant ou sportif confirmé, chaque séance est adaptée à vos capacités.'
        }
      }
    ]
  };

  // 3. WebSite - Pour la recherche de site
  const webSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://sab-fit.com/#website',
    url: 'https://sab-fit.com',
    name: 'Sab-Fit Coaching & Massage',
    alternateName: 'Sabrina Coaching Sportif Var',
    description: 'Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83)',
    publisher: {
      '@type': 'ProfessionalService',
      '@id': 'https://sab-fit.com/#business'
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://sab-fit.com/?search={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      },
      {
        '@type': 'ReserveAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://sab-fit.com/#contact',
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
    '@id': 'https://sab-fit.com/#webpage',
    url: 'https://sab-fit.com',
    name: 'Sab-Fit | Coaching Fitness & Massage Var (83) - Domicile',
    description: 'Coaching sportif personnalisé et massages bien-être à domicile dans le Var (83). Programmes fitness sur mesure, madérothérapie, récupération sportive.',
    isPartOf: {
      '@type': 'WebSite',
      '@id': 'https://sab-fit.com/#website'
    },
    about: {
      '@type': 'ProfessionalService',
      '@id': 'https://sab-fit.com/#business'
    },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: 'https://sab-fit.com/img/sabrina/sab.webp'
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          item: {
            '@type': 'Thing',
            '@id': 'https://sab-fit.com',
            name: 'Accueil'
          }
        }
      ]
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
        item: 'https://sab-fit.com'
      }
    ]
  };

  // Combiner tous les schémas
  const structuredData = [
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
