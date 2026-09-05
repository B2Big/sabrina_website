import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, Clock, ChevronRight, MapPin, Phone, Mail, Instagram, Dumbbell, Sparkles } from 'lucide-react';
import { getServiceBySlug, getAllServices, getActivePromotions, getServiceSlug } from '@/lib/db-services';
import { parsePriceToNumber, applyPromotionDiscount } from '@/lib/pricing';
import { ServiceCTA } from '@/components/service-cta';
import { CONTACT_INFO } from '@/data/content';
import { type Service } from '@/data/content';

export const dynamic = 'force-dynamic';

const SITE_URL = 'https://sab-fit.com';

function mapToService(s: {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string | null;
  duration: string | null;
  objective: string | null;
  popular: boolean;
  bestValue: boolean;
  note: string | null;
  features: string[];
  paymentLink: string | null;
}): Service {
  return {
    id: s.id,
    category: s.category as Service['category'],
    title: s.title,
    description: s.description,
    price: s.price,
    originalPrice: s.originalPrice ?? undefined,
    duration: s.duration ?? undefined,
    objective: s.objective ?? undefined,
    popular: s.popular,
    bestValue: s.bestValue,
    note: s.note ?? undefined,
    features: s.features ?? [],
    paymentLink: s.paymentLink ?? undefined,
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: 'Service introuvable | Sab-Fit' };
  }

  const label = service.category === 'Coaching' ? 'Coaching sportif' : 'Massage bien-être';

  return {
    title: `${service.title} | Sab-Fit — ${label} dans le Var (83)`,
    description: service.description,
    alternates: {
      canonical: `${SITE_URL}/services/${slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: `${SITE_URL}/services/${slug}`,
      title: `${service.title} | Sab-Fit — ${label} dans le Var (83)`,
      description: service.description,
      siteName: 'Sab-Fit Coaching & Massage',
      images: [
        {
          url: '/img/sabrina/sab.webp',
          width: 1200,
          height: 1500,
          alt: `Sab-Fit — ${service.title}`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, allServices, promotions] = await Promise.all([
    getServiceBySlug(slug),
    getAllServices(),
    getActivePromotions(),
  ]);

  if (!service) {
    notFound();
  }

  const typedService = mapToService(service);
  const isCoaching = service.category === 'Coaching';

  // Prix effectif avec promo (même logique que l'accueil et le checkout)
  const basePrice = parsePriceToNumber(service.price);
  const effectivePrice = applyPromotionDiscount(basePrice, promotions, service.id);
  const hasDiscount = effectivePrice < basePrice;

  // Autres services de la même catégorie (liens internes pour le crawl)
  const relatedServices = allServices
    .filter((s) => s.id !== service.id && s.category === service.category)
    .slice(0, 3);

  const accentGradient = isCoaching
    ? 'from-indigo-300 via-cyan-300 to-mint-300'
    : 'from-fuchsia-300 via-rose-300 to-amber-200';

  // JSON-LD dédié à cette page service
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${SITE_URL}/services/${slug}#service`,
        name: service.title,
        description: service.description,
        serviceType: isCoaching ? 'Coaching Sportif' : 'Massage Bien-être',
        provider: {
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/#business`,
          name: 'Sab-Fit Coaching & Massage',
          telephone: CONTACT_INFO.phone,
          email: CONTACT_INFO.email,
        },
        areaServed: 'Var (83)',
        url: `${SITE_URL}/services/${slug}`,
        ...(service.duration ? { estimatedDuration: service.duration } : {}),
        offers: {
          '@type': 'Offer',
          price: effectivePrice.toFixed(2),
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/services/${slug}`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${SITE_URL}/#coaching` },
          { '@type': 'ListItem', position: 3, name: service.title, item: `${SITE_URL}/services/${slug}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `Comment réserver : ${service.title} ?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Réservez directement en ligne sur sab-fit.com avec paiement sécurisé (CB, PayPal ou Klarna 3x sans frais), ou choisissez "Réserver uniquement" pour payer sur place en espèces ou CB. Sabrina vous recontacte sous 24h pour fixer le rendez-vous.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Où se déroulent les séances ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'À votre domicile dans tout le Var (83) ou en cabinet selon vos préférences et la prestation choisie. Le matériel nécessaire est fourni.',
            },
          },
          {
            '@type': 'Question',
            name: 'Comment annuler ou déplacer un rendez-vous ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Contactez Sabrina par téléphone ou email au moins 24h à l\'avance. L\'annulation tardive peut entraîner des frais selon les conditions de la prestation.',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'ariane" className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            href={isCoaching ? '/#coaching' : '/#massage'}
            className="hover:text-slate-900 font-medium"
          >
            {isCoaching ? 'Coaching' : 'Massages & Soins'}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">{service.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-white font-bold text-xs uppercase tracking-widest shadow-lg ${
              isCoaching ? 'bg-training shadow-training/30' : 'bg-care shadow-care/30'
            }`}
          >
            {isCoaching ? <Dumbbell className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
            {isCoaching ? 'Coaching Sportif' : 'Massage & Soins'}
          </span>

          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mt-4 leading-[1.05]">
            {service.title}{' '}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${accentGradient}`}>
              dans le Var (83)
            </span>
          </h1>

          {service.duration && (
            <div className="flex items-center gap-2 mt-4 text-slate-500 font-bold text-sm md:text-base">
              <Clock className="w-4 h-4" />
              Durée : {service.duration}
            </div>
          )}
        </header>

        {/* Prix + CTA */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 shadow-[3px_4px_0px_0px_rgba(45,42,38,0.12)] p-6 md:p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                {hasDiscount && service.originalPrice && (
                  <span className="text-lg md:text-xl text-slate-400 line-through decoration-red-500 decoration-[3px] font-bold">
                    {service.originalPrice}
                  </span>
                )}
                <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                  {effectivePrice} €
                </span>
                {hasDiscount && (
                  <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5 text-sm font-black text-red-600">
                    -{basePrice - effectivePrice}€
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm mt-2 font-medium">
                Paiement en ligne (CB, PayPal, Klarna 3x sans frais) ou sur place en espèces.
              </p>
            </div>
            <div className="md:ml-auto">
              <ServiceCTA service={typedService} />
            </div>
          </div>
        </div>

        {/* Description */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Description
          </h2>
          <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium">
            {service.description}
          </p>
          {service.objective && (
            <p className="mt-4 text-slate-700 font-bold italic">
              Objectif : {service.objective}
            </p>
          )}
        </section>

        {/* Features */}
        {service.features && service.features.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
              Ce qui est inclus
            </h2>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <div className={`p-1 rounded-full shrink-0 mt-0.5 ${isCoaching ? 'bg-training-light' : 'bg-care-light'}`}>
                    <Check className={`w-4 h-4 ${isCoaching ? 'text-training' : 'text-care'}`} />
                  </div>
                  <span className="text-slate-700 font-semibold">{feature.replace(/\*\*/g, '')}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* En pratique */}
        <section className="mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
            En pratique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <MapPin className="w-6 h-6 text-training mb-2" />
              <h3 className="font-black text-slate-900 mb-1">Zone</h3>
              <p className="text-sm text-slate-600">Var (83) — domicile ou cabinet</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <Phone className="w-6 h-6 text-training mb-2" />
              <h3 className="font-black text-slate-900 mb-1">Téléphone</h3>
              <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="text-sm text-slate-600 hover:text-slate-900 font-semibold">
                {CONTACT_INFO.phone}
              </a>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <Mail className="w-6 h-6 text-training mb-2" />
              <h3 className="font-black text-slate-900 mb-1">Email</h3>
              <a href={`mailto:${CONTACT_INFO.email}`} className="text-sm text-slate-600 hover:text-slate-900 font-semibold break-all">
                {CONTACT_INFO.email}
              </a>
            </div>
          </div>
        </section>

        {/* Services liés */}
        {relatedServices.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 tracking-tight">
              {isCoaching ? 'Autres prestations coaching' : 'Autres soins'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedServices.map((related) => (
                <Link
                  key={related.id}
                  href={`/services/${getServiceSlug(related)}`}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-lg transition-all"
                >
                  <h3 className="font-black text-slate-900 mb-1">{related.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-2">{related.description}</p>
                  <span className="font-black text-slate-900">{parsePriceToNumber(related.price)} €</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Instagram */}
        <section className="text-center py-6">
          <a
            href={CONTACT_INFO.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold transition-transform hover:scale-[1.02] shadow-lg"
            style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
          >
            <Instagram className="w-5 h-5" />
            Suivre @sab.fit_coaching83
          </a>
        </section>
      </div>
    </div>
  );
}
