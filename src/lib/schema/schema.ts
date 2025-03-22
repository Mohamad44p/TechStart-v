import { z } from "zod";

export const PostType = {
  NEWS: 'blog', // 'News & Press Releases' displayed in UI
  PUBLICATION: 'publication',
  ANNOUNCEMENT: 'announcement'
} as const;

export type PostTypeValue = typeof PostType[keyof typeof PostType];

export const createPostSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  type: z.enum([PostType.NEWS, PostType.PUBLICATION, PostType.ANNOUNCEMENT]),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().optional().nullable().transform(val => val || ""),
  description_ar: z.string().optional().nullable().transform(val => val || ""),
  content_en: z.string().optional().nullable().transform(val => val || ""),
  content_ar: z.string().optional().nullable().transform(val => val || ""),
  pdfUrl: z.string().optional().nullable(),
  imageUrl: z.string().nullable(),
  readTime: z.string().optional(),
  published: z.boolean(),
  featured: z.boolean(),
  tags: z.array(z.string()),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format").default(() => new Date().toISOString().split('T')[0]),
}).refine((data) => {
  if (data.type === PostType.PUBLICATION) {
    return data.title_en && data.title_ar && data.pdfUrl;
  }
  return data.content_en && data.content_ar;
}, {
  message: "Required fields are missing",
  path: ["content"]
});

export type CreatePostInput = z.infer<typeof createPostSchema>

export const createTagSchema = z.object({
  name_en: z.string().min(1, "English tag name is required"),
  name_ar: z.string().min(1, "Arabic tag name is required"),
})

export type CreateTagInput = z.infer<typeof createTagSchema>


export const createGallerySchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  date: z.string(),
  imageUrls: z.array(z.string()).min(1, "At least one image is required"),
  imageTitles_en: z.array(z.string().nullish()).optional(),
  imageTitles_ar: z.array(z.string().nullish()).optional(),
  imageFeatured: z.array(z.boolean()).optional(),
});

export type CreateGalleryInput = z.infer<typeof createGallerySchema>;

export const editGallerySchema = createGallerySchema.extend({
  deletedImageIds: z.array(z.string()),
});

export type EditGalleryInput = z.infer<typeof editGallerySchema>;

export const videoSchema = z.object({
  url: z.string().min(1, "Video URL is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  description_en: z.string().nullable(),
  description_ar: z.string().nullable(),
  type: z.enum(['youtube', 'local', 'blob'] as const),
  thumbnail: z.string().nullable(),
  featured: z.boolean().default(false),
});

export const createVideoGallerySchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  videos: z.array(videoSchema)
    .min(1, "At least one video is required")
    .refine(
      (videos) => videos.filter(v => v.featured).length === 1,
      "Exactly one video must be featured"
    ),
});

export const updateVideoGallerySchema = createVideoGallerySchema.extend({
  id: z.string(),
});

export type CreateVideoGalleryInput = z.infer<typeof createVideoGallerySchema>;
export type UpdateVideoGalleryInput = z.infer<typeof updateVideoGallerySchema>;


