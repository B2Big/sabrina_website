import { Star } from 'lucide-react';
import { CONTACT_INFO } from '@/data/content';

/**
 * Lien "Laisser un avis Google" avec 5 étoiles.
 * Rendu uniquement si googleReviewsUrl est configuré dans CONTACT_INFO
 * (short link g.page/r/... obtenu depuis Google Business Profile).
 */
export function GoogleReviewLink({ className }: { className?: string }) {
  if (!CONTACT_INFO.googleReviewsUrl) return null;

  return (
    <a
      href={CONTACT_INFO.googleReviewsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 ${className ?? ''}`}
      aria-label="Laisser un avis Google à Sab-Fit"
    >
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
        ))}
      </span>
      <span>Laisser un avis Google</span>
    </a>
  );
}
