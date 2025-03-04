'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { createFaqItem, updateFaqItem } from '@/app/actions/pages/faqActions'
import { FaqItemSchema, type FaqItemFormData } from '@/types/faq'

interface FaqItemFormProps {
  categoryId: string
  initialData?: FaqItemFormData & { id?: string }
}

export function FaqItemForm({ categoryId, initialData }: FaqItemFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FaqItemFormData>({
    resolver: zodResolver(FaqItemSchema),
    defaultValues: initialData || {
      questionEn: '',
      questionAr: '',
      answerEn: '',
      answerAr: '',
      categoryId,
      order: 0,
    },
  })

  const onSubmit = async (data: FaqItemFormData) => {
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        await updateFaqItem(initialData.id, data)
        toast({
          title: 'Success',
          description: 'FAQ item updated successfully.',
        })
      } else {
        await createFaqItem(data)
        toast({
          title: 'Success',
          description: 'FAQ item created successfully.',
        })
      }
      router.push(`/admin/pages/faq/${categoryId}`)
      router.refresh()
    } catch (error) {
      console.error('Error submitting form:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="questionEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Question</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="questionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Question</FormLabel>
                  <FormControl>
                    <Textarea {...field} dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answerEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Answer</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answerAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Answer</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/admin/pages/faq/${categoryId}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : initialData ? 'Update Question' : 'Add Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}