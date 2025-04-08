import { MetadataRoute } from 'next';
import { languages } from '@/config/languages';

const baseUrl =  'https://techstart.ps';

const routes = [
  '', // homepage
  'About-us',
  'Contact-us',
  'Database',
  'FAQs',
  'Our-Beneficiaries',
  'Safeguards',
  'media-center',
  'partners',
  'programs',
  'submit-complaint',
  'work-with-us',
];

export default function sitemap(): MetadataRoute.Sitemap {
  // Create sitemap entries for each language and route
  const sitemapEntries = Object.keys(languages).flatMap(lang => {
    return routes.map(route => {
      const path = route ? `/${lang}/${route}` : `/${lang}`;
      
      // You can customize the changeFrequency and priority based on route importance
      return {
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly' as 'daily' | 'weekly',
        priority: route === '' ? 1.0 : 0.8,
      };
    });
  });

  return sitemapEntries;
} 