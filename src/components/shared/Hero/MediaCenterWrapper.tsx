import { getMediaCenterContent } from "@/app/actions/media-center-actions"
import { MediaCenter } from "./MediaCenter"

export default async function MediaCenterWrapper() {
  const response = await getMediaCenterContent()

  if (!response.success || !response.data) {
    console.error("Failed to fetch media center content:", response.error)
    return <MediaCenter content={null} />
  }

  return <MediaCenter content={response.data} />
}
