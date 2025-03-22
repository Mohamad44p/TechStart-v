export interface Safeguard {
  id: string;
  domain: string;
  title_en: string;
  title_ar: string;
  tagline_en: string;
  tagline_ar: string;
  description_en: string;
  description_ar: string;
  longDescription_en: string | null;
  longDescription_ar: string | null;
  bgColor: string;
  attachmentUrl: string | null;
  imageUrl: string | null;
  order: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
