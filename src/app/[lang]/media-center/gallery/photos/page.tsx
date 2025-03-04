import { getGalleries } from "@/app/actions/create-gallery"
import { PhotoGalleryClient } from "@/components/Gallery/imagesGallery"

export const dynamic = "force-dynamic"

interface GalleryPageProps {
  params: Promise<{
    lang: string
  }>
}

export default async function GalleryPage(props: GalleryPageProps) {
  const params = await props.params;

  const {
    lang
  } = params;

  const { data: galleries, error } = await getGalleries()

  if (error) {
    console.error("Failed to fetch galleries:", error)
    return <div>Error loading galleries</div>
  }

  return <PhotoGalleryClient galleries={galleries || []} lang={lang} />
}

