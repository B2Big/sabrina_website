/**
 * Logique de prix partagée entre l'affichage (page.tsx) et le paiement (api/checkout).
 * Garantit que le prix payé chez Stripe est TOUJOURS identique au prix affiché sur le site.
 */

// Parse "70 €" -> 70 (tolérant au format)
export function parsePriceToNumber(price: string | null | undefined): number {
  if (!price || typeof price !== 'string') return 0;
  const numeric = price.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(numeric);
  return isNaN(parsed) ? 0 : parsed;
}

type PromotionLike = {
  isActive: boolean;
  discountPercent: number | null;
  services: Array<{ id: string }> | null | undefined;
};

/**
 * Applique la remise de la première promotion active qui cible le service.
 * Retourne le prix effectif (arrondi à l'euro), ou le prix de base sans remise.
 */
export function applyPromotionDiscount(
  basePrice: number,
  promotions: PromotionLike[] | null | undefined,
  serviceId: string
): number {
  const activePromo = (promotions || []).find(
    (p) =>
      p.isActive &&
      p.discountPercent != null &&
      p.services?.some((s) => s.id === serviceId)
  );

  if (activePromo && activePromo.discountPercent) {
    return Math.round(basePrice * (1 - activePromo.discountPercent / 100));
  }

  return basePrice;
}
