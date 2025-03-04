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
import { useToast } from "@/hooks/use-toast";
import { MultiImageUpload } from "@/lib/MultiImageUpload";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { EditGalleryInput, editGallerySchema } from "@/lib/schema/schema";
import { editGallery } from "@/app/actions/edit-gallery";

interface Gallery {
    id: string;
    title_en: string;
    title_ar: string;
    createdAt: string;
    images: { id: string; url: string; title_en: string | null; title_ar: string | null }[];
}

interface EditGalleryFormProps {
    gallery: Gallery;
}

export default function EditGalleryForm({ gallery }: EditGalleryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<EditGalleryInput>({
        resolver: zodResolver(editGallerySchema),
        defaultValues: {
            title_en: gallery.title_en,
            title_ar: gallery.title_ar,
            date: new Date(gallery.createdAt).toISOString().split("T")[0],
            imageUrls: gallery.images.map(img => img.url),
            imageTitles_en: gallery.images.map(img => img.title_en || ""),
            imageTitles_ar: gallery.images.map(img => img.title_ar || ""),
            deletedImageIds: [],
        },
    });

    const [images, setImages] = useState(gallery.images);

    useEffect(() => {
        form.setValue("imageUrls", images.map(img => img.url));
        form.setValue("imageTitles_en", images.map(img => img.title_en || ""));
        form.setValue("imageTitles_ar", images.map(img => img.title_ar || ""));
    }, [images, form]);

    async function onSubmit(data: EditGalleryInput) {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title_en", data.title_en);
        formData.append("title_ar", data.title_ar);
        formData.append("date", data.date);
        data.imageUrls.forEach((url, index) => {
            formData.append("imageUrls", url);
            formData.append("imageTitles_en", data.imageTitles_en![index] || "");
            formData.append("imageTitles_ar", data.imageTitles_ar![index] || "");
        });
        data.deletedImageIds.forEach(id => formData.append("deletedImageIds", id));

        try {
            const result = await editGallery(gallery.id, formData);
            if (result.success) {
                toast({
                    title: "Gallery updated",
                    description: "Your gallery has been updated successfully.",
                });
                router.push("/admin/ImageGallery");
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

    const handleImageDelete = (index: number) => {
        const newImages = [...images];
        const deletedImage = newImages.splice(index, 1)[0];
        setImages(newImages);

        if (deletedImage.id) {
            const deletedImageIds = form.getValues("deletedImageIds");
            form.setValue("deletedImageIds", [...deletedImageIds, deletedImage.id]);
        }
    };

    const handleImageAdd = (newImageUrls: string[]) => {
        const newImages = [
            ...images,
            ...newImageUrls.map(url => ({ id: '', url, title_en: null, title_ar: null })),
        ];
        setImages(newImages);
    };

    return (
        <div className="container mx-auto py-10">
            <Card className="w-full max-w-screen-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Edit Gallery</CardTitle>
                    <CardDescription>
                        Update the gallery information and images below.
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
                            <div>
                                <FormLabel>Images</FormLabel>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                                    {images.map((image, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="relative aspect-video">
                                                <Image
                                                    src={image.url}
                                                    alt={`Gallery image ${index + 1}`}
                                                    fill
                                                    className="rounded-md object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2"
                                                    onClick={() => handleImageDelete(index)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                            <FormField
                                                control={form.control}
                                                name={`imageTitles_en.${index}`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Image title (English)"
                                                                {...field}
                                                                value={field.value ?? ''}
                                                                className="w-full"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`imageTitles_ar.${index}`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Image title (Arabic)"
                                                                {...field}
                                                                value={field.value ?? ''}
                                                                className="w-full text-right"
                                                                dir="rtl"
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="imageUrls"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Add New Images</FormLabel>
                                        <FormControl>
                                            <MultiImageUpload
                                                onUpload={(urls) => {
                                                    handleImageAdd(urls);
                                                    field.onChange([...field.value, ...urls]);
                                                    form.trigger("imageUrls");
                                                }}
                                                defaultImages={[]}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Upload one or more new images for your gallery.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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

