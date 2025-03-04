'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { CreatePostInput, createPostSchema, PostType, PostTypeValue } from "@/lib/schema/schema"
import { editPost } from "@/app/actions/edit-post"
import { ImageUpload } from "@/lib/ImageUpload"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TagSelector } from "@/components/admin/Gallary/TagSelector"
import { RichTextEditor } from '@/components/Editor/RichTextEditor'

interface Tag {
  id: string;
  name_en: string;
  name_ar: string;
}

interface Blog {
  id: number;
  title_en: string;
  title_ar: string;
  slug: string;
  type: string;
  description_en: string | null;
  description_ar: string | null;
  content_en: string;
  content_ar: string;
  imageUrl: string | null;
  readTime: string | null;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  tags: {
    id: number;
    name_en: string;
    name_ar: string;
  }[];
}

export default function EditBlogForm({ blog }: { blog: Blog }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch("/api/tags")
      const data = await response.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedTags = data.map((tag: any) => ({
        id: tag.id.toString(),
        name_en: tag.name_en,
        name_ar: tag.name_ar
      }))
      setTags(formattedTags)
    }
    fetchTags()
  }, [])

  const form = useForm<CreatePostInput>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      slug: blog.slug,
      type: blog.type as PostTypeValue,
      title_en: blog.title_en,
      title_ar: blog.title_ar,
      description_en: blog.description_en || "",
      description_ar: blog.description_ar || "",
      content_en: blog.content_en || "",
      content_ar: blog.content_ar || "",
      imageUrl: blog.imageUrl,
      readTime: blog.readTime || "",
      published: blog.published,
      featured: blog.featured,
      tags: blog.tags.map(tag => tag.id.toString())
    },
  })

  async function onSubmit(data: CreatePostInput) {
    setIsSubmitting(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item))
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString())
      }
    })

    try {
      const result = await editPost(blog.id, formData)
      if (result.success) {
        toast({
          title: "Success",
          description: "Blog post updated successfully.",
        })
        router.push('/admin/blog')
        router.refresh()
      } else if (result.error) {
        toast({
          title: "Error",
          description: typeof result.error === 'object' 
            ? JSON.stringify(result.error) 
            : result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Edit Blog Post</CardTitle>
        <CardDescription>Edit the form below to update the blog post.</CardDescription>
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
                      <Input placeholder="Enter post slug" {...field} className="w-full" />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select post type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={PostType.BLOG}>Blog</SelectItem>
                        <SelectItem value={PostType.PUBLICATION}>Publication</SelectItem>
                        <SelectItem value={PostType.ANNOUNCEMENT}>Announcement</SelectItem>
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
              <TabsContent value="english">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter English title" {...field} className="w-full" />
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
                            value={field.value || ""}
                            className="w-full min-h-[100px] resize-y"
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
                            content={field.value || ""}
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
                          <Input placeholder="Enter Arabic title" {...field} className="w-full text-right" dir="rtl" />
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
                            value={field.value || ""}
                            className="w-full min-h-[100px] resize-y text-right"
                            dir="rtl"
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
                      <FormItem>
                        <FormLabel>Content (Arabic)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            dir="rtl"
                            placeholder="Write your content in Arabic..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onUpload={(url) => field.onChange(url)}
                      defaultImage={field.value || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="readTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Read Time</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter read time" {...field} className="w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                  <FormDescription>Select existing tags or create new ones.</FormDescription>
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
          {isSubmitting ? 'Updating...' : 'Update Post'}
        </Button>
      </CardFooter>
    </Card>
  )
}

