/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createFocusarea, updateFocusarea, deleteFocusarea } from "@/app/actions/pages/focusareas-actions"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { ImageUpload } from "@/lib/ImageUpload"

const cardSchema = z.object({
  titleEn: z.string().min(1, "Title in English is required"),
  titleAr: z.string().min(1, "Title in Arabic is required"),
  imageUrl: z.string().min(1, "Image is required"),
  buttonUrl: z.string().nullable().optional(),
})

const focusareaSchema = z.object({
  titleEn: z.string().min(1, "Title in English is required"),
  titleAr: z.string().min(1, "Title in Arabic is required"),
  descriptionEn: z.string().default(""),
  descriptionAr: z.string().default(""),
  cards: z.array(cardSchema).min(1, "At least 1 card is required").max(6, "Maximum 6 cards are allowed"),
})

type FocusareaFormValues = z.infer<typeof focusareaSchema>

interface FocusareaFormProps {
  initialData?: FocusareaFormValues & { id: string }
}

export function FocusareaForm({ initialData }: FocusareaFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FocusareaFormValues>({
    resolver: zodResolver(focusareaSchema),
    defaultValues: initialData || {
      titleEn: "",
      titleAr: "",
      descriptionEn: "",
      descriptionAr: "",
      cards: [{ titleEn: "", titleAr: "", imageUrl: "", buttonUrl: null }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "cards",
    control: form.control,
  })

  async function onSubmit(data: FocusareaFormValues) {
    setIsLoading(true)
    try {
      if (initialData) {
        await updateFocusarea(initialData.id, data)
        toast({ title: "Focus area updated successfully" })
      } else {
        await createFocusarea(data)
        toast({ title: "Focus area created successfully" })
      }
      router.push("/admin/pages/focusareas")
      router.refresh()
    } catch (error) {
      toast({ title: "An error occurred", description: "Please try again", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  async function onDelete() {
    if (!initialData) return
    setIsLoading(true)
    try {
      await deleteFocusarea(initialData.id)
      toast({ title: "Focus area deleted successfully" })
      router.push("/admin/pages/focusareas")
      router.refresh()
    } catch (error) {
      toast({ title: "An error occurred", description: "Please try again", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Focus Area Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">Arabic</TabsTrigger>
              </TabsList>
              <TabsContent value="en" className="space-y-4">
                <FormField
                  control={form.control}
                  name="titleEn"
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
                  name="descriptionEn"
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
              </TabsContent>
              <TabsContent value="ar" className="space-y-4">
                <FormField
                  control={form.control}
                  name="titleAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="descriptionAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Arabic)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {fields.map((field, index) => (
              <Card key={field.id} className="mb-4">
                <CardHeader>
                  <CardTitle>Card {index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">Arabic</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`cards.${index}.titleEn`}
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
                    <TabsContent value="ar" className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`cards.${index}.titleAr`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title (Arabic)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                  <FormField
                    control={form.control}
                    name={`cards.${index}.imageUrl`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Image</FormLabel>
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
                  <FormField
                    control={form.control}
                    name={`cards.${index}.buttonUrl`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Button URL (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || null)}
                            placeholder="https://example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => remove(index)}>
                      Remove Card
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
            {fields.length < 6 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ titleEn: "", titleAr: "", imageUrl: "", buttonUrl: null })}
              >
                Add Card
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Update" : "Create"} Focus Area
          </Button>
          {initialData && (
            <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading}>
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

