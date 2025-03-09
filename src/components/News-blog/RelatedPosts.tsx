"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types/blog";

interface RelatedPostsProps {
  posts: BlogPost[];
  lang: string;
}

export function RelatedPosts({ posts, lang }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`/${lang}/media-center/news/${post.type.toLowerCase()}/${post.slug}`}
                className="block group"
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={post.imageUrl || '/placeholder.jpg'}
                    alt={lang === 'ar' ? post.title_ar : post.title_en}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-primary">
                  {lang === 'ar' ? post.title_ar : post.title_en}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
