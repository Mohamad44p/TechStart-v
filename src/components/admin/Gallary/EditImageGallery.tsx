"use client";

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
import { editGallery } from "@/app/actions/edit-gallery";
import { useToast } from "@/hooks/use-toast";
import { EditGalleryInput, editGallerySchema } from "@/lib/schema/schema";
import { MultiImageUpload } from "@/lib/MultiImageUpload";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface EditImageGalleryProps {
  gallery: {
    id: string;
    title_en: string;
    title_ar: string;
    createdAt: string;
    images: {
      id: string;
      url: string;
      title_en: string | null;
      title_ar: string | null;
      featured: boolean;
    }[];
  };
}

export default function EditImageGallery({ gallery }: EditImageGalleryProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<EditGalleryInput>({
    resolver: zodResolver(editGallerySchema),
    defaultValues: {
      title_en: gallery.title_en,
      title_ar: gallery.title_ar,
      date: gallery.createdAt.split('T')[0],
      imageUrls: gallery.images.map(img => img.url),
      imageTitles_en: gallery.images.map(img => img.title_en ?? null),
      imageTitles_ar: gallery.images.map(img => img.title_ar ?? null),
      imageFeatured: gallery.images.map(img => img.featured),
      deletedImageIds: [],
    },
  });

  const handleFeaturedChange = (index: number, checked: boolean) => {
    const currentFeatured = form.getValues("imageFeatured") ?? [];
    let newFeatured;
    if (checked) {
      newFeatured = currentFeatured.map((_, i) => i === index);
    } else {
      newFeatured = currentFeatured.map((value, i) => {
        if (i === index) return false;
        if (!currentFeatured.some(Boolean) && i === 0) return true;
        return value;
      });
    }
    form.setValue("imageFeatured", newFeatured);
  };

  useEffect(() => {
    const images = form.watch("imageUrls");
    const featured = form.getValues("imageFeatured") ?? [];
    if (images.length > 0 && !featured.some(Boolean)) {
      const newFeatured = images.map((_, index) => index === 0);
      form.setValue("imageFeatured", newFeatured);
    }
  }, [form]);

  async function onSubmit(data: EditGalleryInput) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title_en", data.title_en);
    formData.append("title_ar", data.title_ar);
    formData.append("date", data.date);
    
    data.imageUrls.forEach((url, index) => {
      formData.append("imageUrls", url);
      formData.append("imageTitles_en", data.imageTitles_en?.[index] ?? '');
      formData.append("imageTitles_ar", data.imageTitles_ar?.[index] ?? '');
      formData.append("imageFeatured", String(data.imageFeatured?.[index] ?? false));
    });

    data.deletedImageIds.forEach(id => {
      formData.append("deletedImageIds", id);
    });

    try {
      const result = await editGallery(gallery.id, formData);
      if (result.success) {
        toast({
          title: "Gallery updated",
          description: "Your gallery has been updated successfully.",
        });
        router.push("/admin/ImageGallery");
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.error
            ? typeof result.error === 'string'
              ? result.error
              : JSON.stringify(result.error)
            : "An error occurred while updating the gallery.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full max-w-screen-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit Gallery</CardTitle>
          <CardDescription>
            Update your gallery information below.
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
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                      <MultiImageUpload
                        onUpload={(urls) => {
                          field.onChange(urls);
                          form.trigger("imageUrls");
                        }}
                        defaultImages={field.value}
                        onDelete={(index: number) => { 
                          const currentImages = form.getValues("imageUrls");
                          const deletedImageId = gallery.images[index]?.id;
                          if (deletedImageId) {
                            const deletedIds = form.getValues("deletedImageIds");
                            form.setValue("deletedImageIds", [...deletedIds, deletedImageId]);
                          }
                          const newImages = currentImages.filter((_, i) => i !== index);
                          form.setValue("imageUrls", newImages);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload one or more images for your gallery.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("imageUrls").map((_, index) => (
                <div key={index} className="space-y-4">
                  <FormField
                    control={form.control}
                    name={`imageTitles_en.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image {index + 1} Title (English)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter image title in English"
                            {...field}
                            value={field.value || ''}
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`imageTitles_ar.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image {index + 1} Title (Arabic)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter image title in Arabic"
                            {...field}
                            value={field.value || ''}
                            className="w-full text-right"
                            dir="rtl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`imageFeatured.${index}`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              handleFeaturedChange(index, checked as boolean);
                            }}
                          />
                        </FormControl>
                        <FormLabel>Set as Featured Image</FormLabel>
                        <FormDescription>
                          One image must be selected as featured
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              ))}

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Updating..." : "Update Gallery"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
