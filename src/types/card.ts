export type CardCategory = 'education' | 'healthcare' | 'training' | 'welfare' | 'technology';

export interface Card {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  category: CardCategory;
  ctaText: string;
  ctaLink: string;
}

