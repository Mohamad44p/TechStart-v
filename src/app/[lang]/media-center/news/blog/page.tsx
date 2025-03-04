import { ContentGrid } from "@/components/News-blog/content-grid"
import { FeaturedPosts } from "@/components/News-blog/FeaturedPosts"
import { getFeaturedPosts, getPostsByType } from "@/app/actions/fetch-posts"
import { PostType } from "@/lib/schema/schema";
import { PostTypeValue } from "@/lib/schema/schema";

export default async function BlogPage(props: { params: Promise<{ lang: string }> }) {
  const params = await props.params;

  const {
    lang
  } = params;

  const [featuredResponse, postsResponse] = await Promise.all([
    getFeaturedPosts(),
    getPostsByType(PostType.BLOG)
  ])

  if (featuredResponse.error || postsResponse.error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="text-center text-gray-600">
          {lang === 'ar' 
            ? 'عذراً، حدث خطأ أثناء تحميل المنشورات'
            : 'Sorry, there was an error loading the posts'}
        </div>
      </div>
    )
  }

  const title = lang === 'ar' ? 'المدونة' : 'Blog'
  const subtitle = lang === 'ar' 
    ? 'اكتشف أحدث المقالات والأخبار'
    : 'Discover our latest articles and news'

  const transformedPosts = postsResponse.data?.map(post => ({
    ...post,
    type: post.type as PostTypeValue,
    imageUrl: post.imageUrl || ""
  })) || []

  return (
    <>
      {featuredResponse.data && featuredResponse.data.length > 0 && (
        <FeaturedPosts posts={featuredResponse.data} />
      )}
      <ContentGrid 
        title={title}
        subtitle={subtitle}
        items={transformedPosts}
      />
    </>
  )
}
