/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createAboutUs, updateAboutUs, deleteAboutUs } from '@/app/actions/pages/about-us-actions'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { ImageUpload } from '@/lib/ImageUpload'
import { IconSelector } from '@/components/shared/icon-selector'

const cardSchema = z.object({
  titleEn: z.string().optional(),
  titleAr: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionAr: z.string().optional(),
  icon: z.string().optional().default('Star'),
})

const aboutUsSchema = z.object({
  titleEn: z.string().min(1, 'Title in English is required'),
  titleAr: z.string().min(1, 'Title in Arabic is required'),
  descriptionEn: z.string().min(1, 'Description in English is required'),
  descriptionAr: z.string().min(1, 'Description in Arabic is required'),
  imageUrl: z.string().nullable(),
  card1Visible: z.boolean().default(true),
  card2Visible: z.boolean().default(true),
  card3Visible: z.boolean().default(true),
  cards: z.array(cardSchema).optional().default([]),
})

type AboutUsFormValues = z.infer<typeof aboutUsSchema>

interface AboutUsFormProps {
  initialData?: AboutUsFormValues & { id: string }
}

export function AboutUsForm({ initialData }: AboutUsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  const defaultCard = {
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    icon: 'Star',
  } as const;

  const form = useForm<AboutUsFormValues>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: {
      ...initialData,
      imageUrl: initialData?.imageUrl || null,
      card1Visible: initialData?.card1Visible ?? true,
      card2Visible: initialData?.card2Visible ?? true,
      card3Visible: initialData?.card3Visible ?? true,
      cards: initialData?.cards || [defaultCard, defaultCard, defaultCard],
    },
  })

  const { fields: cardFields } = useFieldArray({
    name: 'cards',
    control: form.control,
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Form values changed:', value)
    })
    return () => subscription.unsubscribe()
  }, [form])

  async function onSubmit(data: AboutUsFormValues) {
    setIsLoading(true)
    try {
      const formData = {
        ...data,
        imageUrl: data.imageUrl || null,
        cards: data.cards.map(card => ({
          ...card,
          titleEn: card.titleEn || "",
          titleAr: card.titleAr || "",
          descriptionEn: card.descriptionEn || "",
          descriptionAr: card.descriptionAr || "",
          icon: card.icon || "Star"
        }))
      }

      if (initialData) {
        await updateAboutUs(initialData.id, formData)
        toast({ title: 'About Us updated successfully' })
      } else {
        await createAboutUs(formData)
        toast({ title: 'About Us created successfully' })
      }
      router.push('/admin/pages/about')
      router.refresh()
    } catch (error) {
      console.error('Form submission error:', error) // Add error logging
      toast({ title: 'An error occurred', description: 'Please try again', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  async function onDelete() {
    if (!initialData) return
    setIsLoading(true)
    try {
      await deleteAboutUs(initialData.id)
      toast({ title: 'About Us deleted successfully' })
      router.push('/admin/pages/about')
      router.refresh()
    } catch (error) {
      toast({ title: 'An error occurred', description: 'Please try again', variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render form until client-side mounted
  if (!mounted) {
    return null
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Main Information</CardTitle>
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
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      onUpload={(url) => field.onChange(url)}
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cards</CardTitle>
          </CardHeader>
          <CardContent>
            {cardFields.map((field, index) => (
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
                      <FormField
                        control={form.control}
                        name={`cards.${index}.descriptionEn`}
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
                      <FormField
                        control={form.control}
                        name={`cards.${index}.descriptionAr`}
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
                  <FormField
                    control={form.control}
                    name={`cards.${index}.icon`}
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <IconSelector 
                            value={field.value}
                            onChange={(value) => field.onChange(value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`card${index + 1}Visible` as keyof AboutUsFormValues}
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value as boolean}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                        <FormLabel>Show Card {index + 1}</FormLabel>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="submit" disabled={isLoading}>
            {initialData ? 'Update' : 'Create'} About Us
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

