"use server"

import db from "@/app/db/db"
import { cache } from "react"
import { PostType } from "@/lib/schema/schema"
import type { MediaCenterContent } from "@/types/media-center"

export const getMediaCenterContent = cache(async (): Promise<{ 
  success: boolean; 
  data: MediaCenterContent | null; 
  error?: string 
}> => {
  try {
    // Get latest featured blog posts and press releases
    const [blogPosts, announcements] = await Promise.all([
      db.post.findMany({
        where: { 
          type: PostType.NEWS,
          featured: true,
          published: true 
        },
        orderBy: { createdAt: 'desc' },
        take: 1
      }),

      db.post.findMany({
        where: { 
          type: PostType.ANNOUNCEMENT,
          featured: true,
          published: true 
        },
        orderBy: { createdAt: 'desc' },
        take: 1
      })
    ])

    // Get latest featured gallery image
    const featuredImage = await db.image.findFirst({
      where: { 
        featured: true,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        gallery: true
      }
    })

    // Get latest featured video
    const featuredVideo = await db.video.findFirst({
      where: { 
        type: 'youtube',
      },
      orderBy: { createdAt: 'desc' },
      include: {
        gallery: true
      }
    })

    return {
      success: true,
      data: {
        latestNews: blogPosts[0] || null,
        pressReleases: announcements[0] || null,
        featuredImage,
        featuredVideo
      }
    }
  } catch (error) {
    console.error("Failed to fetch media center content:", error)
    return { success: false, data: null, error: "Failed to fetch media center content" }
  }
})
