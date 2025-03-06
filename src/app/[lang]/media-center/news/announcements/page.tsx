import { ContentGrid } from "@/components/News-blog/content-grid"
import { getPostsByType } from "@/app/actions/fetch-posts"
import { PostType, PostTypeValue } from "@/lib/schema/schema"
import { ContentItem, Tag } from "@/types/blog"

export default async function AnnouncementsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const { data: announcements = [], error } = await getPostsByType(PostType.ANNOUNCEMENT)

  if (error) {
    return <div className="container mx-auto py-12 px-4">
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
    <div className="py-12">
      <ContentGrid 
        title={title}
        subtitle={subtitle}
        items={transformedAnnouncements}
      />
    </div>
  );
}
