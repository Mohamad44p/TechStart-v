import { ContentGrid } from "@/components/News-blog/content-grid"
import { getPostsByType } from "@/app/actions/fetch-posts"
import { PostType, PostTypeValue } from "@/lib/schema/schema"
import { ContentItem, Tag } from "@/types/blog"
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

interface AnnouncementsPageProps {
  params: {
    lang: string
  }
}

export async function generateMetadata({ params }: AnnouncementsPageProps): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'ar' ? 'الإعلانات - تيك ستارت' : 'Announcements - TechStart',
    description: lang === 'ar' 
      ? 'اطلع على آخر الإعلانات والتحديثات المهمة من تيك ستارت. ابق على اطلاع بأحدث الأخبار والفعاليات.'
      : 'Stay updated with the latest announcements and important updates from TechStart. Keep informed about our latest news and events.',
  }
}

export default async function AnnouncementsPage({ params }: AnnouncementsPageProps) {
  const {
    lang
  } = params;

  const { data: announcements = [], error } = await getPostsByType(PostType.ANNOUNCEMENT)

  if (error) {
    return <div className="container mx-auto py-12 px-4">
      <SeoMetadata 
        path="/media-center/news/announcements" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'الإعلانات - تيك ستارت' : 'Announcements - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'اطلع على آخر الإعلانات والتحديثات المهمة من تيك ستارت. ابق على اطلاع بأحدث الأخبار والفعاليات.'
          : 'Stay updated with the latest announcements and important updates from TechStart. Keep informed about our latest news and events.'
        }
      />
      <div className="text-center text-gray-600">
        {lang === 'ar' 
          ? 'عذراً، حدث خطأ أثناء تحميل الإعلانات'
          : 'Sorry, there was an error loading the announcements'}
      </div>
    </div>
  }

  const title = lang === 'ar' ? 'الإعلانات' : 'Announcements'
  const subtitle = lang === 'ar' 
    ? 'اطلع على آخر الإعلانات والتحديثات المهمة'
    : 'Stay updated with our latest announcements and important updates'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformToContentItem = (post: any): ContentItem => ({
    id: post.id,
    type: post.type as PostTypeValue,
    title_en: post.title_en,
    title_ar: post.title_ar,
    description_en: post.description_en,
    description_ar: post.description_ar,
    imageUrl: post.imageUrl,
    pdfUrl: post.pdfUrl,
    readTime: post.readTime,
    createdAt: post.createdAt,
    slug: post.slug,
    isPdf: false,
    tags: post.tags.map((tag: Tag) => ({
      id: tag.id,
      name_en: tag.name_en,
      name_ar: tag.name_ar,
      slug: tag.slug
    }))
  });

  const transformedAnnouncements = announcements.map(transformToContentItem);

  return (
    <div className="bg-white dark:bg-gray-900">
      <SeoMetadata 
        path="/media-center/news/announcements" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'الإعلانات - تيك ستارت' : 'Announcements - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'اطلع على آخر الإعلانات والتحديثات المهمة من تيك ستارت. ابق على اطلاع بأحدث الأخبار والفعاليات.'
          : 'Stay updated with the latest announcements and important updates from TechStart. Keep informed about our latest news and events.'
        }
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <ContentGrid 
          title={title}
          subtitle={subtitle}
          items={transformedAnnouncements}
        />
      </div>
    </div>
  );
}
