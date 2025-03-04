'use server'

import db from '@/app/db/db'
import { ApiResponse } from '@/types/hero'
import { Stat } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'
import { z } from 'zod'


const StatSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  value: z.number().positive("Value must be a positive number"), // Removed .int()
  icon: z.string().min(1, "Icon is required"),
  suffix_en: z.string().min(1, "English suffix is required").default("total"),
  suffix_ar: z.string().min(1, "Arabic suffix is required").default("إجمالي"),
})

export type StatFormData = z.infer<typeof StatSchema>

export async function createStat(data: StatFormData): Promise<ApiResponse<Stat>> {
  try {
    const validatedData = StatSchema.parse(data)
    const newStat = await db.stat.create({ data: validatedData })
    revalidatePath('/admin/pages/stats')
    revalidatePath('/')
    return { success: true, data: newStat }
  } catch (error) {
    console.error("Error creating stat:", error)
    return { 
      success: false, 
      error: error instanceof z.ZodError 
        ? error.errors.map(e => e.message).join(", ")
        : "Failed to create stat" 
    }
  }
}

export async function updateStat(id: string, data: StatFormData): Promise<ApiResponse<Stat>> {
  try {
    const validatedData = StatSchema.parse(data)
    const updatedStat = await db.stat.update({ 
      where: { id }, 
      data: validatedData 
    })
    revalidatePath('/admin/pages/stats')
    revalidatePath('/')
    return { success: true, data: updatedStat }
  } catch (error) {
    console.error("Error updating stat:", error)
    return { 
      success: false, 
      error: error instanceof z.ZodError 
        ? error.errors.map(e => e.message).join(", ")
        : "Failed to update stat" 
    }
  }
}

export async function deleteStat(id: string) {
  await db.stat.delete({ where: { id } })
  revalidatePath('/admin/pages/stats')
  revalidatePath('/')
}

export const getStats = cache(async (): Promise<ApiResponse<Stat[]>> => {
  try {
    const stats = await db.stat.findMany()

    return {
      success: true,
      data: stats,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      success: false,
      error: "Failed to fetch stats",
    }
  }
})

export const getStat = cache(async (id: string): Promise<ApiResponse<Stat>> => {
  try {
    const stat = await db.stat.findUnique({
      where: { id }
    })

    if (!stat) {
      return {
        success: false,
        error: "Stat not found"
      }
    }

    return {
      success: true,
      data: stat
    }
  } catch (error) {
    console.error("Error fetching stat:", error)
    return {
      success: false,
      error: "Failed to fetch stat"
    }
  }
})
