export interface ProgramsHero {
  id: string
  name: string
  tagline_en: string
  tagline_ar: string
  title_en: string
  title_ar: string
  highlightWord_en: string
  highlightWord_ar: string
  description_en: string
  description_ar: string
  objectives_en: string | null
  objectives_ar: string | null
  imageUrl: string | null
  card1Title_en: string | null
  card1Title_ar: string | null
  card1Icon: string | null
  card1Description_en: string | null
  card1Description_ar: string | null
  card1Show: boolean
  card2Title_en: string | null
  card2Title_ar: string | null
  card2Icon: string | null
  card2Description_en: string | null
  card2Description_ar: string | null
  card2Show: boolean
  card3Title_en: string | null
  card3Title_ar: string | null
  card3Icon: string | null
  card3Description_en: string | null
  card3Description_ar: string | null
  card3Show: boolean
  eligibility_en: string | null
  eligibility_ar: string | null
  createdAt: Date
  updatedAt: Date
  programPageId: string | null
  programPage?: ProgramsPages | null  // Changed to optional with ?
}

export interface ProgramsPages {
  id: string
  name_en: string
  name_ar: string
  createdAt: Date
  updatedAt: Date
  categoryId: string | null
}

export interface CreateProgramsHeroInput {
  name: string
  tagline_en: string
  tagline_ar: string
  title_en: string
  title_ar: string
  highlightWord_en: string
  highlightWord_ar: string
  description_en: string
  description_ar: string
  objectives_en: string | null
  objectives_ar: string | null
  eligibility_en: string | null
  eligibility_ar: string | null
  imageUrl: string | null
  card1Title_en: string | null
  card1Title_ar: string | null
  card1Icon: string | null
  card1Description_en: string | null
  card1Description_ar: string | null
  card1Show: boolean
  card2Title_en: string | null
  card2Title_ar: string | null
  card2Icon: string | null
  card2Description_en: string | null
  card2Description_ar: string | null
  card2Show: boolean
  card3Title_en: string | null
  card3Title_ar: string | null
  card3Icon: string | null
  card3Description_en: string | null
  card3Description_ar: string | null
  card3Show: boolean
  programPageId: string | null
}

export interface UpdateProgramsHeroInput extends Partial<CreateProgramsHeroInput> {
  id: string
}

export type ProgramsHeroWithProgram = ProgramsHero & {
  programPage: ProgramsPages | null
}

