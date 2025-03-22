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
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/lib/ImageUpload"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { createSafeguard, updateSafeguard } from "@/app/actions/safeguardActions"
import * as z from "zod"
import { FileUpload } from "@/lib/FileUpload"
import { HexColorPicker } from "react-colorful"

const safeguardSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  tagline_en: z.string().min(1, "English tagline is required"),
  tagline_ar: z.string().min(1, "Arabic tagline is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  longDescription_en: z.string().optional(),
  longDescription_ar: z.string().optional(),
  bgColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid background color format"),
  attachmentUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  order: z.coerce.number().int().positive().default(1),
})

type SafeguardFormInput = z.infer<typeof safeguardSchema>

interface SafeguardFormProps {
  initialData?: Partial<SafeguardFormInput>
  mode: "create" | "edit"
  id?: string
  buttonText?: string
}

export function SafeguardForm({ initialData, mode, id, buttonText = "Save Safeguard" }: SafeguardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<SafeguardFormInput>({
    resolver: zodResolver(safeguardSchema),
    defaultValues: initialData || {
      domain: "",
      title_en: "",
      title_ar: "",
      tagline_en: "",
      tagline_ar: "",
      description_en: "",
      description_ar: "",
      longDescription_en: "",
      longDescription_ar: "",
      bgColor: "#f0f0f0",
      attachmentUrl: "",
      imageUrl: "",
      order: 1,
    },
  })

  async function handleSubmit(data: SafeguardFormInput) {
    setIsSubmitting(true)
    const formData = new FormData()

    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString())
      }
    })

    try {
      const result = mode === "edit" && id ? await updateSafeguard(id, formData) : await createSafeguard(formData)

      if (result.success) {
        toast({ title: "Success", description: "Safeguard saved successfully" })
        router.refresh()
        router.push("/admin/safeguards")
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong"
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Safeguard Details</CardTitle>
        <CardDescription>Add or edit safeguard information.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. ESMF, SEP, LMP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Order</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
              name="attachmentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    <FileUpload
                      onUpload={(urls) => field.onChange(urls[0] || "")}
                      defaultFiles={field.value ? [field.value] : []}
                      maxFiles={1}
                    />
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
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onUpload={(url) => field.onChange(url)}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                  name="tagline_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longDescription_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Long Description (English)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
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
                  name="tagline_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} dir="rtl" />
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
                        <Textarea {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longDescription_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Long Description (Arabic)</FormLabel>
                      <FormControl>
                        <Textarea {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {buttonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

