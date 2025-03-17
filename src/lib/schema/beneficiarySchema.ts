import * as z from "zod"

export const beneficiarySchema = z.object({
  title_en: z.string().min(2),
  title_ar: z.string().min(2),
  description_en: z.string().optional().nullable(),
  description_ar: z.string().optional().nullable(),
  imageUrl: z.string(),
  ctaText: z.string().optional().nullable(),
  ctaLink: z.string().optional().nullable(),
  categoryId: z.string().min(1),
})

export type BeneficiaryFormInput = z.infer<typeof beneficiarySchema>

export const categorySchema = z.object({
  name_en: z.string().min(2),
  name_ar: z.string().min(2),
  slug: z.string().min(2),
})

export type CategoryFormInput = z.infer<typeof categorySchema>
