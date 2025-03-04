import { VideoGallery as PrismaVideoGallery } from "@prisma/client";

export type VideoType = 'youtube' | 'local' | 'blob';

export interface VideoBase {
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  type: VideoType;
  thumbnail: string | null;
  featured: boolean;
}

export interface Video extends VideoBase {
  id: string;
  url: string;
  galleryId: string;
  createdAt: Date;
}

export interface VideoGallery {
  id: string;
  title_en: string;
  title_ar: string;
  createdAt: Date;
  updatedAt: Date;
  videos: Video[];
}

export interface FormattedVideoGallery extends Omit<PrismaVideoGallery, 'createdAt'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  videos: any;
  createdAt: string;
}

export interface VideoUpload {
  url: string
  title_en: string
  title_ar: string
  description_en: string | null
  description_ar: string | null
  type: "youtube" | "local" | "blob"
  thumbnail: string | null
  featured: boolean
}

export interface VideoFormData {
  title_en: string;
  title_ar: string;
  date: string;
  videos: VideoUpload[];
}
