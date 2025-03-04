export interface Program {
  id: string;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  imageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
