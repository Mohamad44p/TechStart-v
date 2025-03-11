/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentGrid } from "@/components/News-blog/content-grid"
import { FeaturedPosts } from "@/components/News-blog/FeaturedPosts"
import { getFeaturedPosts, getPostsByType } from "@/app/actions/fetch-posts"
import { PostType, PostTypeValue } from "@/lib/schema/schema"
import { ContentItem, BlogPost, Tag } from "@/types/blog"
import { SeoMetadata } from "@/components/shared/SeoMetadata"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

interface NewsPageProps {
  params: Promise<{
    lang: string
  }>
}

export async function generateMetadata(props: NewsPageProps): Promise<Metadata> {
  const params = await props.params;
  const { lang } = params;

  return {
    title: lang === 'ar' ? 'الأخبار والبيانات الصحفية - تيك ستارت' : 'News & Press Releases - TechStart',
    description: lang === 'ar' 
      ? 'ابق على اطلاع بآخر الأخبار والمنشورات والإعلانات لدينا. اكتشف أحدث التطورات والأحداث في تيك ستارت.'
      : 'Stay updated with our latest news, publications, and announcements. Discover the latest developments and events at TechStart.',
  }
}

export default async function NewsPage(props: NewsPageProps) {
  const params = await props.params;
  const {
    lang
  } = params;

  const [featuredResponse, postsResponse] = await Promise.all([
    getFeaturedPosts(),
    getPostsByType(PostType.NEWS)
  ]);

  const featuredPosts = featuredResponse.data || [];
  const allPosts = postsResponse.data || [];

  const title = lang === 'ar' 
    ? "الأخبار والبيانات الصحفية"
    : "News & Press Releases";

  const subtitle = lang === 'ar'
    ? "ابق على اطلاع بآخر الأخبار والمنشورات والإعلانات لدينا"
    : "Stay updated with our latest news, publications, and announcements";

  const transformToFeaturedPost = (post: any): BlogPost => ({
    id: post.id,
    type: post.type as PostTypeValue,
    title_en: post.title_en,
    title_ar: post.title_ar,
    description_en: post.description_en,
    description_ar: post.description_ar,
    content_en: post.content_en,
    content_ar: post.content_ar,
    imageUrl: post.imageUrl,
    pdfUrl: post.pdfUrl,
    readTime: post.readTime,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    published: post.published,
    featured: post.featured,
    slug: post.slug,
    isPdf: post.type === PostType.PUBLICATION,
    tags: post.tags.map((tag: Tag) => ({
      id: tag.id,
      name_en: tag.name_en,
      name_ar: tag.name_ar,
      slug: tag.slug
    }))
  });

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
    isPdf: post.type === PostType.PUBLICATION,
    tags: post.tags.map((tag: Tag) => ({
      id: tag.id,
      name_en: tag.name_en,
      name_ar: tag.name_ar,
      slug: tag.slug
    }))
  });

  const transformedFeaturedPosts = featuredPosts.map(transformToFeaturedPost);
  const transformedPosts = allPosts.map(transformToContentItem);

  return (
    <div className="bg-white dark:bg-gray-900">
      <SeoMetadata 
        path="/media-center/news" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'الأخبار والبيانات الصحفية - تيك ستارت' : 'News & Press Releases - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'ابق على اطلاع بآخر الأخبار والمنشورات والإعلانات لدينا. اكتشف أحدث التطورات والأحداث في تيك ستارت.'
          : 'Stay updated with our latest news, publications, and announcements. Discover the latest developments and events at TechStart.'
        }
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {featuredPosts.length > 0 && <FeaturedPosts posts={transformedFeaturedPosts} />}
        <ContentGrid
          title={title}
          subtitle={subtitle}
          items={transformedPosts}
        />
      </div>
    </div>
  );
}
