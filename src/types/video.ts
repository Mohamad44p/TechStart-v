export interface VideoUpload {
  url: string;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  type: 'youtube' | 'local';
}

export interface VideoFormData {
  title: string;
  date: string;
  videos: VideoUpload[];
}

export type CreateVideoGalleryResponse = {
  success: boolean;
  error?: string;
  videoGallery?: VideoGallery;
  data?: VideoGallery;
};

export interface VideoGallery {
  id: string;
  title: string;
  createdAt: Date;
  videos: VideoUpload[];
}
