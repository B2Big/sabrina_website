/**
 * Génération de slugs SEO pour les services.
 * Utilisée côté serveur (pages /services/[slug], sitemap) et côté client (liens des cartes).
 */

const ACCENT_MAP: Record<string, string> = {
  à: 'a', â: 'a', ä: 'a', á: 'a', ã: 'a', å: 'a',
  é: 'e', è: 'e', ê: 'e', ë: 'e',
  î: 'i', ï: 'i', í: 'i', ì: 'i',
  ô: 'o', ö: 'o', ó: 'o', ò: 'o', õ: 'o',
  û: 'u', ü: 'u', ù: 'u', ú: 'u',
  ç: 'c',
  ÿ: 'y', ý: 'y',
  ñ: 'n',
  œ: 'oe', æ: 'ae',
};

export function slugify(text: string): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .split('')
    .map((char) => ACCENT_MAP[char] ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-') // tout caractère non alphanumérique → tiret
    .replace(/^-+|-+$/g, '')     // retirer les tirets en début/fin
    .slice(0, 80);               // limiter la longueur
}
