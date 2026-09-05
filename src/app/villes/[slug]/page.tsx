import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ChevronRight, MapPin } from 'lucide-react';
import { getCityBySlug } from '@/data/cities';
import { getAllServices, getServiceSlug } from '@/lib/db-services';
import { parsePriceToNumber } from '@/lib/pricing';
import { CONTACT_INFO } from '@/data/content';

const SITE_URL = 'https://sab-fit.com';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    return { title: 'Ville introuvable | Sab-Fit' };
  }

  return {
    title: city.title,
    description: city.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/villes/${city.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: `${SITE_URL}/villes/${city.slug}`,
      title: city.title,
      description: city.metaDescription,
      siteName: 'Sab-Fit Coaching & Massage',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const services = await getAllServices();
  const coachingServices = services.filter((s) => s.category === 'Coaching').slice(0, 4);
  const massageServices = services.filter((s) => s.category !== 'Coaching').slice(0, 4);

  const cityJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/villes/${city.slug}#service`,
        name: `Coaching sportif et massage à ${city.name}`,
        serviceType: 'Coaching Sportif & Massage Bien-être',
        description: city.metaDescription,
        provider: {
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/#business`,
          name: 'Sab-Fit Coaching & Massage',
        },
        areaServed: {
          '@type': 'City',
          name: city.name,
        },
        url: `${SITE_URL}/villes/${city.slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Zones d\'intervention', item: `${SITE_URL}/#contact` },
          { '@type': 'ListItem', position: 3, name: city.name, item: `${SITE_URL}/villes/${city.slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Le coaching à domicile couvre-t-il tout ${city.name} ?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Oui, Sab-Fit intervient à domicile dans tout ${city.name} et ses environs, avec le matériel nécessaire fourni par le coach.`,
            },
          },
          {
            '@type': 'Question',
            name: `Comment réserver une séance à ${city.name} ?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Réservez directement en ligne sur sab-fit.com avec paiement sécurisé (CB, PayPal, Klarna 3x sans frais) ou choisissez "Réserver uniquement" pour payer sur place. Sabrina vous recontacte sous 24h.',
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen paper-texture bg-[#FFFBF5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'ariane" className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">{city.name}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
            <MapPin className="w-4 h-4" />
            Zone d&apos;intervention
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mt-4 leading-[1.05]">
            {city.h1}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300">
              à domicile
            </span>
          </h1>
          <p className="text-slate-600 text-lg font-medium mt-4 leading-relaxed">{city.intro}</p>
        </header>

        {/* Paragraphe local */}
        <section className="bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-[3px_4px_0px_0px_rgba(45,42,38,0.12)] mb-10">
          <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
            Votre coach à {city.name}, chez vous
          </h2>
          <p className="text-slate-600 leading-relaxed font-medium">{city.localParagraph}</p>
          <div className="flex flex-wrap gap-2 mt-5">
            {city.neighborhoods.map((n) => (
              <span key={n} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-full">
                {n}
              </span>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Coaching sportif à {city.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {coachingServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${getServiceSlug(service)}`}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <h3 className="font-black text-slate-900 mb-1">{service.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-2">{service.description}</p>
                <span className="font-black text-slate-900">{parsePriceToNumber(service.price)} €</span>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Massages bien-être à {city.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {massageServices.map((service) => (
              <Link
                key={service.id}
                href={`/services/${getServiceSlug(service)}`}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-lg transition-all"
              >
                <h3 className="font-black text-slate-900 mb-1">{service.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-2">{service.description}</p>
                <span className="font-black text-slate-900">{parsePriceToNumber(service.price)} €</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Pourquoi Sab-Fit */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Pourquoi choisir Sab-Fit à {city.name} ?
          </h2>
          <ul className="space-y-3">
            {[
              'Coach diplômée d\'État avec plus de 15 ans d\'expérience',
              'Séances 100 % personnalisées selon votre niveau et vos objectifs',
              'Tout le matériel fourni : haltères, élastiques, tapis',
              'Créneaux flexibles du lundi au samedi',
              'Paiement en ligne sécurisé ou sur place, en main propre',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                <div className="p-1 rounded-full bg-training-light shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-training" />
                </div>
                <span className="text-slate-700 font-semibold">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center bg-slate-900 text-white rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">
            Réservez votre séance à {city.name}
          </h2>
          <p className="text-slate-300 mb-6 font-medium">
            Paiement en ligne ou sur place — réponse sous 24h au {CONTACT_INFO.phone}.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-black transition-all hover:-translate-y-1 shadow-xl"
          >
            Réserver maintenant
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
