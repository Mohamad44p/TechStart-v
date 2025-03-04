import { getHomeBanner } from "@/app/actions/homeBannerActions"
import HomeBanner from "./HomeBanner"

export default async function HomeBannerWrapper() {
  const response = await getHomeBanner()

  if (!response.success || !response.data) {
    console.error("Failed to fetch home banner:", response.error)
    return null
  }

  return <HomeBanner banner={response.data} />
}
