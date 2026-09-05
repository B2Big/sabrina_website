import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Dumbbell, Sparkles, Flame, Clock } from 'lucide-react';
import { getAllServices, getActivePromotions, getServiceSlug } from '@/lib/db-services';
import { parsePriceToNumber, applyPromotionDiscount } from '@/lib/pricing';

const SITE_URL = 'https://sab-fit.com';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tarifs coaching & massage | Sab-Fit — Var (83)',
  description:
    'Tarifs du coaching sportif et des massages bien-être dans le Var (83) : séance découverte, packs, cures, madérothérapie, massage sportif. Paiement en ligne ou sur place.',
  alternates: {
    canonical: `${SITE_URL}/tarifs`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function TarifsPage() {
  const [services, promotions] = await Promise.all([getAllServices(), getActivePromotions()]);

  const withPrices = services.map((service) => {
    const basePrice = parsePriceToNumber(service.price);
    const effectivePrice = applyPromotionDiscount(basePrice, promotions, service.id);
    return {
      ...service,
      basePrice,
      effectivePrice,
      hasDiscount: effectivePrice < basePrice,
    };
  });

  const coaching = withPrices.filter((s) => s.category === 'Coaching');
  const massage = withPrices.filter((s) => s.category !== 'Coaching');

  const tariffJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'OfferCatalog',
        '@id': `${SITE_URL}/tarifs#catalogue`,
        name: 'Tarifs Coaching et Massage — Sab-Fit',
        itemListElement: withPrices.map((service) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service.title,
            description: service.description,
          },
          price: service.effectivePrice.toFixed(2),
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/services/${getServiceSlug(service)}`,
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Tarifs', item: `${SITE_URL}/tarifs` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Quels sont les tarifs du coaching sportif ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Les tarifs du coaching sportif à domicile dans le Var commencent à 50 € la séance individuelle, avec des packs de 5 ou 10 séances plus avantageux. Le détail complet est disponible sur la page tarifs de sab-fit.com.',
            },
          },
          {
            '@type': 'Question',
            name: 'Peut-on payer en plusieurs fois ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Oui, le paiement en 3 fois sans frais est disponible avec Klarna pour tout achat à partir de 35 €. Vous pouvez aussi payer par carte bancaire, PayPal ou en espèces sur place.',
            },
          },
        ],
      },
    ],
  };

  const renderGroup = (
    title: string,
    items: typeof coaching,
    isCoaching: boolean
  ) => (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <span
          className={`p-2.5 rounded-xl text-white shadow-lg ${isCoaching ? 'bg-training shadow-training/30' : 'bg-care shadow-care/30'}`}
        >
          {isCoaching ? <Dumbbell className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
      </div>

      <div className="space-y-4">
        {items.map((service) => (
          <Link
            key={service.id}
            href={`/services/${getServiceSlug(service)}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-[3px_4px_0px_0px_rgba(45,42,38,0.12)] hover:-translate-y-0.5 hover:shadow-[5px_6px_0px_0px_rgba(45,42,38,0.15)] transition-all"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-black text-slate-900 text-lg">{service.title}</h3>
                {service.duration && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {service.duration}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 mt-1">{service.description}</p>
            </div>
            <div className="sm:text-right shrink-0">
              {service.hasDiscount && (
                <div className="flex items-center gap-2 sm:justify-end">
                  <span className="text-sm text-slate-400 line-through decoration-red-500 decoration-2 font-bold">
                    {service.basePrice} €
                  </span>
                  <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 rounded-lg px-2 py-0.5 text-xs font-black text-red-600">
                    <Flame className="w-3 h-3" />
                    -{service.basePrice - service.effectivePrice}€
                  </span>
                </div>
              )}
              <span className="text-2xl font-black text-slate-900">{service.effectivePrice} €</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen paper-texture bg-[#FFFBF5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tariffJsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'ariane" className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">Tarifs</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
            Tarifs transparents
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mt-4 leading-[1.05]">
            Tarifs{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300">
              coaching & massage
            </span>
          </h1>
          <p className="text-slate-600 text-lg font-medium mt-4 max-w-2xl">
            Des prix clairs, sans surprise. Paiement en ligne sécurisé (CB, PayPal, Klarna 3x sans frais) ou sur place en espèces.
          </p>
        </header>

        {renderGroup('Coaching sportif', coaching, true)}
        {renderGroup('Massages & soins', massage, false)}

        {/* Note paiement */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 md:p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Prêt(e) à réserver ?</h2>
          <p className="text-slate-300 mb-6 font-medium">
            Choisissez votre prestation et réservez en ligne en 2 minutes.
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
