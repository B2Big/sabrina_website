import { MetadataRoute } from 'next';

const baseUrl = 'https://sabrina-coaching-massage.fr'; // À changer lors du déploiement réel

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    // On pourrait ajouter d'autres pages si le site s'agrandit
  ];
}