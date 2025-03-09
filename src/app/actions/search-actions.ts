"use server"

import db from "@/app/db/db"
import { cache } from "react"

export type SearchResult = {
  id: string
  title: string
  description: string
  type: 'program' | 'blog' | 'gallery' | 'video'
  imageUrl: string | null
  url: string
}

export type SearchResponse = {
  success: boolean
  results: SearchResult[]
  error?: string
}

export const searchContent = cache(async (query: string, lang: string = 'en'): Promise<SearchResponse> => {
  if (!query || query.trim().length < 2) {
    return { success: true, results: [] }
  }

  try {
    const normalizedQuery = query.trim().toLowerCase()
    
    // Search programs
    const programs = await db.programsPages.findMany({
      where: {
        OR: [
          { name_en: { contains: normalizedQuery, mode: 'insensitive' } },
          { name_ar: { contains: normalizedQuery, mode: 'insensitive' } },
        ]
      },
      include: {
        ProgramsHero: {
          take: 1,
        },
        ProgramTab: {
          take: 1,
        }
      }
    })

    // Search blog posts
    const blogPosts = await db.post.findMany({
      where: {
        OR: [
          { title_en: { contains: normalizedQuery, mode: 'insensitive' } },
          { title_ar: { contains: normalizedQuery, mode: 'insensitive' } },
          { description_en: { contains: normalizedQuery, mode: 'insensitive' } },
          { description_ar: { contains: normalizedQuery, mode: 'insensitive' } },
          { content_en: { contains: normalizedQuery, mode: 'insensitive' } },
          { content_ar: { contains: normalizedQuery, mode: 'insensitive' } },
        ]
      }
    })

    // Search galleries
    const galleries = await db.gallery.findMany({
      where: {
        OR: [
          { title_en: { contains: normalizedQuery, mode: 'insensitive' } },
          { title_ar: { contains: normalizedQuery, mode: 'insensitive' } },
        ]
      },
      include: {
        images: {
          where: {
            featured: true
          },
          take: 1
        }
      }
    })

    // Search videos (assuming videos are stored as posts with a specific type)
    const videos = await db.post.findMany({
      where: {
        type: 'VIDEO',
        OR: [
          { title_en: { contains: normalizedQuery, mode: 'insensitive' } },
          { title_ar: { contains: normalizedQuery, mode: 'insensitive' } },
          { description_en: { contains: normalizedQuery, mode: 'insensitive' } },
          { description_ar: { contains: normalizedQuery, mode: 'insensitive' } },
        ]
      }
    })

    // Format results
    const programResults: SearchResult[] = programs.map(program => ({
      id: program.id,
      title: lang === 'ar' ? program.name_ar : program.name_en,
      description: lang === 'ar' 
        ? (program.ProgramsHero?.[0]?.description_ar || '') 
        : (program.ProgramsHero?.[0]?.description_en || ''),
      type: 'program',
      imageUrl: program.ProgramsHero?.[0]?.imageUrl || null,
      url: `/${lang}/programs/${program.id}`
    }))

    const blogResults: SearchResult[] = blogPosts.map(post => ({
      id: post.id,
      title: lang === 'ar' ? post.title_ar : post.title_en,
      description: lang === 'ar' ? post.description_ar : post.description_en,
      type: 'blog',
      imageUrl: post.imageUrl,
      url: `/${lang}/blog/${post.slug}`
    }))

    const galleryResults: SearchResult[] = galleries.map(gallery => ({
      id: gallery.id,
      title: lang === 'ar' ? gallery.title_ar : gallery.title_en,
      description: '',
      type: 'gallery',
      imageUrl: gallery.images[0]?.url || null,
      url: `/${lang}/media-center/gallery/photos`
    }))

    const videoResults: SearchResult[] = videos.map(video => ({
      id: video.id,
      title: lang === 'ar' ? video.title_ar : video.title_en,
      description: lang === 'ar' ? video.description_ar : video.description_en,
      type: 'video',
      imageUrl: video.imageUrl,
      url: `/${lang}/media-center/gallery/videos`
    }))

    // Combine and sort results
    const allResults = [
      ...programResults,
      ...blogResults,
      ...galleryResults,
      ...videoResults
    ]

    return {
      success: true,
      results: allResults
    }
  } catch (error) {
    console.error("Search error:", error)
    return {
      success: false,
      results: [],
      error: "Failed to perform search"
    }
  }
}) 