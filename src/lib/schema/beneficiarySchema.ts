import * as z from "zod"

export const beneficiarySchema = z.object({
  title_en: z.string().min(2),
  title_ar: z.string().min(2),
  description_en: z.string().min(10),
  description_ar: z.string().min(10),
  longDescription_en: z.string().min(50),
  longDescription_ar: z.string().min(50),
  imageUrl: z.string().nullable(),
  ctaText: z.string().min(2),
  ctaLink: z.string().url(),
  categoryId: z.string().min(1),
})

export type BeneficiaryFormInput = z.infer<typeof beneficiarySchema>

export const categorySchema = z.object({
  name_en: z.string().min(2),
  name_ar: z.string().min(2),
  slug: z.string().min(2),
})

export type CategoryFormInput = z.infer<typeof categorySchema>
