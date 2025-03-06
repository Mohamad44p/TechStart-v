import { ContentGrid } from "@/components/News-blog/content-grid"
import { getPostsByType } from "@/app/actions/fetch-posts"
import { PostType, PostTypeValue } from "@/lib/schema/schema"
import type { ContentItem, Tag } from "@/types/blog"

export const metadata = {
  title: 'Publications & Reports',
}

export default async function PublicationsPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const { data: publications = [], error } = await getPostsByType(PostType.PUBLICATION)

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-gray-600">
          {lang === 'ar' 
            ? 'عذراً، حدث خطأ أثناء تحميل المنشورات'
            : 'Sorry, there was an error loading the publications'}
        </div>
      </div>
    )
  }

  const title = lang === 'ar' ? 'المنشورات والتقارير' : 'Publications & Reports'
  const subtitle = lang === 'ar'
    ? 'استكشف أحدث المنشوراتا'
    : 'Explore our latest publications'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformToContentItem = (pub: any): ContentItem => ({
    id: pub.id,
    type: pub.type as PostTypeValue,
    title_en: pub.title_en,
    title_ar: pub.title_ar,
    description_en: pub.description_en,
    description_ar: pub.description_ar,
    imageUrl: pub.imageUrl,
    pdfUrl: pub.pdfUrl,
    readTime: pub.readTime,
    createdAt: pub.createdAt,
    slug: pub.slug,
    isPdf: true,
    tags: pub.tags.map((tag: Tag) => ({
      id: tag.id,
      name_en: tag.name_en,
      name_ar: tag.name_ar,
      slug: tag.slug
    }))
  });

  const transformedPublications = publications.map(transformToContentItem);

  return (
    <div className="py-12">
      <ContentGrid 
        title={title}
        subtitle={subtitle}
        items={transformedPublications}
      />
    </div>
  )
}

