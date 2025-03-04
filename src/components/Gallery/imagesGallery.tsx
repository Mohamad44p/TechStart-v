"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GalleryFilters } from "./GalleryFilters"
import { ChevronLeft, ChevronRight, X, Calendar, ArrowRight } from "lucide-react"
import type { Gallery, Image as GalleryImage } from "@prisma/client"
import { useLanguage } from "@/context/LanguageContext"

interface PhotoGalleryClientProps {
  galleries: (Gallery & { images: GalleryImage[] })[]
  lang: string
}

export const PhotoGalleryClient = ({ galleries: initialGalleries }: PhotoGalleryClientProps) => {
  const { currentLang } = useLanguage()
  const [filteredGalleries, setFilteredGalleries] = useState(initialGalleries)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedGallery, setSelectedGallery] = useState<(Gallery & { images: GalleryImage[] }) | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getLocalizedTitle = useCallback((gallery: Gallery) => {
    return currentLang === 'ar' ? gallery.title_ar : gallery.title_en
  }, [currentLang])

  const getLocalizedImageTitle = useCallback((image: GalleryImage) => {
    return currentLang === 'ar' ? image.title_ar : image.title_en
  }, [currentLang])

  useEffect(() => {
    const filtered = initialGalleries.filter((gallery) => {
      const searchLower = searchTerm.toLowerCase()
      return currentLang === 'ar'
        ? gallery.title_ar.toLowerCase().includes(searchLower)
        : gallery.title_en.toLowerCase().includes(searchLower)
    })
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })
    setFilteredGalleries(sorted)
  }, [searchTerm, sortOrder, initialGalleries, currentLang])

  const nextImage = () => {
    if (selectedGallery) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedGallery.images.length)
    }
  }

  const prevImage = () => {
    if (selectedGallery) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex - 1 + selectedGallery.images.length) % selectedGallery.images.length,
      )
    }
  }

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  const handleSort = useCallback((order: "asc" | "desc") => {
    setSortOrder(order)
  }, [])

  return (
    <div className={cn("min-h-screen bg-gray-100")}>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <GalleryFilters 
          onSearch={handleSearch} 
          onSort={handleSort} 
          title={currentLang === 'ar' ? "معرض صور تك ستارت" : "TechStart Image Gallery"} 
        />
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGalleries.map((gallery) => {
            const featuredImage = gallery.images.find((img) => img.featured) || gallery.images[0]
            return (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative aspect-video">
                  <Image
                    src={featuredImage?.url || "/placeholder.svg"}
                    alt={`${getLocalizedTitle(gallery)} - ${getLocalizedImageTitle(featuredImage)}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl font-bold mb-1">{getLocalizedTitle(gallery)}</h2>
                    <p className="text-sm flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(gallery.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600 mb-4">{getLocalizedImageTitle(featuredImage)}</p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedGallery(gallery)
                      setCurrentImageIndex(0)
                    }}
                  >
                    {currentLang === 'ar' ? "عرض المعرض" : "View Gallery"}
                    <ArrowRight size={16} className={currentLang === 'ar' ? "mr-2" : "ml-2"} />
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>

      <AnimatePresence>
        {selectedGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[200]"
          >
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 z-[210] right-4 text-white"
                onClick={() => setSelectedGallery(null)}
              >
                <X size={24} />
              </Button>
              <div className="relative w-full max-w-4xl aspect-video">
                <Image
                  src={selectedGallery.images[currentImageIndex].url || "/placeholder.svg"}
                  alt={`${selectedGallery.title_en} - ${selectedGallery.images[currentImageIndex].title_en || ""}`}
                  fill
                  sizes="100vw"
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
              <div className="mt-4 text-white text-center">
                <h2 className="text-2xl font-bold mb-2">
                  {getLocalizedImageTitle(selectedGallery.images[currentImageIndex])}
                </h2>
                <p className="text-lg mb-2">{getLocalizedTitle(selectedGallery)}</p>
                <p className="text-sm flex items-center justify-center">
                  <Calendar size={14} className="mr-1" />
                  {formatDate(selectedGallery.createdAt)}
                </p>
              </div>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Button variant="ghost" size="icon" className="text-white" onClick={prevImage}>
                  <ChevronLeft size={36} />
                </Button>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Button variant="ghost" size="icon" className="text-white" onClick={nextImage}>
                  <ChevronRight size={36} />
                </Button>
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  {selectedGallery.images.map((_, index) => (
                    <button
                      key={index}
                      aria-label={`Go to image ${index + 1}`}
                      className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-gray-500"}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

