import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FAQS } from '@/data/faqs';
import { CONTACT_INFO } from '@/data/content';

const SITE_URL = 'https://sab-fit.com';

export const metadata: Metadata = {
  title: 'FAQ | Sab-Fit — Questions fréquentes coaching & massage Var (83)',
  description:
    'Toutes les réponses à vos questions sur le coaching sportif et les massages bien-être dans le Var : déroulement des séances, paiement, annulation, résultats.',
  alternates: {
    canonical: `${SITE_URL}/faq`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FaqPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE_URL}/faq#faq`,
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen paper-texture bg-[#FFFBF5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-3xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'ariane" className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">FAQ</span>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
            Questions fréquentes
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mt-4 leading-[1.05]">
            Tout savoir sur{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300">
              Sab-Fit
            </span>
          </h1>
          <p className="text-slate-600 text-lg font-medium mt-4">
            Les réponses aux questions les plus courantes sur le coaching sportif et les massages bien-être dans le Var (83).
          </p>
        </header>

        {/* FAQ */}
        <div className="space-y-4 mb-12">
          {FAQS.map((faq, i) => (
            <section key={i} className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-[3px_4px_0px_0px_rgba(45,42,38,0.12)]">
              <h2 className="font-black text-slate-900 text-lg mb-2">{faq.q}</h2>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </section>
          ))}
        </div>

        {/* CTA */}
        <section className="text-center bg-slate-900 text-white rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Une autre question ?</h2>
          <p className="text-slate-300 mb-6 font-medium">
            Contactez Sabrina au {CONTACT_INFO.phone} ou via le formulaire de réservation.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-black transition-all hover:-translate-y-1 shadow-xl"
          >
            Poser ma question
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
