import { MetadataRoute } from 'next';
import { getAllServices, getServiceSlug } from '@/lib/db-services';

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
  ];

  // Pages dédiées par service (vraies URL indexables)
  const servicePages: MetadataRoute.Sitemap = [];
  try {
    const services = await getAllServices();
    for (const service of services) {
      const slug = getServiceSlug(service);
      if (!slug) continue;
      servicePages.push({
        url: `${baseUrl}/services/${slug}`,
        lastModified: service.updatedAt ?? new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error('Error generating sitemap for services:', error);
  }

  return [...staticPages, ...servicePages];
}
