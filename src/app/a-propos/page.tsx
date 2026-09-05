import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Award, MapPin, Clock, CheckCircle, Star, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';

const SITE_URL = 'https://sab-fit.com';

export const metadata: Metadata = {
  title: 'À propos de Sabrina | Coach sportive diplômée — Var (83)',
  description:
    'Sabrina Compan, fondatrice de Sab-Fit : coach sportive diplômée d\'État (BP JEPS) et praticienne en massages bien-être. 15 ans d\'expérience, 200+ clients accompagnés dans le Var.',
  alternates: {
    canonical: `${SITE_URL}/a-propos`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CERTIFICATIONS = [
  { title: 'BP JEPS AF', desc: 'Brevet Professionnel — Activités de la Forme (Diplôme d\'État)', color: 'bg-training' },
  { title: 'Massage lymphatique', desc: 'Méthode brésilienne', color: 'bg-care' },
  { title: 'Madérothérapie', desc: 'Certification spécialisée', color: 'bg-care' },
  { title: 'Massage sportif & Deep Tissue', desc: 'École Dubarry Formation', color: 'bg-care' },
  { title: 'Massage californien', desc: 'Certification bien-être', color: 'bg-care' },
  { title: 'Réflexologie plantaire', desc: 'Certification bien-être', color: 'bg-care' },
];

export default function AboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/a-propos#about`,
        url: `${SITE_URL}/a-propos`,
        name: 'À propos de Sabrina Compan — Sab-Fit',
        mainEntity: {
          '@type': 'Person',
          '@id': `${SITE_URL}/#sabrina-compan`,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'À propos', item: `${SITE_URL}/a-propos` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen paper-texture bg-[#FFFBF5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'ariane" className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold">À propos</span>
        </nav>

        {/* Header */}
        <header className="grid grid-cols-1 md:grid-cols-[220px,1fr] gap-8 items-start mb-12">
          <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto md:mx-0 rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/img/sabrina/sabrina-11.webp"
              alt="Sabrina Compan — coach sportive diplômée d'État et praticienne massages bien-être dans le Var (83)"
              fill
              className="object-cover"
              sizes="224px"
            />
          </div>
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
              Votre coach dans le Var
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mt-4 leading-[1.05]">
              Sabrina{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-rose-300">
                Compan
              </span>
            </h1>
            <p className="text-slate-600 text-lg font-medium mt-3">
              Coach sportive diplômée d&apos;État & praticienne bien-être — 15 ans d&apos;expérience
            </p>
          </div>
        </header>

        {/* Bio */}
        <section className="prose prose-slate max-w-none mb-12">
          <div className="space-y-4 text-slate-600 leading-relaxed font-medium">
            <p>
              Le sport est bien plus qu&apos;un métier pour Sabrina : c&apos;est une passion profonde et un mode de vie.
              Depuis toujours, elle aime se challenger, repousser ses limites et se fixer de nouveaux objectifs,
              notamment à travers la course à pied, les runs et les défis sportifs qui rythment son parcours.
            </p>
            <p>
              Depuis plus de 15 ans, elle accompagne femmes et hommes vers leurs objectifs avec la même énergie
              et la même détermination qui l&apos;animent au quotidien. Perte de poids, remise en forme, préparation
              physique, reprise après une pause ou envie de se sentir plus fort dans son corps : chaque
              accompagnement est unique et construit sur mesure.
            </p>
            <p>
              Diplômée d&apos;État en coaching sportif (BP JEPS), Sabrina a développé une approche complète qui va
              au-delà du fitness classique. Parce qu&apos;un corps performant est aussi un corps qui récupère, elle a
              complété son expertise avec des spécialisations en massage bien-être et récupération sportive.
            </p>
            <p className="text-slate-900 font-bold">
              Sab Fit Coaching & Massages, c&apos;est l&apos;alliance entre passion du sport, performance et bien-être.
            </p>
          </div>
        </section>

        {/* Chiffres clés */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-indigo-400">15</p>
            <p className="text-xs text-slate-600 uppercase tracking-wide mt-1">ans d&apos;expérience</p>
          </div>
          <div className="bg-gradient-to-br from-rose-100 to-rose-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-rose-400">200+</p>
            <p className="text-xs text-slate-600 uppercase tracking-wide mt-1">clients accompagnés</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-cyan-500">6</p>
            <p className="text-xs text-slate-600 uppercase tracking-wide mt-1">certifications</p>
          </div>
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 text-center">
            <p className="text-3xl font-black text-amber-500">83</p>
            <p className="text-xs text-slate-600 uppercase tracking-wide mt-1">Var — à domicile</p>
          </div>
        </section>

        {/* Certifications */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight flex items-center gap-3">
            <Award className="w-7 h-7 text-training" />
            Diplômes & certifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.title} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${cert.color}`} />
                <div>
                  <p className="font-bold text-slate-900">{cert.title}</p>
                  <p className="text-sm text-slate-500">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Engagements */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-tight">Mes engagements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: CheckCircle, color: 'text-training', label: 'Coach diplômée d\'État (BP JEPS)' },
              { icon: Star, color: 'text-care', label: 'Accompagnement 100 % sur-mesure' },
              { icon: MapPin, color: 'text-training', label: 'Intervention dans tout le Var (83)' },
              { icon: Clock, color: 'text-care', label: 'Créneaux flexibles, lundi–samedi' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <Icon className={`w-5 h-5 ${item.color} shrink-0`} />
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-slate-900 text-white rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">Prêt(e) à commencer ?</h2>
          <p className="text-slate-300 mb-6 font-medium">
            Coaching sportif et massages bien-être à domicile dans le Var (83).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-black transition-all hover:-translate-y-1 shadow-xl"
            >
              Réserver une séance
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href={CONTACT_INFO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white transition-all hover:-translate-y-1 shadow-xl border-2 border-white/30"
            >
              <Instagram className="w-5 h-5" />
              @sab.fit_coaching83
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
