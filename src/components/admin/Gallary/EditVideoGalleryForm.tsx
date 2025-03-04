'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getVideoGallery, updateVideoGallery } from "@/app/actions/videoAction";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { UpdateVideoGalleryInput, updateVideoGallerySchema } from "@/lib/schema/schema";
import { MultiVideoUpload } from "@/lib/multi-video-upload";
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getYoutubeVideoId } from "@/lib/utils";

interface EditVideoGalleryFormProps {
  id: string;
}

export default function EditVideoGalleryForm({ id }: EditVideoGalleryFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UpdateVideoGalleryInput>({
    resolver: zodResolver(updateVideoGallerySchema),
    defaultValues: {
      id: id,
      title_en: "",
      title_ar: "",
      date: new Date().toISOString().split("T")[0],
      videos: [],
    },
    mode: "onChange",
  });

  useEffect(() => {
    async function loadGallery() {
      try {
        const gallery = await getVideoGallery(id);
        if (gallery) {
          form.reset({
            id: gallery.id,
            title_en: gallery.title_en,
            title_ar: gallery.title_ar,
            date: new Date(gallery.createdAt).toISOString().split("T")[0],
            videos: gallery.videos.map(video => ({
              url: video.url,
              title_en: video.title_en,
              title_ar: video.title_ar,
              description_en: video.description_en || null,
              description_ar: video.description_ar || null,
              type: video.type as 'youtube' | 'local',
              featured: video.featured || false,  // Include featured status
              thumbnail: video.thumbnail
            })),
          });
        } else {
          toast({
            title: "Error",
            description: "Gallery not found",
            variant: "destructive",
          });
          router.push("/admin/VideoGallery");
        }
      } catch (error) {
        console.error("Error loading gallery:", error);
        toast({
          title: "Error",
          description: "Failed to load gallery",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadGallery();
  }, [id, form, toast, router]);

  async function onSubmit(data: UpdateVideoGalleryInput) {
    setIsSubmitting(true);
    
    try {
      if (!data.videos || data.videos.length === 0) {
        throw new Error("Please add at least one video");
      }

      // Check for featured video
      const featuredVideos = data.videos.filter(v => v.featured);
      if (featuredVideos.length !== 1) {
        throw new Error("Please select exactly one featured video");
      }

      const result = await updateVideoGallery(data);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Video gallery updated successfully",
        });
        router.push("/admin/VideoGallery");
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to update gallery");
      }
    } catch (error) {
      console.error("Error updating gallery:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update gallery",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-screen-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Video Gallery</CardTitle>
          <CardDescription>
            Update the details of your video gallery.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                          <Input
                            placeholder="Enter gallery title in English"
                            {...field}
                            className="w-full"
                          />
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
                          // Ensure URLs are properly formatted
                          const processedVideos = videos.map(v => ({
                            ...v,
                            url: v.type === 'youtube' && !v.url.includes('embed') 
                              ? `https://www.youtube.com/embed/${getYoutubeVideoId(v.url)}`
                              : v.url
                          }));
                          field.onChange(processedVideos);
                          form.trigger("videos");
                        }}
                        defaultVideos={field.value}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload local videos or add YouTube links.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/VideoGallery")}
                  className="w-full"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Gallery"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

