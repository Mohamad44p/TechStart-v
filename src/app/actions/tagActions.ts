"use server"

import { createTagSchema } from "@/lib/schema/schema"
import db from "../db/db"
import { revalidatePath } from "next/cache"

export async function createTag(input: { name_en: string; name_ar: string }) {
  try {
    const validatedFields = createTagSchema.safeParse(input)

    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors }
    }

    const tag = await db.tag.create({
      data: {
        name_en: input.name_en,
        name_ar: input.name_ar,
        slug: input.name_en.toLowerCase().replace(/\s+/g, "-"),
      },
    })
    
    revalidatePath("/admin/blog")
    return { 
      success: true, 
      data: { 
        id: tag.id.toString(),
        name_en: tag.name_en,
        name_ar: tag.name_ar,
      }
    }
  } catch (error) {
    console.error("Failed to create tag:", error)
    return { error: "Failed to create tag" }
  }
}

