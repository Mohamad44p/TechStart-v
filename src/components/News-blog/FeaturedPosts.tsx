"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import type { BlogPost } from "@/types/blog"

const FeaturedCard = ({ post, currentLang, formatDate }: { 
  post: BlogPost; 
  currentLang: string;
  formatDate: (date: Date) => string;
}) => {
  const cardContent = (
    <div className="w-full h-full">
      <div className="relative h-48 w-full">
        <Image
          src={post.imageUrl || '/placeholder.jpg'}
          alt={currentLang === 'ar' ? post.title_ar : post.title_en}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#862996] rounded-full">
            {post.type === 'blog' ? (currentLang === 'ar' ? 'الأخبار والبيانات الصحفية' : 'News & Press Releases') : post.type}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-2">
          {currentLang === 'ar' ? post.title_ar : post.title_en}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {currentLang === 'ar' ? post.description_ar : post.description_en}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar size={16} className="mr-2" />
          {formatDate(post.createdAt)}
          {post.readTime && (
            <>
              <span className="mx-2">•</span>
              {post.readTime}
            </>
          )}
        </div>
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag.slug}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {currentLang === 'ar' ? tag.name_ar : tag.name_en}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (post.isPdf && post.pdfUrl) {
    return (
      <div 
        className="cursor-pointer" 
        onClick={() => window.open(post.pdfUrl!, '_blank')}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/${currentLang}/media-center/news/${post.type}/${post.slug}`}>
      {cardContent}
    </Link>
  );
};

export function FeaturedPosts({ posts }: { posts: BlogPost[] }) {
  const { currentLang } = useLanguage()

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-[#1b316e] to-[#862996] bg-clip-text text-transparent">
          {currentLang === 'ar' ? 'الأخبار والبيانات الصحفية المميزة' : 'Featured News & Press Releases'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <FeaturedCard 
                post={post}
                currentLang={currentLang}
                formatDate={formatDate}
              />
              {post.isPdf && (
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">
                  PDF
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
