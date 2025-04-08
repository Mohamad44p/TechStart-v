'use client';

import { LangCode } from '@/config/languages';
import { useEffect } from 'react';

interface SeoSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  lang: LangCode;
  type?: 'website' | 'article' | 'organization';
  datePublished?: string;
  dateModified?: string;
}

export default function SeoSchema({
  title,
  description,
  url,
  imageUrl,
  lang,
  type = 'website',
  datePublished,
  dateModified,
}: SeoSchemaProps) {
  // Use a client component to inject the JSON-LD schema
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'Article' : type === 'organization' ? 'Organization' : 'WebSite',
      name: title,
      headline: title,
      description,
      inLanguage: lang,
      url,
      ...(imageUrl && { image: imageUrl }),
      ...(datePublished && type === 'article' && { datePublished }),
      ...(dateModified && type === 'article' && { dateModified }),
    };

    // Check if schema script already exists and remove it
    const existingScript = document.getElementById('schema-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Add the new schema
    const script = document.createElement('script');
    script.id = 'schema-script';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      // Clean up on unmount
      const scriptToRemove = document.getElementById('schema-script');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, url, imageUrl, lang, type, datePublished, dateModified]);

  // This component doesn't render anything visible
  return null;
} 