/* eslint-disable @typescript-eslint/no-explicit-any */

export function transformFocusareaData(focusareaData: any) {
  return {
    id: focusareaData.id,
    titleEn: focusareaData.titleEn,
    titleAr: focusareaData.titleAr,
    descriptionEn: focusareaData.descriptionEn,
    descriptionAr: focusareaData.descriptionAr,
    cards: focusareaData.cards.map((card: any) => ({
      titleEn: card.titleEn,
      titleAr: card.titleAr,
      imageUrl: card.imageUrl
    }))
  };
} 