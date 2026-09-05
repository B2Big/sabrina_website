import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, Calendar } from 'lucide-react';
import { BLOG_POSTS, getBlogPostBySlug } from '@/data/blog-posts';
import { CONTACT_INFO } from '@/data/content';

const SITE_URL = 'https://sab-fit.com';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: 'Article introuvable | Sab-Fit' };
  }

  return {
    title: `${post.title} | Blog Sab-Fit`,
    description: post.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      type: 'article',
      locale: 'fr_FR',
      url: `${SITE_URL}/blog/${post.slug}`,
      title: `${post.title} | Blog Sab-Fit`,
      description: post.metaDescription,
      siteName: 'Sab-Fit Coaching & Massage',
      publishedTime: post.date,
      authors: ['Sabrina Compan'],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 800,
          alt: post.imageAlt,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category === post.category)
    .concat(BLOG_POSTS.filter((p) => p.slug !== post.slug && p.category !== post.category))
    .slice(0, 3);

  const formattedDate = new Date(post.date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${SITE_URL}/blog/${post.slug}#article`,
        headline: post.title,
        description: post.metaDescription,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: 'fr-FR',
        author: {
          '@type': 'Person',
          '@id': `${SITE_URL}/#sabrina-compan`,
          name: 'Sabrina Compan',
        },
        publisher: {
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/#business`,
          name: 'Sab-Fit Coaching & Massage',
        },
        mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        image: `${SITE_URL}${post.image}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
          { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE_URL}/blog/${post.slug}` },
        ],
      },
      ...(post.faq
        ? [
            {
              '@type': 'FAQPage',
              mainEntity: post.faq.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: item.a,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen paper-texture bg-[#FFFBF5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-3xl">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'ariane" className="flex items-center gap-2 text-sm text-slate-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-900 font-medium">
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/blog" className="hover:text-slate-900 font-medium">
            Blog
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-bold truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                post.category === 'Coaching'
                  ? 'bg-training/10 text-training'
                  : post.category === 'Massage'
                    ? 'bg-care/10 text-care'
                    : 'bg-rose-100 text-rose-500'
              }`}
            >
              {post.category}
            </span>
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-slate-900 leading-[1.1]">
            {post.title}
          </h1>
          <p className="text-slate-600 text-lg font-medium mt-4 leading-relaxed">{post.excerpt}</p>
        </header>

        {/* Image de couverture */}
        <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border-2 border-slate-200 shadow-[5px_7px_0px_0px_rgba(45,42,38,0.15)] mb-10">
          <Image
            src={post.image}
            alt={post.imageAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>

        {/* Contenu */}
        <div className="space-y-8 mb-12">
          {post.sections.map((section, i) => (
            <section key={i}>
              {section.heading && (
                <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">{section.heading}</h2>
              )}
              {section.paragraphs?.map((paragraph, j) => (
                <p key={j} className="text-slate-600 leading-relaxed mb-3 font-medium">
                  {paragraph}
                </p>
              ))}
              {section.list && (
                <ul className="space-y-2 my-4">
                  {section.list.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="mt-2 w-2 h-2 rounded-full bg-training shrink-0" />
                      <span className="text-slate-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* FAQ */}
        {post.faq && (
          <section className="mb-12 bg-white border-2 border-slate-200 rounded-3xl p-6 md:p-8 shadow-[3px_4px_0px_0px_rgba(45,42,38,0.12)]">
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Questions fréquentes</h2>
            <div className="space-y-4">
              {post.faq.map((item, i) => (
                <div key={i}>
                  <h3 className="font-black text-slate-900 mb-1">{item.q}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center bg-slate-900 text-white rounded-3xl p-8 md:p-10 mb-12">
          <h2 className="text-2xl md:text-3xl font-black mb-3 tracking-tight">
            Prêt(e) à passer à l&apos;action ?
          </h2>
          <p className="text-slate-300 mb-6 font-medium">
            Coaching sportif et massages bien-être à domicile dans le Var (83).
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-black transition-all hover:-translate-y-1 shadow-xl"
          >
            Réserver une séance
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>

        {/* Articles liés */}
        {relatedPosts.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">À lire aussi</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-lg transition-all"
                >
                  <h3 className="font-black text-slate-900 text-sm mb-2 leading-snug">{related.title}</h3>
                  <span className="text-xs font-bold text-training">{related.readTime} de lecture</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au blog
        </Link>

        <footer className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-500">
          <p>
            Article rédigé par Sabrina Compan — coach sportive diplômée d&apos;État,{' '}
            {CONTACT_INFO.location}.
          </p>
        </footer>
      </article>
    </div>
  );
}
