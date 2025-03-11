/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import { BeneficiaryFormInput, CategoryFormInput } from "@/lib/schema/beneficiarySchema"
import db from "@/app/db/db"
import slugify from "slugify"
import { cache } from 'react'
import type { ApiResponse, Beneficiary, Category } from '@/types/beneficiary'

export async function createBeneficiary(formData: FormData) {
  const buttonText = formData.get("buttonText")?.toString() || "";
  const buttonLink = formData.get("buttonLink")?.toString() || "";
  
  const data = {
    title_en: formData.get("title_en")?.toString() || "",
    title_ar: formData.get("title_ar")?.toString() || "",
    description_en: formData.get("description_en")?.toString() || null,
    description_ar: formData.get("description_ar")?.toString() || null,
    imageUrl: formData.get("imageUrl")?.toString() || "",
    buttonText: buttonText.trim() === "" ? null : buttonText,
    buttonLink: buttonLink.trim() === "" ? null : buttonLink,
    categoryId: formData.get("categoryId")?.toString() || "",
  }

  try {
    const beneficiary = await db.beneficiary.create({
      data,
    })
    revalidatePath("/admin/beneficiaries")
    return { success: true, data: beneficiary }
  } catch (error) {
    return { success: false, error: "Failed to create beneficiary" }
  }
}

export async function updateBeneficiary(id: string, formData: FormData) {
  const buttonText = formData.get("buttonText")?.toString() || "";
  const buttonLink = formData.get("buttonLink")?.toString() || "";
  
  const data = {
    title_en: formData.get("title_en")?.toString() || "",
    title_ar: formData.get("title_ar")?.toString() || "",
    description_en: formData.get("description_en")?.toString() || null,
    description_ar: formData.get("description_ar")?.toString() || null,
    imageUrl: formData.get("imageUrl")?.toString() || "",
    buttonText: buttonText.trim() === "" ? null : buttonText,
    buttonLink: buttonLink.trim() === "" ? null : buttonLink,
    categoryId: formData.get("categoryId")?.toString() || "",
  }

  try {
    const beneficiary = await db.beneficiary.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/beneficiaries")
    return { success: true, data: beneficiary }
  } catch (error) {
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
