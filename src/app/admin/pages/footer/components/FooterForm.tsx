"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MultiImageUpload } from "@/lib/MultiImageUpload"
import { footerSchema, type FooterFormInput } from "@/lib/schema/footerSchema"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface FooterFormProps {
  initialData?: Partial<FooterFormInput>
  onSubmit: (data: FooterFormInput) => Promise<{ success: boolean; error?: string }>
  buttonText?: string
}

export function FooterForm({ initialData, onSubmit, buttonText = "Save Footer" }: FooterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<FooterFormInput>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
      techStartTitle_en: initialData?.techStartTitle_en || "TechStart",
      techStartTitle_ar: initialData?.techStartTitle_ar || "تك ستارت",
      titleColor: initialData?.titleColor || "#1b316e",
      gradientColor: initialData?.gradientColor || "#862996",
      instagram: initialData?.instagram || "",
      linkedin: initialData?.linkedin || "",
      facebook: initialData?.facebook || "",
      youtube: initialData?.youtube || "",
      twitter: initialData?.twitter || "",
      projectPartners: initialData?.projectPartners || [],
      fundedPartners: initialData?.fundedPartners || [],
      implementedPartners: initialData?.implementedPartners || [],
    },
  })

  const handleSubmit = async (data: FooterFormInput) => {
    setIsSubmitting(true)
    try {
      const result = await onSubmit(data)
      if (result.success) {
        toast({ title: "Success", description: "Footer updated successfully" })
        router.refresh()
        router.push("/admin/pages/footer")
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Something went wrong", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Footer Settings</CardTitle>
        <CardDescription>Customize your website footer appearance and content.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <Tabs defaultValue="english">
              <TabsList>
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">Arabic</TabsTrigger>
              </TabsList>
              
              <TabsContent value="english" className="space-y-4">
                <FormField
                  control={form.control}
                  name="techStartTitle_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TechStart Title (English)</FormLabel>
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
                  name="techStartTitle_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>TechStart Title (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} dir="rtl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="titleColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" {...field} className="w-20" />
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradientColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gradient Color</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input type="color" {...field} className="w-20" />
                        <Input {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="projectPartners"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Partners</FormLabel>
                    <FormControl>
                      <MultiImageUpload
                        onUpload={(urls) => field.onChange(urls)}
                        defaultImages={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fundedPartners"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Funded By Partners</FormLabel>
                    <FormControl>
                      <MultiImageUpload
                        onUpload={(urls) => field.onChange(urls)}
                        defaultImages={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="implementedPartners"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Implemented By Partners</FormLabel>
                    <FormControl>
                      <MultiImageUpload
                        onUpload={(urls) => field.onChange(urls)}
                        defaultImages={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["instagram", "linkedin", "facebook", "youtube", "twitter"].map((social) => (
                <FormField
                  key={social}
                  control={form.control}
                  name={social as keyof FooterFormInput}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{social} URL</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} placeholder={`Enter ${social} URL`} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
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
