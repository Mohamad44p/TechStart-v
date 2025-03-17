/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Loader2, Upload, X, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import type { VideoUpload } from "@/types/video-gallery"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { AdminVideoControls } from "@/components/ui/admin-video-controls"
import { del } from "@vercel/blob"

interface MultiVideoUploadProps {
  onUpload: (videos: VideoUpload[]) => void
  defaultVideos?: VideoUpload[]
}

export function MultiVideoUpload({ onUpload, defaultVideos = [] }: MultiVideoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [videos, setVideos] = useState<VideoUpload[]>(defaultVideos)
  const [youtubeLink, setYoutubeLink] = useState("")
  const [featuredVideoIndex, setFeaturedVideoIndex] = useState<number>(() => {
    return defaultVideos.findIndex((v) => v.featured) || 0
  })
  const { toast } = useToast()
  const [playingStates, setPlayingStates] = useState<boolean[]>(new Array(videos.length).fill(false))
  const [playingYoutubeStates, setPlayingYoutubeStates] = useState<boolean[]>(new Array(videos.length).fill(false))

  useEffect(() => {
    setPlayingStates(new Array(videos.length).fill(false))
    setPlayingYoutubeStates(new Array(videos.length).fill(false))
  }, [videos])

  const handleInputChange = (index: number, field: "title" | "description", value: string, lang: "en" | "ar") => {
    const fieldKey = `${field}_${lang}` as keyof VideoUpload
    const updatedVideos = videos.map((video, i) => (i === index ? { ...video, [fieldKey]: value } : video))
    setVideos(updatedVideos)
    onUpload(updatedVideos)
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true)
      const newVideos: VideoUpload[] = []

      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append("file", file)

        try {
          const response = await fetch("/api/upload-video", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) throw new Error("Upload failed")

          const data = await response.json()
          if (data.success && data.url) {
            const videoData: VideoUpload = {
              url: data.url,
              title_en: file.name.replace(/\.[^/.]+$/, ""),
              title_ar: "",
              description_en: null,
              description_ar: null,
              type: "blob",
              featured: videos.length === 0 && newVideos.length === 0,
              thumbnail: null,
            }
            newVideos.push(videoData)
          }
        } catch (error) {
          console.error("Upload error:", error)
          toast({
            title: "Error",
            description: error instanceof Error ? error.message : "Failed to upload video",
            variant: "destructive",
          })
        }
      }

      const updatedVideos = [...videos, ...newVideos]
      setVideos(updatedVideos)
      onUpload(updatedVideos)
      setUploading(false)
    },
    [videos, onUpload, toast],
  )

  const handleYoutubeUpload = () => {
    if (youtubeLink) {
      const videoId = getYoutubeVideoId(youtubeLink)
      if (!videoId) {
        toast({
          title: "Error",
          description: "Invalid YouTube URL",
          variant: "destructive",
        })
        return
      }

      const embedUrl = `https://www.youtube.com/embed/${videoId}`
      const youtubeVideo: VideoUpload = {
        url: embedUrl,
        title_en: "YouTube Video",
        title_ar: "",
        description_en: null,
        description_ar: null,
        type: "youtube",
        featured: videos.length === 0, // Make it featured if it's the first video
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      }

      const updatedVideos = [...videos, youtubeVideo]
      setVideos(updatedVideos)
      onUpload(updatedVideos)
      setYoutubeLink("")
    }
  }

  const handleRemove = async (index: number) => {
    const videoToRemove = videos[index]
    if (videoToRemove.type === "blob") {
      try {
        await del(videoToRemove.url)
        const newVideos = videos.filter((_, i) => i !== index)
        setVideos(newVideos)
        onUpload(newVideos)

        toast({
          title: "Success",
          description: "Video deleted successfully",
        })
      } catch (error) {
        console.error("Delete error:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete video",
          variant: "destructive",
        })
      }
    } else {
      // For YouTube videos, just remove from the list
      const newVideos = videos.filter((_, i) => i !== index)
      setVideos(newVideos)
      onUpload(newVideos)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".webm", ".ogg"],
    },
    multiple: true,
  })

  const handleFeaturedChange = (index: number) => {
    const updatedVideos = videos.map((v, i) => ({
      ...v,
      featured: i === index,
    }))
    setFeaturedVideoIndex(index)
    setVideos(updatedVideos)

    // Debounce the onUpload call
    const timeoutId = setTimeout(() => {
      onUpload(updatedVideos)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleClick = (e: React.MouseEvent) => {
    // Prevent form submission when clicking video controls
    e.preventDefault()
    e.stopPropagation()
  }

  const VideoPlayer = ({ video, playerId }: { video: VideoUpload; playerId: string }) => {
    const [error, setError] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    if (video.type === "youtube") {
      let videoId;
      
      if (video.url.includes("embed")) {
        videoId = video.url.split("/").pop()?.split("?")[0];
      } else if (video.url.includes("youtube.com/shorts/")) {
        // Handle YouTube Shorts URLs
        const shortsMatch = video.url.match(/youtube\.com\/shorts\/([^?&#]+)/);
        videoId = shortsMatch?.[1];
      } else {
        // Handle standard YouTube URLs
        videoId = video.url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w-]{11}))/)?.[1];
      }

      if (!videoId) {
        return <div className="text-red-500">Invalid YouTube URL</div>
      }

      return (
        <div className="relative w-full h-full bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500">
              Failed to load video. Please try again.
            </div>
          )}
          <iframe
            id={playerId}
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&rel=0&origin=${window.location.origin}`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError(true)
              setIsLoading(false)
            }}
          />
          {!error && !isLoading && (
            <AdminVideoControls videoId={playerId} type="youtube" className="absolute bottom-4 left-4 right-4" />
          )}
        </div>
      )
    } else if (video.type === "blob" || video.type === "local") {
      return (
        <div className="relative w-full h-full bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center text-red-500">
              Failed to load video. Please try again.
            </div>
          )}
          <video
            id={playerId}
            src={video.url}
            className="w-full h-full"
            playsInline
            preload="metadata"
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setError(true)
              setIsLoading(false)
            }}
          />
          <AdminVideoControls videoId={playerId} type="local" className="absolute bottom-4 left-4 right-4" />
        </div>
      )
    }

    return null
  }

  return (
    <div className="w-full space-y-6" onClick={handleClick}>
      <Tabs defaultValue="local" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="local">Local Upload</TabsTrigger>
          <TabsTrigger value="youtube">YouTube Link</TabsTrigger>
        </TabsList>
        <TabsContent value="local">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:bg-gray-50",
            )}
          >
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2 text-lg">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">Drag &apos;n&apos; drop videos here, or click to select</p>
                <p className="text-sm text-gray-500">Supports: MP4, WebM, OGG</p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="youtube">
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter YouTube video URL"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
            />
            <Button onClick={handleYoutubeUpload} disabled={!youtubeLink}>
              <Youtube className="h-4 w-4 mr-2" />
              Add YouTube Video
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      {videos.length > 0 && (
        <div className="space-y-6">
          {videos.map((video, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-video min-h-[300px]">
                    <VideoPlayer video={video} playerId={`video-${index}`} />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="featured"
                          checked={index === featuredVideoIndex}
                          onChange={() => handleFeaturedChange(index)}
                          id={`featured-${index}`}
                          onClick={handleClick}
                        />
                        <label htmlFor={`featured-${index}`}>Featured Video</label>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault()
                          handleRemove(index)
                        }}
                        type="button"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Video
                      </Button>
                    </div>
                    <Tabs defaultValue="english" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="english">English</TabsTrigger>
                        <TabsTrigger value="arabic">Arabic</TabsTrigger>
                      </TabsList>
                      <TabsContent value="english" className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Title (English)</label>
                          <Input
                            value={video.title_en}
                            onChange={(e) => handleInputChange(index, "title", e.target.value, "en")}
                            placeholder="Enter video title in English"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Description (English)</label>
                          <Textarea
                            value={video.description_en || ""}
                            onChange={(e) => handleInputChange(index, "description", e.target.value, "en")}
                            placeholder="Enter video description in English"
                            rows={3}
                          />
                        </div>
                      </TabsContent>
                      <TabsContent value="arabic" className="space-y-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Title (Arabic)</label>
                          <Input
                            value={video.title_ar}
                            onChange={(e) => handleInputChange(index, "title", e.target.value, "ar")}
                            placeholder="Enter video title in Arabic"
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Description (Arabic)</label>
                          <Textarea
                            value={video.description_ar || ""}
                            onChange={(e) => handleInputChange(index, "description", e.target.value, "ar")}
                            placeholder="Enter video description in Arabic"
                            className="text-right"
                            dir="rtl"
                            rows={3}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function getYoutubeVideoId(url: string) {
  // Handle YouTube Shorts URLs
  if (url.includes('youtube.com/shorts/')) {
    const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&#]+)/)
    return shortsMatch && shortsMatch[1].length === 11 ? shortsMatch[1] : null
  }
  
  // Handle standard YouTube URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

