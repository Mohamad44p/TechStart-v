import { Post, Image, Video } from "@prisma/client"

export interface MediaCenterContent {
  latestNews: Post | null
  pressReleases: Post | null
  featuredImage: (Image & {
    gallery: {
      title_en: string
      title_ar: string
    }
  }) | null
  featuredVideo: (Video & {
    gallery: {
      title_en: string
      title_ar: string
    }
  }) | null
}
