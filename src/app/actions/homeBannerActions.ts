"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import { cache } from "react"

async function processFormData(formData: FormData) {
  return {
    title_en: formData.get("title_en")?.toString() || "",
    title_ar: formData.get("title_ar")?.toString() || "",
    bgColor: formData.get("bgColor")?.toString() || "#f3f4f6",
    buttonColor: formData.get("buttonColor")?.toString() || "#142451",
    imageUrl: formData.get("imageUrl")?.toString(),
    buttonText_en: formData.get("buttonText_en")?.toString() || "Learn More",
    buttonText_ar: formData.get("buttonText_ar")?.toString() || "اعرف المزيد",
  }
}

export async function updateHomeBanner(formData: FormData) {
  try {
    const data = await processFormData(formData)
    // Get the first banner or create one if it doesn't exist
    const banner = await db.homeBanner.upsert({
      where: { id: await getFirstBannerId() },
      update: data,
      create: data,
    })
    revalidatePath("/")
    return { success: true, data: banner }
  } catch (error) {
    console.error("Update banner error:", error)
    return { success: false, error: "Failed to update banner" }
  }
}

export const getHomeBanner = cache(async () => {
  try {
    const banner = await db.homeBanner.findFirst()
    return { success: true, data: banner }
  } catch (error) {
    console.error("Fetch banner error:", error)
    return { success: false, error: "Failed to fetch banner" }
  }
})

// Helper function to get the first banner ID
async function getFirstBannerId() {
  const banner = await db.homeBanner.findFirst()
  return banner?.id || 'default'
}
