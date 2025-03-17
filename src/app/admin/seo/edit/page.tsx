import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getSeoMetadataForPage } from "@/app/actions/seo-actions"
import { SeoMetadataForm } from "../components/SeoMetadataForm"

export const metadata: Metadata = {
  title: "Edit SEO Metadata",
  description: "Edit SEO metadata for a specific page",
}

interface SeoEditPageProps {
  searchParams: Promise<{
    path?: string
  }>
}

// Define the existing page routes in the application
const EXISTING_PAGES = [
  { path: '/', type: 'home' as const, name_en: 'Home', name_ar: 'الرئيسية' },
  { path: '/About-us', type: 'about' as const, name_en: 'About Us', name_ar: 'من نحن' },
  { path: '/partners', type: 'about' as const, name_en: 'Partners', name_ar: 'الشركاء' },
  { path: '/Palestinian-IT-leads', type: 'about' as const, name_en: 'Palestinian IT Leads', name_ar: 'قادة تكنولوجيا المعلومات الفلسطينيون' },
  { path: '/work-with-us', type: 'about' as const, name_en: 'Work With Us', name_ar: 'اعمل معنا' },
  { path: '/programs', type: 'program' as const, name_en: 'Programs', name_ar: 'البرامج' },
  { path: '/Contact-us', type: 'contact' as const, name_en: 'Contact Us', name_ar: 'اتصل بنا' },
  { path: '/Safeguards', type: 'about' as const, name_en: 'Safeguards', name_ar: 'الضمانات' },
  { path: '/FAQs', type: 'about' as const, name_en: 'FAQs', name_ar: 'الأسئلة الشائعة' },
  { path: '/submit-complaint', type: 'contact' as const, name_en: 'Submit Complaint', name_ar: 'تقديم شكوى' },
  { path: '/media-center/news', type: 'blog' as const, name_en: 'News', name_ar: 'الأخبار' },
  { path: '/media-center/news/blog', type: 'blog' as const, name_en: 'News & Press Releases', name_ar: 'الأخبار والبيانات الصحفية' },
  { path: '/media-center/news/publications', type: 'blog' as const, name_en: 'Publications', name_ar: 'المنشورات' },
  { path: '/media-center/news/announcements', type: 'blog' as const, name_en: 'Announcements', name_ar: 'الإعلانات' },
  { path: '/media-center/gallery/photos', type: 'gallery' as const, name_en: 'Photo Gallery', name_ar: 'معرض الصور' },
  { path: '/media-center/gallery/videos', type: 'gallery' as const, name_en: 'Video Gallery', name_ar: 'معرض الفيديو' },
] as const;

export default async function SeoEditPage(props: SeoEditPageProps) {
  const searchParams = await props.searchParams;
  const { path } = searchParams

  if (!path) {
    redirect("/admin/seo")
  }

  // Find the page details
  const page = EXISTING_PAGES.find(p => p.path === path)
  if (!page) {
    notFound()
  }

  // Get existing metadata if any
  const metadataResult = await getSeoMetadataForPage(path)
  const existingMetadata = metadataResult.success && metadataResult.metadata 
    ? {
        pagePath: metadataResult.metadata.pagePath,
        pageType: metadataResult.metadata.pageType,
        title_en: metadataResult.metadata.title_en,
        title_ar: metadataResult.metadata.title_ar,
        description_en: metadataResult.metadata.description_en,
        description_ar: metadataResult.metadata.description_ar,
        keywords_en: metadataResult.metadata.keywords_en || "",
        keywords_ar: metadataResult.metadata.keywords_ar || "",
        ogImage: metadataResult.metadata.ogImage || "",
        canonicalUrl: metadataResult.metadata.canonicalUrl || "",
        noIndex: metadataResult.metadata.noIndex || false,
        structuredData: metadataResult.metadata.structuredData || "",
      }
    : undefined

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit SEO Metadata</h1>
        <p className="text-muted-foreground mt-2">
          Edit SEO metadata for <span className="font-medium">{page.name_en}</span> ({page.path})
        </p>
      </div>
      
      <SeoMetadataForm 
        page={page} 
        initialData={existingMetadata} 
      />
    </div>
  )
} 