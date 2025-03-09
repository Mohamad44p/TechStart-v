import { VideoGallery } from "@/components/Gallery/video-gallery";
import { getVideoGalleries } from "@/app/actions/videoAction";
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

export const dynamic = "force-dynamic"

interface VideoGalleryPageProps {
  params: {
    lang: string
  }
}

export async function generateMetadata({ params }: VideoGalleryPageProps): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'ar' ? 'معرض الفيديو - تيك ستارت' : 'Video Gallery - TechStart',
    description: lang === 'ar' 
      ? 'استكشف معرض فيديوهات تيك ستارت. شاهد مقاطع فيديو من فعالياتنا وبرامجنا ومبادراتنا المختلفة.'
      : 'Explore TechStart video gallery. Watch videos from our events, programs, and various initiatives.',
  }
}

export default async function VideoGalleryPage({ params }: VideoGalleryPageProps) {
  const {
    lang
  } = params;

  const galleries = await getVideoGalleries();
  
  return (
    <>
      <SeoMetadata 
        path="/media-center/gallery/videos" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'معرض الفيديو - تيك ستارت' : 'Video Gallery - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'استكشف معرض فيديوهات تيك ستارت. شاهد مقاطع فيديو من فعالياتنا وبرامجنا ومبادراتنا المختلفة.'
          : 'Explore TechStart video gallery. Watch videos from our events, programs, and various initiatives.'
        }
      />
      <VideoGallery galleries={galleries} lang={lang} />
    </>
  );
}

