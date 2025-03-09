"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { seoMetadataSchema, type SeoMetadataInput } from "@/lib/schema/seoSchema"
import { createOrUpdateSeoMetadata } from "@/app/actions/seo-actions"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowLeft } from "lucide-react"
import { ImageUpload } from "@/lib/ImageUpload"
import Link from "next/link"

interface SeoMetadataFormProps {
  page: {
    path: string
    name_en: string
    name_ar: string
    type: 'home' | 'program' | 'blog' | 'gallery' | 'about' | 'contact' | 'custom'
  }
  initialData?: Record<string, unknown>
}

export function SeoMetadataForm({ page, initialData }: SeoMetadataFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<SeoMetadataInput>({
    resolver: zodResolver(seoMetadataSchema),
    defaultValues: initialData || {
      pagePath: page.path,
      pageType: page.type,
      title_en: page.name_en,
      title_ar: page.name_ar,
      description_en: "",
      description_ar: "",
      keywords_en: "",
      keywords_ar: "",
      ogImage: "",
      canonicalUrl: "",
      noIndex: false,
      structuredData: "",
    },
  })

  async function onSubmit(data: SeoMetadataInput) {
    setIsSubmitting(true)
    
    try {
      const result = await createOrUpdateSeoMetadata(data)
      
      if (result.success) {
        toast({
          title: "SEO metadata saved",
          description: "The SEO metadata has been saved successfully",
        })
        router.push("/admin/seo")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save SEO metadata",
          variant: "destructive",
        })
      }
    } catch (error: unknown) {
      console.error("Error saving SEO metadata:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Link href="/admin/seo" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <CardTitle>SEO Metadata</CardTitle>
            <CardDescription>
              Optimize your page for search engines
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <Tabs defaultValue="english">
              <TabsList className="mb-4">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">Arabic</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="english" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Recommended length: 50-60 characters
                      </FormDescription>
                      <div className="text-xs text-muted-foreground mt-1">
                        {field.value?.length || 0} characters
                      </div>
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
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        Recommended length: 120-160 characters
                      </FormDescription>
                      <div className="text-xs text-muted-foreground mt-1">
                        {field.value?.length || 0} characters
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="keywords_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords (e.g., tech, programming, courses)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="arabic" className="space-y-4">
                <FormField
                  control={form.control}
                  name="title_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} dir="rtl" />
                      </FormControl>
                      <FormDescription>
                        Recommended length: 50-60 characters
                      </FormDescription>
                      <div className="text-xs text-muted-foreground mt-1">
                        {field.value?.length || 0} characters
                      </div>
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
                        <Textarea {...field} dir="rtl" />
                      </FormControl>
                      <FormDescription>
                        Recommended length: 120-160 characters
                      </FormDescription>
                      <div className="text-xs text-muted-foreground mt-1">
                        {field.value?.length || 0} characters
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="keywords_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} dir="rtl" />
                      </FormControl>
                      <FormDescription>
                        Comma-separated keywords
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="advanced" className="space-y-4">
                <FormField
                  control={form.control}
                  name="ogImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Social Media Image</FormLabel>
                      <FormControl>
                        <ImageUpload
                          onUpload={(url) => field.onChange(url || "")}
                          defaultImage={field.value || undefined}
                        />
                      </FormControl>
                      <FormDescription>
                        Recommended size: 1200x630 pixels
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="canonicalUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Canonical URL</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="https://example.com/page" 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Use this to specify the preferred URL for this page
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="noIndex"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">No Index</FormLabel>
                        <FormDescription>
                          Prevent search engines from indexing this page
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="structuredData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Structured Data (JSON-LD)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="font-mono text-sm"
                          placeholder='{"@context": "https://schema.org", "@type": "WebPage", ...}'
                          rows={8}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Add structured data in JSON-LD format
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save SEO Metadata
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
} 