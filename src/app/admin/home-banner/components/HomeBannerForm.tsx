/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from "@/lib/ImageUpload"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { updateHomeBanner } from "@/app/actions/homeBannerActions"
import * as z from "zod"
import { HexColorPicker } from "react-colorful"

const bannerSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid background color format"),
  buttonColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid button color format"),
  buttonText_en: z.string().min(1, "English button text is required"),
  buttonText_ar: z.string().min(1, "Arabic button text is required"),
  imageUrl: z.string().optional(),
})

type HomeBannerInput = z.infer<typeof bannerSchema>

interface HomeBannerFormProps {
  initialData?: Partial<HomeBannerInput>
}

export function HomeBannerForm({ initialData }: HomeBannerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<HomeBannerInput>({
    resolver: zodResolver(bannerSchema),
    defaultValues: initialData || {
      title_en: "",
      title_ar: "",
      bgColor: "#f3f4f6",
      buttonText_en: "Learn More",
      buttonText_ar: "اعرف المزيد",
      buttonColor: "#142451",
      imageUrl: "",
    },
  })

  async function onSubmit(data: HomeBannerInput) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })

      const result = await updateHomeBanner(formData)
      if (result.success) {
        toast({ title: "Success", description: "Banner updated successfully" })
        router.refresh()
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Something went wrong", 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Home Banner</CardTitle>
        <CardDescription>Configure the home page banner.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <Tabs defaultValue="english">
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">Arabic</TabsTrigger>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonText_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="buttonText_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Button Text (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <FormField
              control={form.control}
              name="bgColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <HexColorPicker color={field.value} onChange={field.onChange} />
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="buttonColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-4">
                      <HexColorPicker color={field.value} onChange={field.onChange} />
                      <Input {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onUpload={(url) => field.onChange(url)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
