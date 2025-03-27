/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, X, Calendar, Play, ArrowRight } from "lucide-react"
import { GalleryFilters } from "./GalleryFilters"
import { useLanguage } from "@/context/LanguageContext"
import type { Video, VideoGallery as VideoGalleryType } from "@/types/video-gallery"
import { getYoutubeVideoId } from "@/lib/utils";

interface VideoGalleryProps {
  galleries: VideoGalleryType[]
  lang: string
}

// Use smaller thumbnail size that's more reliable (works even with private/unlisted videos)
const YOUTUBE_THUMBNAIL_URL = (videoId: string) => `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;






export const VideoGallery = ({ galleries: initialGalleries }: VideoGalleryProps) => {
  const { currentLang } = useLanguage()
  const [filteredGalleries, setFilteredGalleries] = useState<VideoGalleryType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedGallery, setSelectedGallery] = useState<VideoGalleryType | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    setFilteredGalleries(initialGalleries)
  }, [initialGalleries])
  
  // Fixed date formatter to avoid hydration mismatches
  const formatDate = useCallback((dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (e) {
      console.error("Date formatting error:", e);
      return dateStr
    }
  }, [])

  const getLocalizedTitle = useCallback(
    (gallery: VideoGalleryType) => {
      return currentLang === "ar" ? gallery.title_ar : gallery.title_en
    },
    [currentLang],
  )

  const getLocalizedVideoTitle = useCallback(
    (video: Video) => {
      return currentLang === "ar" ? video.title_ar : video.title_en
    },
    [currentLang],
  )

  useEffect(() => {
    if (!mounted) return
    
    const filtered = initialGalleries.filter((gallery) => {
      const searchLower = searchTerm.toLowerCase()
      return currentLang === "ar"
        ? (gallery.title_ar || "").toLowerCase().includes(searchLower)
        : (gallery.title_en || "").toLowerCase().includes(searchLower)
    })
    
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
    
    setFilteredGalleries(sorted)
  }, [searchTerm, sortOrder, initialGalleries, currentLang, mounted])

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleSort = useCallback((order: "asc" | "desc") => {
    setSortOrder(order)
  }, [])

  const handleVideoClick = useCallback((gallery: VideoGalleryType, index: number) => {
    const video = gallery.videos[index];
    
    // For YouTube videos, open in a popup window in the same page
    if (video.type === "youtube") {
      const videoId = getYoutubeVideoId(video.url);
      const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      const width = Math.min(800, window.innerWidth * 0.8);
      const height = width * 0.5625; // 16:9 aspect ratio
      const left = (window.innerWidth - width) / 2;
      const top = (window.innerHeight - height) / 2;
      
      window.open(
        youtubeUrl, 
        "YouTubePopup", 
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=no,status=no,location=no,menubar=no,toolbar=no`
      );
    } else {
      // For local videos, use the modal
      setSelectedGallery(gallery);
      setCurrentVideoIndex(index);
    }
  }, [])

  const nextVideo = useCallback(() => {
    if (selectedGallery) {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % selectedGallery.videos.length)
    }
  }, [selectedGallery])

  const prevVideo = useCallback(() => {
    if (selectedGallery) {
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex - 1 + selectedGallery.videos.length) % selectedGallery.videos.length,
      )
    }
  }, [selectedGallery])

  // If not mounted yet (server-side), render a skeleton
  if (!mounted) {
    return (
      <div suppressHydrationWarning className="min-h-screen bg-gray-100">
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="h-12 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-gray-100")}>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <GalleryFilters
          onSearch={handleSearch}
          onSort={handleSort}
          title={currentLang === "ar" ? "معرض فيديو تك ستارت" : "TechStart Video Gallery"}
        />
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGalleries.map((gallery) => {
            // Find featured video or use the first one
            const featuredVideo = gallery.videos.find((video) => video.featured) || gallery.videos[0];
            if (!featuredVideo) return null;
            
            const thumbnailUrl = featuredVideo.type === "youtube" 
              ? YOUTUBE_THUMBNAIL_URL(getYoutubeVideoId(featuredVideo.url))
              : featuredVideo.thumbnail || "/placeholder.jpg";
            
            return (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <button 
                  className="relative aspect-video w-full block cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onClick={() => handleVideoClick(gallery, gallery.videos.indexOf(featuredVideo))}
                  aria-label={`View ${getLocalizedTitle(gallery)} gallery`}
                  type="button"
                >
                  <img
                    src={thumbnailUrl}
                    alt={`${getLocalizedTitle(gallery)}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="absolute center inset-0 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl font-bold mb-1">{getLocalizedTitle(gallery)}</h2>
                    <p className="text-sm flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(gallery.createdAt.toString())}
                    </p>
                  </div>
                </button>
                
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-600">{gallery.videos.length} videos</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-purple-700 p-0 h-auto font-medium flex items-center gap-1"
                      onClick={() => handleVideoClick(gallery, gallery.videos.indexOf(featuredVideo))}
                      type="button"
                    >
                      View Gallery
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-[200]"
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-[210]"
                onClick={() => setSelectedGallery(null)}
                type="button"
              >
                <X size={24} />
              </Button>
              
              <div className="relative w-full max-w-4xl aspect-video">
                <div className="w-full h-full">
                  {selectedGallery.videos[currentVideoIndex]?.type === "youtube" ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${getYoutubeVideoId(selectedGallery.videos[currentVideoIndex]?.url)}`}
                      className="absolute top-0 left-0 w-full h-full object-contain rounded-lg"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      title={getLocalizedVideoTitle(selectedGallery.videos[currentVideoIndex])}
                    />
                  ) : (
                    <video
                      src={selectedGallery.videos[currentVideoIndex]?.url}
                      className="absolute top-0 left-0 w-full h-full object-contain rounded-lg"
                      controls
                      autoPlay
                      playsInline
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-4 text-white text-center">
                <h2 className="text-2xl font-bold mb-2">
                  {getLocalizedVideoTitle(selectedGallery.videos[currentVideoIndex])}
                </h2>
                <p className="text-lg mb-2">{getLocalizedTitle(selectedGallery)}</p>
                <p className="text-sm flex items-center justify-center">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(selectedGallery.createdAt.toString())}
                </p>
              </div>
              
              {/* Navigation buttons */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-[210]">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/20" 
                  onClick={prevVideo}
                  aria-label="Previous video"
                  type="button"
                >
                  <ChevronLeft size={36} />
                </Button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-[210]">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-white/20" 
                  onClick={nextVideo}
                  aria-label="Next video"
                  type="button"
                >
                  <ChevronRight size={36} />
                </Button>
              </div>
              
              {/* Thumbnails */}
              <div className="absolute bottom-8 left-0 right-0 px-4 overflow-x-auto z-[210]">
                <div className="flex space-x-2 justify-center">
                  {selectedGallery.videos.map((video, index) => (
                    <button 
                      key={video.id || index} 
                      className={`relative flex-shrink-0 w-20 h-12 md:w-28 md:h-16 
                        ${index === currentVideoIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-100'}`}
                      onClick={() => {
                        if (video.type === "youtube") {
                          const videoId = getYoutubeVideoId(video.url);
                          const youtubeUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                          const width = Math.min(800, window.innerWidth * 0.8);
                          const height = width * 0.5625; // 16:9 aspect ratio
                          const left = (window.innerWidth - width) / 2;
                          const top = (window.innerHeight - height) / 2;
                          
                          window.open(
                            youtubeUrl, 
                            "YouTubePopup", 
                            `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=no,status=no,location=no,menubar=no,toolbar=no`
                          );
                        } else {
                          setCurrentVideoIndex(index);
                        }
                      }}
                      aria-label={`View video ${index + 1}`}
                      type="button"
                    >
                      <img
                        src={video.type === "youtube" 
                          ? YOUTUBE_THUMBNAIL_URL(getYoutubeVideoId(video.url))
                          : video.thumbnail || "/placeholder.jpg"}
                        alt={getLocalizedVideoTitle(video) || `Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}