/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { BeneficiaryFormInput, CategoryFormInput } from "@/lib/schema/beneficiarySchema"
import db from "@/app/db/db"
import slugify from "slugify"
import { cache } from 'react'
import type { ApiResponse, Beneficiary, Category } from '@/types/beneficiary'
import { PaginatedResult, PaginationParams } from "@/types/pagination"

export async function createBeneficiary(formData: FormData) {
  try {
    // Ensure required fields are present
    const title_en = formData.get("title_en")?.toString()
    const title_ar = formData.get("title_ar")?.toString()
    const imageUrl = formData.get("imageUrl")?.toString()
    const categoryId = formData.get("categoryId")?.toString()

    if (!title_en || !title_ar || !imageUrl || !categoryId) {
      return { 
        success: false, 
        error: "Required fields are missing" 
      }
    }

    // Get optional fields
    const description_en = formData.get("description_en")?.toString() || null
    const description_ar = formData.get("description_ar")?.toString() || null
    const ctaText = formData.get("ctaText")?.toString() || null
    const ctaLink = formData.get("ctaLink")?.toString() || null

    const data = {
      title_en,
      title_ar,
      imageUrl,
      categoryId,
      description_en,
      description_ar,
      ctaText,
      ctaLink,
    }

    const beneficiary = await db.beneficiary.create({
      data,
    })
    revalidatePath("/admin/beneficiaries")
    return { success: true, data: beneficiary }
  } catch (error) {
    console.error("Error creating beneficiary:", error)
    return { success: false, error: "Failed to create beneficiary" }
  }
}

export async function updateBeneficiary(id: string, formData: FormData) {
  try {
    // Ensure required fields are present
    const title_en = formData.get("title_en")?.toString()
    const title_ar = formData.get("title_ar")?.toString()
    const imageUrl = formData.get("imageUrl")?.toString()
    const categoryId = formData.get("categoryId")?.toString()

    if (!title_en || !title_ar || !imageUrl || !categoryId) {
      return { 
        success: false, 
        error: "Required fields are missing" 
      }
    }

    // Get optional fields
    const description_en = formData.get("description_en")?.toString() || null
    const description_ar = formData.get("description_ar")?.toString() || null
    const ctaText = formData.get("ctaText")?.toString() || null
    const ctaLink = formData.get("ctaLink")?.toString() || null

    const data = {
      title_en,
      title_ar,
      imageUrl,
      categoryId,
      description_en,
      description_ar,
      ctaText,
      ctaLink,
    }

    const beneficiary = await db.beneficiary.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/beneficiaries")
    return { success: true, data: beneficiary }
  } catch (error) {
    console.error("Error updating beneficiary:", error)
    return { success: false, error: "Failed to update beneficiary" }
  }
}

export async function deleteBeneficiary(id: string) {
  try {
    await db.beneficiary.delete({
      where: { id },
    })
    revalidatePath("/admin/beneficiaries")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete beneficiary" }
  }
}

export async function createCategory(data: CategoryFormInput) {
  try {
    const slug = slugify(data.name_en.toLowerCase())
    const category = await db.category.create({
      data: {
        ...data,
        slug,
      },
    })
    revalidatePath("/admin/categories")
    return { success: true, data: category }
  } catch (error) {
    return { success: false, error: "Failed to create category" }
  }
}

export const getBeneficiaries = cache(async (): Promise<ApiResponse<Beneficiary[]>> => {
  try {
    const beneficiaries = await db.beneficiary.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      data: beneficiaries,
    }
  } catch (error) {
    console.error("Error fetching beneficiaries:", error)
    return {
      success: false,
      error: "Failed to fetch beneficiaries",
    }
  }
})

export const getCategories = cache(async (): Promise<ApiResponse<Category[]>> => {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name_en: 'asc',
      },
    })

    return {
      success: true,
      data: categories,
    }
  } catch (error) {
    console.error("Error fetching categories:", error)
    return {
      success: false,
      error: "Failed to fetch categories",
    }
  }
})

export async function getPaginatedBeneficiaries(params?: PaginationParams): Promise<PaginatedResult<Beneficiary>> {
  try {
    // Ensure params is always an object with default values
    const safeParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      sortBy: params?.sortBy ?? 'createdAt',
      sortOrder: (params?.sortOrder ?? 'desc') as 'asc' | 'desc',
      search: params?.search ?? ''
    };

    // Calculate skip value for pagination
    const skip = (safeParams.page - 1) * safeParams.pageSize;

    // Build where clause for search
    const where = safeParams.search
      ? {
          OR: [
            { title_en: { contains: safeParams.search, mode: 'insensitive' } },
            { title_ar: { contains: safeParams.search, mode: 'insensitive' } },
            { description_en: { contains: safeParams.search, mode: 'insensitive' } },
            { description_ar: { contains: safeParams.search, mode: 'insensitive' } },
            { category: { 
              OR: [
                { name_en: { contains: safeParams.search, mode: 'insensitive' } },
                { name_ar: { contains: safeParams.search, mode: 'insensitive' } }
              ]
            }}
          ],
        }
      : {};

    // Get total count for pagination
    const total = await db.beneficiary.count({ where });

    // Get paginated data
    const beneficiaries = await db.beneficiary.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { [safeParams.sortBy]: safeParams.sortOrder },
      skip,
      take: safeParams.pageSize,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / safeParams.pageSize);

    // Return formatted result for the DataTable component
    return {
      data: beneficiaries,
      total,
      page: safeParams.page,
      pageSize: safeParams.pageSize,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching paginated beneficiaries:', error);
    throw error;
  }
}
