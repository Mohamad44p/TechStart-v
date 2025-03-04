'use server'

import db from '@/app/db/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { cache } from 'react'
import { FaqCategory } from '@/types/faq'

const FaqCategorySchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  slug: z.string().min(1, "Slug is required"),
  order: z.number().int().default(0),
  programId: z.string().optional().nullable(),
})

const FaqItemSchema = z.object({
  questionEn: z.string().min(1, "English question is required"),
  questionAr: z.string().min(1, "Arabic question is required"),
  answerEn: z.string().min(1, "English answer is required"),
  answerAr: z.string().min(1, "Arabic answer is required"),
  categoryId: z.string().min(1, "Category is required"),
  order: z.number().int().default(0),
})

export type FaqCategoryFormData = z.infer<typeof FaqCategorySchema>
export type FaqItemFormData = z.infer<typeof FaqItemSchema>

// Category Actions
export async function createFaqCategory(data: FaqCategoryFormData) {
  const validatedData = FaqCategorySchema.parse(data)
  await db.faqCategory.create({
    data: {
      ...validatedData,
      programId: validatedData.programId || null,
    },
  })
  revalidatePath('/admin/pages/faq')
  revalidatePath('/')
}

export async function updateFaqCategory(id: string, data: FaqCategoryFormData) {
  const validatedData = FaqCategorySchema.parse(data)
  await db.faqCategory.update({
    where: { id },
    data: {
      ...validatedData,
      programId: validatedData.programId || null,
    },
  })
  revalidatePath('/admin/pages/faq')
  revalidatePath('/')
}

export async function deleteFaqCategory(id: string) {
  await db.faqCategory.delete({ where: { id } })
  revalidatePath('/admin/pages/faq')
  revalidatePath('/')
}

// Item Actions
export async function createFaqItem(data: FaqItemFormData) {
  const validatedData = FaqItemSchema.parse(data)
  await db.faqItem.create({ data: validatedData })
  revalidatePath('/admin/pages/faq')
  revalidatePath('/')
}

export async function updateFaqItem(id: string, data: FaqItemFormData) {
  const validatedData = FaqItemSchema.parse(data)
  await db.faqItem.update({ where: { id }, data: validatedData })
  revalidatePath('/admin/pages/faq')
  revalidatePath('/')
}

export async function deleteFaqItem(id: string) {
  await db.faqItem.delete({ where: { id } })
  revalidatePath('/admin/pages/faq')
  revalidatePath('/')
}

// Query Actions
export const getFaqCategories = cache(async (): Promise<FaqCategory[]> => {
  const categories = await db.faqCategory.findMany({
    include: { 
      faqs: {
        orderBy: { order: 'asc' }
      },
      program: {
        select: {
          id: true,
          name_en: true,
          name_ar: true,
        },
      },
    },
    orderBy: { order: 'asc' }
  })

  return categories as FaqCategory[]
})

export async function getFaqCategoryById(id: string) {
  return db.faqCategory.findUnique({
    where: { id },
    include: {
      faqs: true,
      program: {
        select: {
          id: true,
          name_en: true,
          name_ar: true,
        },
      },
    },
  });
}

export async function getFaqItemById(id: string) {
  return db.faqItem.findUnique({
    where: { id },
    include: { category: true }
  })
}
