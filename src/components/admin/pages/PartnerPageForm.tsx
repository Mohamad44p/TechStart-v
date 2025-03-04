"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiImageUpload } from "@/lib/MultiImageUpload"
import { partnerPageSchema, type PartnerPageFormInput } from "@/lib/schema/partnerPageSchema"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { createPartnerPage, updatePartnerPage } from "@/app/actions/pages/partner-actions"

interface PartnerPageFormProps {
  initialData?: Partial<PartnerPageFormInput>
  partnerId?: string
  buttonText?: string
}

export function PartnerPageForm({ initialData, partnerId, buttonText = "Save Partner Page" }: PartnerPageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<PartnerPageFormInput>({
    resolver: zodResolver(partnerPageSchema),
    defaultValues: {
      title_en: initialData?.title_en || "",
      title_ar: initialData?.title_ar || "",
      imageUrl: initialData?.imageUrl || "",
      websiteUrl: initialData?.websiteUrl || "",
      type: initialData?.type || "PROJECT_OF",
      order: initialData?.order || 0,
    },
  })

  const handleSubmit = async (data: PartnerPageFormInput) => {
    setIsSubmitting(true)
    try {
      let result
      if (partnerId) {
        result = await updatePartnerPage(partnerId, data)
      } else {
        result = await createPartnerPage(data)
      }

      if (result.success) {
        toast({ title: "Success", description: "Partner page saved successfully" })
        router.refresh()
        router.push("/admin/pages/partners")
      } else {
        toast({ title: "Error", description: result.error, variant: "destructive" })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-screen-2xl mx-auto">
      <CardHeader>
        <CardTitle>{partnerId ? "Edit Partner Page" : "Create New Partner Page"}</CardTitle>
        <CardDescription>{partnerId ? "Update partner page information." : "Add a new partner page."}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Title (English)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Title (Arabic)</FormLabel>
                  <FormControl>
                    <Input {...field} dir="rtl" />
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
                  <FormLabel>Partner Logo</FormLabel>
                  <FormControl>
                    <MultiImageUpload
                      onUpload={(urls) => field.onChange(urls[0])}
                      defaultImages={field.value ? [field.value] : []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select partner type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PROJECT_OF">Project Of</SelectItem>
                      <SelectItem value="FUNDED_BY">Funded By</SelectItem>
                      <SelectItem value="IMPLEMENTED_BY">Implemented By</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value, 10))}
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
              {buttonText}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

