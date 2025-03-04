export type FocusareaCard = {
  id: string
  titleEn: string
  titleAr: string
  imageUrl: string
  focusareaId: string
  createdAt: Date
  updatedAt: Date
}

export type Focusarea = {
  id: string
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  cards: FocusareaCard[]
  createdAt: Date
  updatedAt: Date
}
