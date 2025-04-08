import { MetadataRoute } from 'next';

// Define your base URL - Update this with your production URL
const baseUrl = 'https://techstart.ps';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Disallow any routes that should be private or not indexed
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/server-sitemap.xml',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
} 