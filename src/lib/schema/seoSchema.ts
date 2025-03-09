import * as z from "zod"

export const seoMetadataSchema = z.object({
  pagePath: z.string().min(1),
  pageType: z.enum(['home', 'program', 'blog', 'gallery', 'about', 'contact', 'custom']),
  title_en: z.string().min(1).max(70),
  title_ar: z.string().min(1).max(70),
  description_en: z.string().min(1).max(160),
  description_ar: z.string().min(1).max(160),
  keywords_en: z.string().optional(),
  keywords_ar: z.string().optional(),
  ogImage: z.string().optional().nullable(),
  canonicalUrl: z.string().optional().nullable(),
  noIndex: z.boolean().default(false),
  structuredData: z.string().optional().nullable(),
})

export type SeoMetadataInput = z.infer<typeof seoMetadataSchema>

export const seoPageSchema = z.object({
  id: z.string().optional(),
  name_en: z.string().min(1),
  name_ar: z.string().min(1),
  path: z.string().min(1),
  type: z.enum(['home', 'program', 'blog', 'gallery', 'about', 'contact', 'custom']),
})

export type SeoPageInput = z.infer<typeof seoPageSchema> 