'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiImageUpload } from '@/lib/MultiImageUpload'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {type HeroStep, type HeroStepInput, heroStepSchema } from '@/types/hero'
import { type SubmitErrorHandler } from 'react-hook-form'

interface HeroStepFormProps {
  initialData?: HeroStep;
  onSubmit: (data: HeroStepInput) => Promise<void>;
  isProcessing?: boolean;
}

export function HeroStepFormClient({ initialData, onSubmit, isProcessing = false }: HeroStepFormProps) {
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')
  const [currentTab, setCurrentTab] = useState('english')

  const form = useForm<z.infer<typeof heroStepSchema>>({
    resolver: zodResolver(heroStepSchema),
    defaultValues: {
      title_en: initialData?.title_en || '',
      title_ar: initialData?.title_ar || '',
      tagline_en: initialData?.tagline_en || '',
      tagline_ar: initialData?.tagline_ar || '',
      description_en: initialData?.description_en || '',
      description_ar: initialData?.description_ar || '',
      color: initialData?.color || '#000000',
      imageUrl: initialData?.imageUrl || '',
      order: initialData?.order || 1,
      button_title_en: initialData?.button_title_en || 'Get Started',
      button_title_ar: initialData?.button_title_ar || 'ابدأ الآن',
      button_link: initialData?.button_link || '#',
    },
    mode: 'onChange'
  })

  const handleImageUpload = (urls: string[]) => {
    if (urls.length > 0) {
      const url = urls[0]
      setImageUrl(url)
      form.setValue('imageUrl', url)
      form.trigger('imageUrl')
    }
  }

  const handleValidationError: SubmitErrorHandler<HeroStepInput> = (errors) => {
    if (errors.title_ar || errors.tagline_ar || errors.description_ar) {
      setCurrentTab('arabic')
    }
    else if (errors.title_en || errors.tagline_en || errors.description_en) {
      setCurrentTab('english')
    }
  }

  async function handleSubmit(values: z.infer<typeof heroStepSchema>) {
    try {
      const formattedValues: HeroStepInput = {
        ...values,
        order: Number(values.order)
      }
      await onSubmit(formattedValues)
      toast({
        title: "Success",
        description: `Hero step ${initialData ? 'updated' : 'created'} successfully`,
      })
      if (!initialData) {
        form.reset()
        setImageUrl('')
      }
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit, handleValidationError)} className="space-y-8">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
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
                    <Input placeholder="Enter title in English" {...field} value={field.value || ''} />
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
                    <Input placeholder="Enter tagline in English" {...field} value={field.value || ''} />
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
                    <Textarea placeholder="Enter description in English" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="button_title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Title (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter button text in English" {...field} value={field.value || ''} />
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
                    <Input 
                      placeholder="أدخل العنوان بالعربية" 
                      {...field} 
                      value={field.value || ''} 
                      className="text-right"
                      dir="rtl"
                    />
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
                    <Input 
                      placeholder="أدخل العنوان الفرعي بالعربية" 
                      {...field} 
                      value={field.value || ''} 
                      className="text-right"
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
                      placeholder="أدخل الوصف بالعربية" 
                      {...field} 
                      value={field.value || ''} 
                      className="text-right"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="button_title_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Title (Arabic)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="أدخل نص الزر بالعربية" 
                      {...field} 
                      value={field.value || ''} 
                      className="text-right"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="button_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button Link</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter button link (e.g., /contact or https://example.com)" 
                  {...field}
                  value={field.value || '#'} 
                />
              </FormControl>
              <FormDescription>Enter a URL or path for the button link.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="color" 
                    {...field}
                    value={field.value || '#000000'} 
                    className="w-12 h-12 p-1 rounded-md" 
                  />
                  <Input 
                    {...field}
                    value={field.value || '#000000'} 
                    placeholder="#000000" 
                    className="flex-grow" 
                  />
                </div>
              </FormControl>
              <FormDescription>Choose a color for this hero step.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <MultiImageUpload
                  onUpload={handleImageUpload}
                  defaultImages={imageUrl ? [imageUrl] : []}
                />
              </FormControl>
              <FormDescription>Upload an image for this hero step (Required)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  value={field.value || '1'}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  max={4} 
                />
              </FormControl>
              <FormDescription>The display order of this hero step.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isProcessing || form.formState.isSubmitting}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update Hero Step' : 'Create Hero Step'
          )}
        </Button>
      </form>
    </Form>
  )
}

