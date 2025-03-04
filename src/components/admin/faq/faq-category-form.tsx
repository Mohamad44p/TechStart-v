'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { createFaqCategory, updateFaqCategory, type FaqCategoryFormData } from '@/app/actions/pages/faqActions'
import { ProgramDialog } from '../program-tap/ProgramDialog'
import { SimpleProgramType } from "@/types/program-tab";

const formSchema = z.object({
  nameEn: z.string().min(1, 'English name is required'),
  nameAr: z.string().min(1, 'Arabic name is required'),
  slug: z.string().min(1, 'Slug is required'),
  order: z.number().int().default(0),
  programId: z.string().optional().nullable(),
})

interface FaqCategoryFormProps {
  initialData?: FaqCategoryFormData & { id?: string };
  programs?: SimpleProgramType[];
}

export function FaqCategoryForm({ 
  initialData, 
  programs: initialPrograms = [] 
}: FaqCategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [programs, setPrograms] = useState<SimpleProgramType[]>(initialPrograms)

  const form = useForm<FaqCategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nameEn: '',
      nameAr: '',
      slug: '',
      order: 0,
      programId: null,
    },
  })

  const onSubmit = async (data: FaqCategoryFormData) => {
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        await updateFaqCategory(initialData.id, data)
        toast({
          title: 'Success',
          description: 'FAQ category updated successfully.',
        })
      } else {
        await createFaqCategory(data)
        toast({
          title: 'Success',
          description: 'FAQ category created successfully.',
        })
      }
      router.push('/admin/pages/faq')
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

  const handleProgramUpdate = (updatedPrograms: SimpleProgramType[]) => {
    setPrograms(updatedPrograms)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Name</FormLabel>
                  <FormControl>
                    <Input {...field} dir="rtl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="programId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                    value={field.value || "none"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program">
                          {field.value ? programs.find(p => p.id === field.value)?.name_en : "None"}
                        </SelectValue>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">
                        None
                      </SelectItem>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ProgramDialog programs={programs} onProgramsUpdate={handleProgramUpdate} />

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/pages/faq')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : initialData ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  )
}