"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { type CreateVideoGalleryInput, createVideoGallerySchema } from "@/lib/schema/schema"
import { MultiVideoUpload } from "@/lib/multi-video-upload"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createVideoGallery } from "@/app/actions/videoAction"

export default function CreateVideoGallery() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<CreateVideoGalleryInput>({
    resolver: zodResolver(createVideoGallerySchema),
    defaultValues: {
      title_en: "",
      title_ar: "",
      date: new Date().toISOString().split("T")[0],
      videos: [],
    },
    mode: "onChange",
  })

  async function onSubmit(data: CreateVideoGalleryInput) {
    setIsSubmitting(true)

    try {
      if (!data || typeof data !== "object") {
        throw new Error("Invalid form data")
      }
      if (!data.videos || data.videos.length === 0) {
        throw new Error("Please add at least one video")
      }

      // Check for featured video
      const featuredVideos = data.videos.filter(v => v.featured)
      if (featuredVideos.length !== 1) {
        throw new Error("Please select exactly one featured video")
      }

      const result = await createVideoGallery(data)
      if (result.success) {
        toast({
          title: "Success",
          description: "Video gallery created successfully",
        })
        form.reset()
        router.push("/admin/VideoGallery")
      } else {
        throw new Error(result.error || "Failed to create video gallery")
      }
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-screen-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create Video Gallery</CardTitle>
          <CardDescription>Fill out the form below to create a new video gallery.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit(onSubmit)(e)
              }}
              className="space-y-8"
            >
              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="arabic">Arabic</TabsTrigger>
                </TabsList>
                <TabsContent value="english">
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter gallery title in English" {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="arabic">
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Arabic)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter gallery title in Arabic"
                            {...field}
                            className="w-full text-right"
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="videos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Videos</FormLabel>
                    <FormControl>
                      <MultiVideoUpload
                        onUpload={(videos) => {
                          field.onChange(videos)
                          form.trigger("videos")
                        }}
                        defaultVideos={field.value?.map((v) => ({
                          ...v,
                          description_en: v.description_en ?? null,
                          description_ar: v.description_ar ?? null,
                        }))}
                      />
                    </FormControl>
                    <FormDescription>Upload one or more videos for your gallery.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Creating..." : "Create Video Gallery"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

