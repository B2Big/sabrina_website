import { MetadataRoute } from 'next';
import { getAllServices } from '@/lib/db-services';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://sab-fit.com';
  
  // Pages statiques
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
    {
      url: `${baseUrl}/success`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  // Services dynamiques
  let servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await getAllServices();
    servicePages = services.map((service) => ({
      url: `${baseUrl}/#${service.category.toLowerCase()}`,
      lastModified: new Date(service.updatedAt || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating sitemap for services:', error);
  }

  return [...staticPages, ...servicePages];
}
