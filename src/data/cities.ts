/**
 * Pages locales par ville — contenu unique par ville pour le SEO local et le GEO.
 */

export type CityPage = {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  localParagraph: string;
  neighborhoods: string[];
};

export const CITIES: CityPage[] = [
  {
    slug: 'toulon',
    name: 'Toulon',
    title: 'Coach sportif & massage à Toulon (83000) | Sab-Fit',
    metaDescription:
      'Coaching sportif à domicile et massages bien-être à Toulon (83000) : perte de poids, remise en forme, madérothérapie, massage sportif. Devis et réservation en ligne avec Sab-Fit.',
    h1: 'Coach sportif et massage à Toulon',
    intro:
      'Sabrina, coach sportive diplômée d\'État et praticienne en massages bien-être, intervient à domicile dans tout Toulon (83000) avec le matériel nécessaire. Coaching personnalisé, madérothérapie, massage sportif : un accompagnement complet pour vos objectifs.',
    localParagraph:
      'Du Mourillon au centre-ville en passant par la Rode, les séances se déroulent chez vous, à l\'heure qui vous arrange. Fini les trajets vers la salle de sport : le coach vient à vous, avec haltères, élastiques et tapis. Idéal pour les habitants de Toulon au planning chargé, du fonctionnaire de l\'arsenal au télétravailleur.',
    neighborhoods: ['Le Mourillon', 'Centre-ville', 'La Rode', 'Pont-du-Las', 'Sainte-Musse'],
  },
  {
    slug: 'hyeres',
    name: 'Hyères',
    title: 'Coach sportif & massage à Hyères (83400) | Sab-Fit',
    metaDescription:
      'Coaching sportif à domicile et massages bien-être à Hyères (83400) : perte de poids, remise en forme, madérothérapie, massage sportif. Réservation en ligne avec Sab-Fit.',
    h1: 'Coach sportif et massage à Hyères',
    intro:
      'À Hyères (83400), Sab-Fit propose coaching sportif sur mesure et massages bien-être à domicile : perte de poids, préparation physique, madérothérapie, massage sportif et californien.',
    localParagraph:
      'Des Palmiers au centre ancien en passant par Giens et La Capte, Sabrina se déplace chez vous avec tout le matériel. Les séances s\'adaptent à votre environnement : appartement, villa avec jardin, terrasse face à la mer — l\'entraînement en plein air est même possible aux beaux jours.',
    neighborhoods: ['Centre-ville', 'Les Palmiers', 'Giens', 'La Capte', 'Costebelle'],
  },
  {
    slug: 'la-seyne-sur-mer',
    name: 'La Seyne-sur-Mer',
    title: 'Coach sportif & massage à La Seyne-sur-Mer (83500) | Sab-Fit',
    metaDescription:
      'Coaching sportif à domicile et massages bien-être à La Seyne-sur-Mer (83500) : perte de poids, remise en forme, madérothérapie, massage sportif. Réservation en ligne avec Sab-Fit.',
    h1: 'Coach sportif et massage à La Seyne-sur-Mer',
    intro:
      'Sab-Fit accompagne les habitants de La Seyne-sur-Mer (83500) avec un coaching sportif personnalisé à domicile et des massages bien-être : madérothérapie, massage sportif, drainage lymphatique.',
    localParagraph:
      'De Tamaris aux Sablettes en passant par le centre-ville, Sabrina intervient à domicile avec tout le matériel nécessaire. Une option idéale pour les familles et les actifs qui souhaitent s\'entraîner sans perdre de temps en déplacements, à deux pas de la rade de Toulon.',
    neighborhoods: ['Les Sablettes', 'Tamaris', 'Centre-ville', 'La Navette', 'Le Mar Vivo'],
  },
  {
    slug: 'la-valette-du-var',
    name: 'La Valette-du-Var',
    title: 'Coach sportif & massage à La Valette-du-Var (83160) | Sab-Fit',
    metaDescription:
      'Coaching sportif à domicile et massages bien-être à La Valette-du-Var (83160) : perte de poids, remise en forme, madérothérapie, massage sportif. Réservation en ligne avec Sab-Fit.',
    h1: 'Coach sportif et massage à La Valette-du-Var',
    intro:
      'À La Valette-du-Var (83160), Sab-Fit propose un coaching sportif 100 % personnalisé et des massages bien-être à domicile : perte de poids, tonification, madérothérapie, massage sportif.',
    localParagraph:
      'Sabrina intervient dans tous les quartiers de La Valette-du-Var, à domicile ou en cabinet, avec le matériel fourni. Une solution pratique pour progresser en toute sécurité, que vous repreniez le sport après une pause ou prépariez un objectif précis.',
    neighborhoods: ['Centre-ville', 'La Coupiane', 'Le Plan', 'Les Gabelles', 'La Bayorre'],
  },
];

export function getCityBySlug(slug: string): CityPage | undefined {
  return CITIES.find((city) => city.slug === slug);
}
