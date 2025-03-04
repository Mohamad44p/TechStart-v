import { z } from "zod"

export const footerSchema = z.object({
  techStartTitle_en: z.string().min(1),
  techStartTitle_ar: z.string().min(1),
  titleColor: z.string().min(4),
  gradientColor: z.string().min(4),
  instagram: z.string().url().optional().nullable().or(z.literal("")),
  linkedin: z.string().url().optional().nullable().or(z.literal("")),
  facebook: z.string().url().optional().nullable().or(z.literal("")),
  youtube: z.string().url().optional().nullable().or(z.literal("")),
  twitter: z.string().url().optional().nullable().or(z.literal("")),
  projectPartners: z.array(z.string()),
  fundedPartners: z.array(z.string()),
  implementedPartners: z.array(z.string()),
})

export type FooterFormInput = z.infer<typeof footerSchema>
