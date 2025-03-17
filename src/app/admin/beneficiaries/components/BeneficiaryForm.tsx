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
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/lib/ImageUpload"
import { beneficiarySchema, type BeneficiaryFormInput } from "@/lib/schema/beneficiarySchema"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { CategorySelector } from "./CategorySelector"
import { Category } from "@prisma/client"
import { createBeneficiary, updateBeneficiary } from "@/app/actions/beneficiaryActions"

interface BeneficiaryFormProps {
  categories: Category[]
  initialData?: Partial<BeneficiaryFormInput>
  mode: 'create' | 'edit'
  id?: string
  buttonText?: string
}

export function BeneficiaryForm({ 
  categories: initialCategories, 
  initialData, 
  mode,
  id,
  buttonText = "Save Beneficiary" 
}: BeneficiaryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState(initialCategories)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<BeneficiaryFormInput>({
    resolver: zodResolver(beneficiarySchema),
    defaultValues: initialData || {
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      imageUrl: "",
      ctaText: "",
      ctaLink: "",
      categoryId: "",
    },
  })

  async function handleSubmit(data: BeneficiaryFormInput) {
    setIsSubmitting(true)
    const formData = new FormData()
    
    // Always append required fields
    formData.append("title_en", data.title_en)
    formData.append("title_ar", data.title_ar)
    formData.append("imageUrl", data.imageUrl)
    formData.append("categoryId", data.categoryId)
    
    // Handle optional fields
    if (data.description_en?.trim()) {
      formData.append("description_en", data.description_en.trim())
    }
    if (data.description_ar?.trim()) {
      formData.append("description_ar", data.description_ar.trim())
    }
    if (data.ctaText?.trim()) {
      formData.append("ctaText", data.ctaText.trim())
    }
    if (data.ctaLink?.trim()) {
      formData.append("ctaLink", data.ctaLink.trim())
    }

    try {
      const result = mode === 'edit' && id
        ? await updateBeneficiary(id, formData)
        : await createBeneficiary(formData)

      if (result.success) {
        toast({ title: "Success", description: "Beneficiary saved successfully" })
        router.refresh()
        router.push("/admin/beneficiaries")
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

  const handleNewCategory = (category: Category) => {
    setCategories((prev) => [...prev, category])
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Beneficiary Details</CardTitle>
        <CardDescription>Add or edit beneficiary information.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Beneficiary Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      onUpload={(url) => field.onChange(url || "")}
                      defaultImage={field.value || undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <CategorySelector
                      categories={categories}
                      value={field.value}
                      onChange={field.onChange}
                      onNewCategory={handleNewCategory}
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
                  name="description_en"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (English) (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || "")}
                        />
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
                  name="description_ar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Arabic) (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || "")}
                          dir="rtl"
                        />
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
                name="ctaText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Text (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ctaLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CTA Link (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/beneficiaries")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {buttonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}
