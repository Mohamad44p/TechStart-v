import { ContentGrid } from "@/components/News-blog/content-grid"
import { getPostsByType } from "@/app/actions/fetch-posts"
import { PostType, PostTypeValue } from "@/lib/schema/schema"
import type { ContentItem } from "@/types/blog"

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

  const transformedPublications: ContentItem[] = publications.map(pub => ({
    ...pub,
    type: pub.type as PostTypeValue,
    isPdf: true,
    title: lang === 'ar' ? pub.title_ar : pub.title_en,
    description: lang === 'ar' ? pub.description_ar : pub.description_en,
    tags: pub.tags.map(tag => ({
      id: tag.id,
      name_en: tag.name_en,
      name_ar: tag.name_ar,
      slug: tag.slug,
      name: lang === 'ar' ? tag.name_ar : tag.name_en
    }))
  }));

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

