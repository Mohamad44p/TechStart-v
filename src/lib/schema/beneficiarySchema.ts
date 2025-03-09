import * as z from "zod"

export const beneficiarySchema = z.object({
  title_en: z.string().min(2),
  title_ar: z.string().min(2),
  description_en: z.string().min(10),
  description_ar: z.string().min(10),
  longDescription_en: z.union([
    z.string().min(50),
    z.string().max(0),
    z.null()
  ]).optional().nullable(),
  longDescription_ar: z.union([
    z.string().min(50),
    z.string().max(0),
    z.null()
  ]).optional().nullable(),
  imageUrl: z.string().nullable(),
  buttonText: z.union([
    z.string().min(2),
    z.string().max(0),
    z.null()
  ]).optional().nullable(),
  buttonLink: z.union([
    z.string().url(),
    z.string().max(0),
    z.null()
  ]).optional().nullable(),
  categoryId: z.string().min(1),
})

export type BeneficiaryFormInput = z.infer<typeof beneficiarySchema>

export const categorySchema = z.object({
  name_en: z.string().min(2),
  name_ar: z.string().min(2),
  slug: z.string().min(2),
})

export type CategoryFormInput = z.infer<typeof categorySchema>
