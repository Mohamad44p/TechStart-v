import { getPostBySlug, getRelatedPosts } from "@/app/actions/fetch-posts";
import {  toPostType } from "@/types/blog";
import { NewsHeader } from "@/components/News-blog/BlogHeader";
import { RelatedPosts } from "@/components/News-blog/RelatedPosts";
import { ShareButtons } from "@/components/News-blog/ShareButtons";
import { notFound } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { PostType } from "@/lib/schema/schema";
import { SeoMetadata } from "@/components/shared/SeoMetadata";
import { Metadata } from "next";

interface Props {
  params: Promise<{
    lang: string;
    type: string;
    slug: string;
  }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { lang, slug } = params;
  const { data: post } = await getPostBySlug(slug);

  if (!post) return {};

  return {
    title: lang === "ar" ? post.title_ar : post.title_en,
    description:
      lang === "ar" ? post.description_ar : post.description_en,
  };
}

export default async function PostPage(props: Props) {
  const params = await props.params;
  const { lang, type, slug } = params;

  const { data: post, error } = await getPostBySlug(slug);

  if (error || !post) {
    notFound();
  }

  // Update type validation to be case-insensitive
  if (post.type.toLowerCase() !== type.toLowerCase()) {
    notFound();
  }

  const postType = toPostType(post.type);
  const { data: relatedPosts = [] } = await getRelatedPosts(
    postType,
    post.slug
  );

  const getTypeTitle = (type: string) => {
    switch (type.toLowerCase()) {
      case PostType.NEWS.toLowerCase():
        return lang === "ar" ? "الأخبار" : "News";
      case PostType.PUBLICATION.toLowerCase():
        return lang === "ar" ? "المنشورات" : "Publications";
      case PostType.ANNOUNCEMENT.toLowerCase():
        return lang === "ar" ? "الإعلانات" : "Announcements";
      default:
        return "";
    }
  };

  return (
    <article className="min-h-screen pb-20">
      <SeoMetadata 
        path={`/media-center/news/${type}/${slug}`} 
        lang={lang} 
        defaultTitle={lang === "ar" ? post.title_ar : post.title_en}
        defaultDescription={lang === "ar" ? post.description_ar ?? "" : post.description_en ?? ""}
      />
      <NewsHeader
        title={lang === "ar" ? post.title_ar : post.title_en}
        description={lang === "ar" ? post.description_ar : post.description_en}
        image={post.imageUrl}
        date={post.createdAt}
        readTime={post.readTime}
        type={getTypeTitle(post.type)}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Back Button */}
          <div className="lg:col-span-12">
            <Link
              prefetch
              href={`/${lang}/media-center/news/${type}`}
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              {lang === "ar" ? (
                <>
                  عودة
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </>
              )}
            </Link>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: lang === "ar" ? post.content_ar ?? "" : post.content_en ?? "",
              }}
            />

            {post.tags.length > 0 && (
              <div className="pt-8">
                <Separator className="mb-8" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-4 py-2 bg-gray-100 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {lang === "ar" ? tag.name_ar : tag.name_en}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="space-y-8">
              <ShareButtons
                url={`/${lang}/media-center/news/${type}/${slug}`}
                title={lang === "ar" ? post.title_ar : post.title_en}
              />
            </div>
          </aside>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">
              {lang === "ar" ? "المنشورات ذات الصلة" : "Related Posts"}
            </h2>
            <RelatedPosts posts={relatedPosts} lang={lang} />
          </div>
        </div>
      )}
    </article>
  );
}
