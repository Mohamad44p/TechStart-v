import { PostType, type PostTypeValue } from '@/lib/schema/schema';

// Base tag interface
export interface BaseTag {
  name_en: string;
  name_ar: string;
  slug: string;
}

// Database tag interface
export interface Tag extends BaseTag {
  id: number;
}

// Localized tag interface
export interface LocalizedTag extends BaseTag {
  name?: string;
}

export interface Post {
  id: number;
  slug: string;
  type: PostTypeValue;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  content_en: string;
  content_ar: string;
  imageUrl: string | null;
  pdfUrl: string | null;
  readTime: string | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: Tag[];
}

export interface BlogPost extends Omit<Post, 'tags'> {
  title?: string;
  description?: string | null;
  isPdf?: boolean;
  tags: LocalizedTag[];
}

export interface ContentItem {
  id: number;
  type: PostTypeValue;
  title_en: string;
  title_ar: string;
  description_en: string | null;
  description_ar: string | null;
  title?: string;
  description?: string | null;
  imageUrl: string | null;
  pdfUrl: string | null;
  readTime: string | null;
  createdAt: Date;
  slug: string;
  tags: Tag[];
  isPdf?: boolean;
}

export interface LocalizedBlogPost {
  id: number
  type: PostTypeValue;  // Changed from PostType to PostTypeValue
  slug: string
  title: string
  description: string | null
  content: string
  imageUrl: string | null
  readTime: string | null
  published: boolean
  featured: boolean
  authorId: number | null
  createdAt: Date
  updatedAt: Date
  tags: { name: string; slug: string }[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Update the type guard to use PostTypeValue
export function isPostType(type: string): type is PostTypeValue {
  return Object.values(PostType).includes(type as PostTypeValue);
}

// Update return type to PostTypeValue
export function toPostType(type: string): PostTypeValue {
  const normalizedType = type.toLowerCase();
  switch (normalizedType) {
    case 'blog':
      return PostType.NEWS;
    case 'publication':
      return PostType.PUBLICATION;
    case 'announcement':
      return PostType.ANNOUNCEMENT;
    default:
      return PostType.NEWS;
  }
}
