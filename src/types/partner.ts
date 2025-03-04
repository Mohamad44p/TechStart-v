export type PartnerType = "PROJECT_OF" | "FUNDED_BY" | "IMPLEMENTED_BY"

export interface PartnerPage {
  id: string
  title_en: string
  title_ar: string
  imageUrl: string
  websiteUrl: string
  type: PartnerType
  order: number
  createdAt: Date
  updatedAt: Date
}
