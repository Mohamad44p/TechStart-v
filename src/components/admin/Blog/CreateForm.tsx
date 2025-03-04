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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { createPost } from "@/app/actions/create-post";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/lib/ImageUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/lib/FileUpload";
import {
  CreatePostInput,
  createPostSchema,
  PostType,
} from "@/lib/schema/schema";
import { TagSelector } from "../Gallary/TagSelector";
import { RichTextEditor } from '@/components/Editor/RichTextEditor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Tag {
  id: string;
  name_en: string;
  name_ar: string;
}

export default function CreateBlog() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch("/api/tags");
      const data = await response.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedTags = data.map((tag: any) => ({
        id: tag.id.toString(),
        name_en: tag.name_en,
        name_ar: tag.name_ar,
      }));
      setTags(formattedTags);
    };
    fetchTags();
  }, []);

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      slug: "",
      type: PostType.BLOG, // Set a default type
      title_en: "",
      title_ar: "",
      description_en: "", // Change from null to empty string
      description_ar: "", // Change from null to empty string
      content_en: "",
      content_ar: "",
      imageUrl: null,
      readTime: "", // Changed to empty string
      published: false,
      featured: false,
      tags: [],
      pdfUrl: null,
    },
  });

  const isPublication = form.watch("type") === PostType.PUBLICATION;

  async function onSubmit(data: CreatePostInput) {
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    try {
      const result = await createPost(formData);
      if (result.success) {
        toast({
          title: "Blog post created",
          description: "Your blog post has been created successfully.",
        });
        form.reset();
        router.push("/admin/blog");
      } else if (result.error) {
        toast({
          title: "Error",
          description:
            typeof result.error === "object"
              ? JSON.stringify(result.error)
              : result.error,
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create Blog Post</CardTitle>
          <CardDescription>
            Fill out the form below to create a new blog post in English and
            Arabic.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter post slug"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormDescription>
                        This will be used in the URL of your post.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select post type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PostType.BLOG}>Blog</SelectItem>
                          <SelectItem value={PostType.PUBLICATION}>
                            Publication
                          </SelectItem>
                          <SelectItem value={PostType.ANNOUNCEMENT}>
                            Announcement
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Tabs defaultValue="english" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="english">English</TabsTrigger>
                  <TabsTrigger value="arabic">Arabic</TabsTrigger>
                </TabsList>
                <div className="space-y-4">
                  {/* Always show title fields */}
                  <TabsContent value="english">
                    <FormField
                      control={form.control}
                      name="title_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (English)</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} dir="rtl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </div>

                {isPublication ? (
                  <FormField
                    control={form.control}
                    name="pdfUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PDF Document</FormLabel>
                        <FormControl>
                          <FileUpload
                            onUpload={(urls) => field.onChange(urls[0])}
                            defaultFiles={field.value ? [field.value] : []}
                            maxFiles={1}
                            acceptedFileTypes={{ "application/pdf": [".pdf"] }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <TabsContent value="english">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title_en"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title (English)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter English title"
                                  {...field}
                                  className="w-full"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="description_en"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (English)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter English description"
                                  {...field}
                                  className="w-full min-h-[100px] resize-y"
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="content_en"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content (English)</FormLabel>
                              <FormControl>
                                <RichTextEditor
                                  content={field.value ?? ""}
                                  onChange={field.onChange}
                                  dir="ltr"
                                  placeholder="Write your content in English..."
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="arabic">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title_ar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title (Arabic)</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter Arabic title"
                                  {...field}
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
                          name="description_ar"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Arabic)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Enter Arabic description"
                                  {...field}
                                  className="w-full min-h-[100px] resize-y text-right"
                                  dir="rtl"
                                  value={field.value || ''} // Add null check
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="content_ar"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Content (Arabic)</FormLabel>
                              <FormControl>
                                <div className="min-h-[300px] border rounded-md">
                                  <RichTextEditor
                                    content={field.value ?? ""}
                                    onChange={field.onChange}
                                    dir="rtl"
                                    placeholder="اكتب المحتوى بالعربية..."
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <div className="w-full">
                        <ImageUpload
                          onUpload={(url) => field.onChange(url)}
                          defaultImage={field.value ?? undefined}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="readTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Read Time</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter read time"
                        {...field}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Published</FormLabel>
                        <FormDescription>
                          This post will be visible to readers if checked.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Featured</FormLabel>
                          <FormDescription>
                            This post will be highlighted if checked.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )} 
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <TagSelector
                          tags={tags}
                          selectedTags={field.value}
                          onChange={field.onChange}
                          onNewTag={(newTag) => setTags([...tags, newTag])}
                        />
                      </FormControl>
                      <FormDescription>
                        Select existing tags or create new ones.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
