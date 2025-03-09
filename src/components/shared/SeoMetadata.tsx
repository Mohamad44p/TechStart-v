import { getSeoMetadataByPath } from "@/app/actions/seo-actions"

interface SeoMetadataProps {
  path: string
  lang: string
  defaultTitle?: string
  defaultDescription?: string
}

export async function SeoMetadata({ 
  path, 
  lang, 
  defaultTitle, 
  defaultDescription 
}: SeoMetadataProps) {
  const { metadata } = await getSeoMetadataByPath(path, lang)
  
  const title = metadata?.title || defaultTitle || ""
  const description = metadata?.description || defaultDescription || ""
  const keywords = metadata?.keywords || ""
  const ogImage = metadata?.ogImage || ""
  const canonicalUrl = metadata?.canonicalUrl || ""
  const noIndex = metadata?.noIndex || false
  const structuredData = metadata?.structuredData || ""
  
  return (
    <>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* No Index */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Structured Data */}
      {structuredData && (
        <script 
          type="application/ld+json" 
          dangerouslySetInnerHTML={{ __html: structuredData }} 
        />
      )}
    </>
  )
} 