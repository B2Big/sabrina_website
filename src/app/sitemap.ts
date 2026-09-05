import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sab-fit.com';
  
  // Pages statiques réelles (pas de fragments : ignorés par Google et les bots IA)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cgu`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
  ];

  // Note : le site est une one-page ; les sections services sont des ancres (#coaching, #massage)
  // qui ne peuvent pas être indexées. Des pages dédiées par service sont prévues (roadmap GEO).

  return staticPages;
}
