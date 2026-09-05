import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, ChevronRight, Dumbbell, Sparkles, Heart } from 'lucide-react';
import { BLOG_POSTS } from '@/data/blog-posts';

export const metadata: Metadata = {
  title: 'Blog | Sab-Fit — Conseils coaching & bien-être Var (83)',
  description:
    'Conseils d\'une coach sportive diplômée et praticienne en massages : perte de poids, madérothérapie, coaching à domicile, récupération sportive dans le Var (83).',
  alternates: {
    canonical: 'https://sab-fit.com/blog',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const CATEGORY_STYLES: Record<string, { icon: typeof Dumbbell; className: string }> = {
  Coaching: { icon: Dumbbell, className: 'bg-training/10 text-training' },
  Massage: { icon: Sparkles, className: 'bg-care/10 text-care' },
  'Bien-être': { icon: Heart, className: 'bg-rose-100 text-rose-500' },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen paper-texture bg-[#FFFBF5]">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-4xl">
        {/* Header */}
        <header className="mb-12">
          <nav aria-label="Fil d'ariane" className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-900 font-medium">
              Accueil
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-slate-900 font-bold">Blog</span>
          </nav>

          <span className="inline-block px-4 py-1.5 rounded-full bg-slate-900 text-white font-bold text-xs uppercase tracking-widest shadow-lg">
            Conseils d'experte
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mt-4 leading-[1.05]">
            Le blog{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-cyan-300 to-mint-300">
              Sab-Fit
            </span>
          </h1>
          <p className="text-slate-600 text-lg font-medium mt-4 max-w-2xl">
            Perte de poids, massages, coaching à domicile dans le Var : les conseils de Sabrina, coach sportive diplômée d&apos;État et praticienne en massages bien-être.
          </p>
        </header>

        {/* Liste des articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BLOG_POSTS.map((post) => {
            const cat = CATEGORY_STYLES[post.category] ?? CATEGORY_STYLES['Bien-être'];
            const Icon = cat.icon;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-[3px_4px_0px_0px_rgba(45,42,38,0.12)] hover:-translate-y-1 hover:shadow-[5px_7px_0px_0px_rgba(45,42,38,0.15)] transition-all flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${cat.className}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight mb-3">
                  {post.title}
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed flex-grow">
                  {post.excerpt}
                </p>
                <span className="mt-4 text-sm font-black text-training inline-flex items-center gap-1">
                  Lire l'article
                  <ChevronRight className="w-4 h-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
