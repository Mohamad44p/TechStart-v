"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import { cache } from "react"

async function processFormData(formData: FormData) {
  return {
    domain: formData.get("domain")?.toString() || "",
    title_en: formData.get("title_en")?.toString() || "",
    title_ar: formData.get("title_ar")?.toString() || "",
    tagline_en: formData.get("tagline_en")?.toString() || "",
    tagline_ar: formData.get("tagline_ar")?.toString() || "",
    description_en: formData.get("description_en")?.toString() || "",
    description_ar: formData.get("description_ar")?.toString() || "",
    longDescription_en: formData.get("longDescription_en")?.toString() || "",
    longDescription_ar: formData.get("longDescription_ar")?.toString() || "",
    bgColor: formData.get("bgColor")?.toString() || "from-gray-100 to-gray-200",
    attachmentUrl: formData.get("attachmentUrl")?.toString() || "",
    imageUrl: formData.get("imageUrl")?.toString() || "",
    order: parseInt(formData.get("order")?.toString() || "1", 10),
  }
}

export async function createSafeguard(formData: FormData) {
  try {
    const data = await processFormData(formData)
    const safeguard = await db.safeguard.create({ data })
    revalidatePath("/admin/safeguards")
    return { success: true, data: safeguard }
  } catch (error) {
    console.error("Create safeguard error:", error)
    return { success: false, error: "Failed to create safeguard" }
  }
}

export async function updateSafeguard(id: string, formData: FormData) {
  try {
    const data = await processFormData(formData)
    const safeguard = await db.safeguard.update({
      where: { id },
      data,
    })
    revalidatePath("/admin/safeguards")
    return { success: true, data: safeguard }
  } catch (error) {
    console.error("Update safeguard error:", error)
    return { success: false, error: "Failed to update safeguard" }
  }
}

export async function deleteSafeguard(id: string) {
  try {
    await db.safeguard.delete({
      where: { id },
    })
    revalidatePath("/admin/safeguards")
    return { success: true }
  } catch (error) {
    console.error("Delete safeguard error:", error)
    return { success: false, error: "Failed to delete safeguard" }
  }
}

export const getSingleSafeguard = cache(async () => {
  try {
    const safeguard = await db.safeguard.findFirst({
      orderBy: { createdAt: "desc" },
    })

    return { success: true, data: safeguard }
  } catch (error) {
    console.error("Fetch safeguard error:", error)
    return { success: false, error: "Failed to fetch safeguard" }
  }
})

export const getSafeguards = cache(async () => {
  try {
    const safeguards = await db.safeguard.findMany({
      orderBy: { order: "asc" },
    })

    return { success: true, data: safeguards }
  } catch (error) {
    console.error("Fetch safeguards error:", error)
    return { success: false, error: "Failed to fetch safeguards" }
  }
})