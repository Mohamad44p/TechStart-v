import { getGalleries } from "@/app/actions/create-gallery"
import { PhotoGalleryClient } from "@/components/Gallery/imagesGallery"
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

interface GalleryPageProps {
  params: {
    lang: string
  }
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'ar' ? 'معرض الصور - تيك ستارت' : 'Photo Gallery - TechStart',
    description: lang === 'ar' 
      ? 'استكشف معرض صور تيك ستارت. شاهد لحظات من فعالياتنا وبرامجنا ومبادراتنا المختلفة.'
      : 'Explore TechStart photo gallery. View moments from our events, programs, and various initiatives.',
  }
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const {
    lang
  } = params;

  const { data: galleries, error } = await getGalleries()

  if (error) {
    console.error("Failed to fetch galleries:", error)
    return (
      <div>
        <SeoMetadata 
          path="/media-center/gallery/photos" 
          lang={lang} 
          defaultTitle={lang === 'ar' ? 'معرض الصور - تيك ستارت' : 'Photo Gallery - TechStart'}
          defaultDescription={lang === 'ar' 
            ? 'استكشف معرض صور تيك ستارت. شاهد لحظات من فعالياتنا وبرامجنا ومبادراتنا المختلفة.'
            : 'Explore TechStart photo gallery. View moments from our events, programs, and various initiatives.'
          }
        />
        Error loading galleries
      </div>
    )
  }

  return (
    <>
      <SeoMetadata 
        path="/media-center/gallery/photos" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'معرض الصور - تيك ستارت' : 'Photo Gallery - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'استكشف معرض صور تيك ستارت. شاهد لحظات من فعالياتنا وبرامجنا ومبادراتنا المختلفة.'
          : 'Explore TechStart photo gallery. View moments from our events, programs, and various initiatives.'
        }
      />
      <PhotoGalleryClient galleries={galleries || []} lang={lang} />
    </>
  )
}

