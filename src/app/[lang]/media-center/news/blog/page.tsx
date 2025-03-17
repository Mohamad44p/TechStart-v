import { ContentGrid } from "@/components/News-blog/content-grid"
import { FeaturedPosts } from "@/components/News-blog/FeaturedPosts"
import { getFeaturedPosts, getPostsByType } from "@/app/actions/fetch-posts"
import { PostType } from "@/lib/schema/schema";
import { PostTypeValue } from "@/lib/schema/schema";
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

interface NewsPageProps {
  params: {
    lang: string
  }
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { lang } = params;
  
  return {
    title: lang === 'ar' ? 'الأخبار والبيانات الصحفية - تيك ستارت' : 'News & Press Releases - TechStart',
    description: lang === 'ar' 
      ? 'استكشف الأخبار والبيانات الصحفية من تيك ستارت للحصول على رؤى وتحليلات ومقالات حول التكنولوجيا والابتكار والتنمية الرقمية.'
      : 'Explore TechStart News & Press Releases for insights, analysis, and articles about technology, innovation, and digital development.',
  }
}

export default async function NewsPage({ params }: NewsPageProps) {
  const {
    lang
  } = params;

  const [featuredResponse, postsResponse] = await Promise.all([
    getFeaturedPosts(),
    getPostsByType(PostType.NEWS)
  ])

  if (featuredResponse.error || postsResponse.error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <SeoMetadata 
          path="/media-center/news/blog" 
          lang={lang} 
          defaultTitle={lang === 'ar' ? 'الأخبار والبيانات الصحفية - تيك ستارت' : 'News & Press Releases - TechStart'}
          defaultDescription={lang === 'ar' 
            ? 'استكشف الأخبار والبيانات الصحفية من تيك ستارت للحصول على رؤى وتحليلات ومقالات حول التكنولوجيا والابتكار والتنمية الرقمية.'
            : 'Explore TechStart News & Press Releases for insights, analysis, and articles about technology, innovation, and digital development.'
          }
        />
        <div className="text-center text-gray-600">
          {lang === 'ar' 
            ? 'عذراً، حدث خطأ أثناء تحميل المنشورات'
            : 'Sorry, there was an error loading the posts'}
        </div>
      </div>
    )
  }

  const title = lang === 'ar' ? 'الأخبار والبيانات الصحفية' : 'News & Press Releases'
  const subtitle = lang === 'ar' 
    ? 'اكتشف أحدث الأخبار والبيانات الصحفية'
    : 'Discover our latest news and press releases'

  const transformedPosts = postsResponse.data?.map(post => ({
    ...post,
    type: post.type as PostTypeValue,
    imageUrl: post.imageUrl || ""
  })) || []

  return (
    <div className="bg-white dark:bg-gray-900">
      <SeoMetadata 
        path="/media-center/news/blog" 
        lang={lang} 
        defaultTitle={lang === 'ar' ? 'الأخبار والبيانات الصحفية - تيك ستارت' : 'News & Press Releases - TechStart'}
        defaultDescription={lang === 'ar' 
          ? 'استكشف الأخبار والبيانات الصحفية من تيك ستارت للحصول على رؤى وتحليلات ومقالات حول التكنولوجيا والابتكار والتنمية الرقمية.'
          : 'Explore TechStart News & Press Releases for insights, analysis, and articles about technology, innovation, and digital development.'
        }
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {featuredResponse.data && featuredResponse.data.length > 0 && (
          <FeaturedPosts posts={featuredResponse.data} />
        )}
        <ContentGrid 
          title={title}
          subtitle={subtitle}
          items={transformedPosts}
        />
      </div>
    </div>
  )
}
