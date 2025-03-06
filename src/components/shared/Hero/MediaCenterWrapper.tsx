import { getMediaCenterContent } from "@/app/actions/media-center-actions"
import { MediaCenter } from "./MediaCenter"
import { cache } from "react"

// Cache the media center content fetch to prevent multiple requests
const getMediaCenterContentCached = cache(async () => {
  try {
    // Try up to 3 times with exponential backoff
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await getMediaCenterContent()
        return response
      } catch (error) {
        // Wait longer between each retry
        if (attempt < 2) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
        } else {
          throw error
        }
      }
    }
  } catch (error) {
    console.error("Failed to fetch media center content after retries:", error)
    return { success: false, error: "Failed to fetch after multiple attempts", data: null }
  }
})

export default async function MediaCenterWrapper() {
  const response = await getMediaCenterContentCached()

  // Provide fallback content in case of failure
  const fallbackContent = {
    latestNews: {
      title_en: "Latest News & Updates",
      title_ar: "آخر الأخبار والتحديثات",
      imageUrl: "/card-front.jpg",
      slug: ""
    },
    pressReleases: {
      title_en: "Press Releases",
      title_ar: "البيانات الصحفية",
      imageUrl: "/card-front.jpg",
      slug: ""
    },
    featuredImage: {
      url: "/card-front.jpg",
      title_en: "Featured Image",
      title_ar: "صورة مميزة",
      gallery: {
        title_en: "Photo Gallery",
        title_ar: "معرض الصور"
      }
    },
    featuredVideo: {
      title_en: "Video Stories",
      title_ar: "قصص الفيديو",
      thumbnail: "/card-front.jpg"
    }
  }

  if (!response.success || !response.data) {
    console.error("Failed to fetch media center content:", response.error)
    // Return the component with fallback content instead of null
    return <MediaCenter content={fallbackContent} />
  }

  return <MediaCenter content={response.data} />
}
