import { z } from "zod"

export const partnerPageSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  imageUrl: z.string().url("Invalid image URL"),
  websiteUrl: z.string().url("Invalid website URL"),
  type: z.enum(["PROJECT_OF", "FUNDED_BY", "IMPLEMENTED_BY"]),
  order: z.number().int().nonnegative(),
})

export type PartnerPageFormInput = z.infer<typeof partnerPageSchema>
