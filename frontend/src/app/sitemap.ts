import { MetadataRoute } from 'next';
import { APP_URL, seoConfig } from '@/config/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = Object.keys(seoConfig.default); // ['sk', 'cs', 'en']

  // Helper to generate alternate languages for hreflang
  const generateAlternates = (path: string) => {
    const defaultUrl = `${APP_URL}${path}`;
    const languages: Record<string, string> = {};
    
    locales.forEach((locale) => {
      // Append locale to URL
      languages[locale] = `${APP_URL}/${locale}${path}`;
    });

    return {
      languages,
    };
  };

  return [
    {
      url: `${APP_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
      alternates: generateAlternates(''),
    },
    {
      url: `${APP_URL}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: generateAlternates('/register'),
    },
  ];
}
