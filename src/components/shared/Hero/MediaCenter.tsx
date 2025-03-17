"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { BentoGrid, BentoGridItem } from "../../ui/bento-grid"
import { Copy, File, Video, Camera } from "lucide-react"
import AnimatedNetworkBackground from "../Nav/AnimatedBackground"
import { useLanguage } from "@/context/LanguageContext"
import type { MediaCenterContent } from "@/types/media-center"

interface MediaCenterProps {
  content: MediaCenterContent | null
}

export function MediaCenter({ content }: MediaCenterProps) {
  const { currentLang } = useLanguage()
  const bgColor = "#1b316e" 
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const gradientStyle = {
    backgroundImage: `
      radial-gradient(circle at 50% -100px, ${bgColor}10, transparent 400px),
      radial-gradient(circle at 100% 50%, ${bgColor}05, transparent 400px),
      radial-gradient(circle at 0% 100%, ${bgColor}05, transparent 400px)
    `,
  }

  const defaultImage = "/card-front.jpg"

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const fallbackContent: MediaCenterContent = {
    latestNews: {
      title_en: "Latest News & Updates",
      title_ar: "آخر الأخبار والتحديثات",
      imageUrl: defaultImage,
      slug: ""
    } as any,
    pressReleases: {
      title_en: "Announcements",
      title_ar: "إعلانات الصحفية",
      imageUrl: defaultImage,
      slug: ""
    } as any,
    featuredImage: {
      url: defaultImage,
      title_en: "Featured Image",
      title_ar: "صورة مميزة",
      gallery: {
        title_en: "Photo Gallery",
        title_ar: "معرض الصور"
      }
    } as any,
    featuredVideo: {
      title_en: "Video Stories",
      title_ar: "قصص الفيديو",
      thumbnail: defaultImage
    } as any
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  
  const safeContent = content || fallbackContent
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getImageUrl = (obj: any, fallback = defaultImage): string => {
    if (!obj) return fallback
    return obj.url || obj.imageUrl || obj.thumbnail || fallback
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTitle = (obj: any, lang: string, fallback: string): string => {
    if (!obj) return fallback
    return lang === "ar" ? (obj.title_ar || fallback) : (obj.title_en || fallback)
  }

  const items = [
    {
      title: currentLang === "ar" ? "آخر الأخبار والتحديثات" : "Latest News & Updates",
      description: getTitle(safeContent.latestNews, currentLang, 
        currentLang === "ar" ? "استكشف إنجازاتنا وإعلاناتنا الأخيرة." : "Explore our recent achievements."),
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
          <Image
            src={getImageUrl(safeContent.latestNews)}
            alt={getTitle(safeContent.latestNews, currentLang, 
              currentLang === "ar" ? "صورة افتراضية" : "Default image")}
            width={600}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = defaultImage
            }}
          />
        </div>
      ),
      className: "md:col-span-2",
      icon: <Copy />,
      link: safeContent.latestNews?.slug 
        ? `/${currentLang}/media-center/news/press-releases/${safeContent.latestNews.slug}` 
        : `/${currentLang}/media-center/news/press-releases`,
    },
    {
      title: currentLang === "ar" ? "إعلانات الصحفية" : "Announcements",
      description: currentLang === "ar" 
        ? content?.pressReleases?.title_ar || "الإعلانات الرسمية والتغطية الصحفية."
        : content?.pressReleases?.title_en || "Official announcements and press coverage.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
          <Image
            src={content?.pressReleases?.imageUrl || defaultImage}
            alt={currentLang === "ar" 
              ? content?.pressReleases?.title_ar || "صورة افتراضية"
              : content?.pressReleases?.title_en || "Default image"}
            width={300}
            height={300}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ),
      className: "md:col-span-1",
      icon: <File />,
      link: content?.pressReleases ? `/${currentLang}/media-center/news/announcement/${content.pressReleases.slug}` : `/${currentLang}/media-center/news/announcement`,
    },
    {
      title: currentLang === "ar" ? "معرض الصور" : "Photo Gallery",
      description: currentLang === "ar"
        ? content?.featuredImage?.gallery.title_ar || "رحلة بصرية عبر أحداثنا."
        : content?.featuredImage?.gallery.title_en || "Visual journey through our events.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
          <Image
            src={content?.featuredImage?.url || defaultImage}
            alt={currentLang === "ar" 
              ? content?.featuredImage?.title_ar || "صورة افتراضية"
              : content?.featuredImage?.title_en || "Default image"}
            width={300}
            height={300}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ),
      className: "md:col-span-1",
      icon: <Camera />,
      link: `/${currentLang}/media-center/gallery/photos`,
    },
    {
      title: currentLang === "ar" ? "قصص الفيديو" : "Video Stories",
      description: currentLang === "ar"
        ? content?.featuredVideo?.title_ar || "شاهد تأثيرنا من خلال الفيديو."
        : content?.featuredVideo?.title_en || "Watch our impact through video.",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl overflow-hidden">
          <Image
            src={content?.featuredVideo?.thumbnail || defaultImage}
            alt={currentLang === "ar" 
              ? content?.featuredVideo?.title_ar || "صورة افتراضية"
              : content?.featuredVideo?.title_en || "Default image"}
            width={600}
            height={300}
            className="w-full h-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ),
      className: "md:col-span-2",
      icon: <Video />,
      link: `/${currentLang}/media-center/gallery/videos`,
    },
  ]

  if (!isLoaded) {
    return <div className="min-h-screen bg-gray-50"></div>
  }

  return (
    <motion.section
      className="relative min-h-screen py-24 px-6 overflow-hidden"
      aria-labelledby="media-center-title"
      animate={{
        backgroundColor: `${bgColor}05`,
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
      style={gradientStyle}
    >
      <AnimatedNetworkBackground color={bgColor} />

      <div className="relative text-center space-y-3 mb-16">
        <h2
          id="media-center-title"
          className="text-4xl md:text-5xl p-4 font-bold tracking-tight bg-gradient-to-r from-[#1b316e] to-[#862996] bg-clip-text text-transparent animate-fade-up"
        >
          {currentLang === "ar" ? "المركز الإعلامي" : "Media Center"}
        </h2>
        <div className="w-32 h-1.5 bg-gradient-to-r from-[#1b316e] to-[#862996] mx-auto rounded-full animate-fade-up animation-delay-150" />
        <p className="mt-4 text-lg md:text-xl leading-8 text-[#1b316e] max-w-2xl mx-auto animate-fade-up animation-delay-200">
          {currentLang === "ar"
            ? "ابق على اطلاع بآخر أخبارنا وفعالياتنا وقصص النجاح من خلال معرض الوسائط لدينا"
            : "Stay updated with our latest news, events, and success stories through our media gallery"}
        </p>
      </div>

      <BentoGrid className="relative max-w-4xl mx-auto md:auto-rows-[20rem] gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg">
        {items.map((item, i) => (
          <Link 
            key={i} 
            href={item.link}
            className={`${item.className} block group hover:-translate-y-1 transition-all duration-300`}
          >
            <BentoGridItem
              title={item.title}
              description={item.description}
              header={item.header}
              className="h-full hover:shadow-xl bg-white/90 backdrop-blur-sm relative"
              icon={item.icon}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#1b316e] to-[#862996] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
            </BentoGridItem>
          </Link>
        ))}
      </BentoGrid>
    </motion.section>
  )
}

