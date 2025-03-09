"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import { cache } from "react"
import { SeoMetadataInput } from "@/lib/schema/seoSchema"

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
  { path: '/media-center/news/blog', type: 'blog' as const, name_en: 'Blog', name_ar: 'المدونة' },
  { path: '/media-center/news/publications', type: 'blog' as const, name_en: 'Publications', name_ar: 'المنشورات' },
  { path: '/media-center/news/announcements', type: 'blog' as const, name_en: 'Announcements', name_ar: 'الإعلانات' },
  { path: '/media-center/gallery/photos', type: 'gallery' as const, name_en: 'Photo Gallery', name_ar: 'معرض الصور' },
  { path: '/media-center/gallery/videos', type: 'gallery' as const, name_en: 'Video Gallery', name_ar: 'معرض الفيديو' },
] as const;

export async function createOrUpdateSeoMetadata(data: SeoMetadataInput) {
  try {
    // Check if metadata already exists for this page
    const existingMetadata = await db.seoMetadata.findFirst({
      where: { pagePath: data.pagePath }
    })

    if (existingMetadata) {
      // Update existing metadata
      const metadata = await db.seoMetadata.update({
        where: { id: existingMetadata.id },
        data: {
          title_en: data.title_en,
          title_ar: data.title_ar,
          description_en: data.description_en,
          description_ar: data.description_ar,
          keywords_en: data.keywords_en,
          keywords_ar: data.keywords_ar,
          ogImage: data.ogImage,
          canonicalUrl: data.canonicalUrl,
          noIndex: data.noIndex,
          structuredData: data.structuredData,
        }
      })
      
      revalidatePath("/admin/seo")
      return { success: true, metadata }
    } else {
      // Create new metadata
      const metadata = await db.seoMetadata.create({
        data: {
          pagePath: data.pagePath,
          pageType: data.pageType,
          title_en: data.title_en,
          title_ar: data.title_ar,
          description_en: data.description_en,
          description_ar: data.description_ar,
          keywords_en: data.keywords_en,
          keywords_ar: data.keywords_ar,
          ogImage: data.ogImage,
          canonicalUrl: data.canonicalUrl,
          noIndex: data.noIndex,
          structuredData: data.structuredData,
        }
      })
      
      revalidatePath("/admin/seo")
      return { success: true, metadata }
    }
  } catch (error) {
    console.error("Failed to save SEO metadata:", error)
    return { success: false, error: "Failed to save SEO metadata" }
  }
}

export const getSeoPages = cache(async () => {
  try {
    // Get all existing metadata
    const existingMetadata = await db.seoMetadata.findMany()
    const metadataByPath = existingMetadata.reduce((acc, meta) => {
      acc[meta.pagePath] = meta
      return acc
    }, {} as Record<string, { id: string, pagePath: string }>)
    
    // Map existing pages with their metadata status
    const pages = EXISTING_PAGES.map(page => ({
      id: page.path, // Use path as ID
      name_en: page.name_en,
      name_ar: page.name_ar,
      path: page.path,
      type: page.type,
      hasMetadata: !!metadataByPath[page.path]
    }))
    
    return { success: true, pages }
  } catch (error) {
    console.error("Failed to fetch SEO pages:", error)
    return { success: false, pages: [], error: "Failed to fetch SEO pages" }
  }
})

export const getSeoMetadataForPage = cache(async (path: string) => {
  try {
    const metadata = await db.seoMetadata.findFirst({
      where: { pagePath: path }
    })
    
    return { success: true, metadata }
  } catch (error) {
    console.error("Failed to fetch SEO metadata:", error)
    return { success: false, metadata: null, error: "Failed to fetch SEO metadata" }
  }
})

export const getSeoMetadataByPath = cache(async (path: string, lang: string = 'en') => {
  try {
    const metadata = await db.seoMetadata.findFirst({
      where: { pagePath: path }
    })
    
    if (!metadata) {
      return { success: false, metadata: null }
    }
    
    // Format the metadata for use in the page head
    const formattedMetadata = {
      title: lang === 'ar' ? metadata.title_ar : metadata.title_en,
      description: lang === 'ar' ? metadata.description_ar : metadata.description_en,
      keywords: lang === 'ar' ? metadata.keywords_ar : metadata.keywords_en,
      ogImage: metadata.ogImage,
      canonicalUrl: metadata.canonicalUrl,
      noIndex: metadata.noIndex,
      structuredData: metadata.structuredData,
    }
    
    return { success: true, metadata: formattedMetadata }
  } catch (error) {
    console.error("Failed to fetch SEO metadata by path:", error)
    return { success: false, metadata: null, error: "Failed to fetch SEO metadata" }
  }
}) 