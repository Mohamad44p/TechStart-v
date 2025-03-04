import { z } from "zod";

export const createVideoGallerySchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date",
  }),
  videos: z.array(z.object({
    url: z.string().min(1, "Video URL is required"),
    title: z.string().min(1, "Video title is required"),
    description: z.string().optional(),
  })).min(1, "At least one video is required"),
});

export type CreateVideoGalleryInput = z.infer<typeof createVideoGallerySchema>;

