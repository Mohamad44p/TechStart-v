"use server"

import { revalidatePath } from "next/cache"
import type { PartnerPageFormInput } from "@/lib/schema/partnerPageSchema"
import { cache } from "react"
import db from "@/app/db/db"

export async function createPartnerPage(data: PartnerPageFormInput) {
  try {
    const partnerPage = await db.partnerPage.create({
      data: {
        title_en: data.title_en,
        title_ar: data.title_ar,
        imageUrl: data.imageUrl,
        websiteUrl: data.websiteUrl,
        type: data.type,
        order: data.order,
      },
    })
    revalidatePath("/admin/pages/partners")
    return { success: true, data: partnerPage }
  } catch (error) {
    console.error("Create partner page error:", error)
    return { success: false, error: "Failed to create partner page" }
  }
}

export async function updatePartnerPage(id: string, data: PartnerPageFormInput) {
  try {
    const partnerPage = await db.partnerPage.update({
      where: { id },
      data: {
        title_en: data.title_en,
        title_ar: data.title_ar,
        imageUrl: data.imageUrl,
        websiteUrl: data.websiteUrl,
        type: data.type,
        order: data.order,
      },
    })
    revalidatePath("/admin/pages/partners")
    return { success: true, data: partnerPage }
  } catch (error) {
    console.error("Update partner page error:", error)
    return { success: false, error: "Failed to update partner page" }
  }
}

export async function deletePartnerPage(id: string) {
  try {
    await db.partnerPage.delete({
      where: { id },
    })
    revalidatePath("/admin/pages/partners")
    return { success: true }
  } catch (error) {
    console.error("Delete partner page error:", error)
    return { success: false, error: "Failed to delete partner page" }
  }
}

export const getPartnerPages = cache(async () => {
  try {
    const partnerPages = await db.partnerPage.findMany({
      orderBy: { order: "asc" },
    })
    return { success: true, data: partnerPages }
  } catch (error) {
    console.error("Fetch partner pages error:", error)
    return { success: false, error: "Failed to fetch partner pages" }
  }
})
