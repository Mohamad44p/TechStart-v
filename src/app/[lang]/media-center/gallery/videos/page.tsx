import { VideoGallery } from "@/components/Gallery/video-gallery";
import { getVideoGalleries } from "@/app/actions/videoAction";

export const dynamic = "force-dynamic"

interface VideoGalleryPageProps {
  params: Promise<{
    lang: string
  }>
}

export default async function VideoGalleryPage(props: VideoGalleryPageProps) {
  const params = await props.params;

  const {
    lang
  } = params;

  const galleries = await getVideoGalleries();
  return <VideoGallery galleries={galleries} lang={lang} />;
}

