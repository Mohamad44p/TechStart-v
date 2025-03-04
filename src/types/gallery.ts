export interface FeaturedImage {
  id: string;
  url: string;
  title_en: string | null;
  title_ar: string | null;
  featured: boolean;
  galleryId: string;
  gallery: {
    title_en: string;
    title_ar: string;
  };
}
