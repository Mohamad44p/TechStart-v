"use server"

import { createPostSchema, PostType } from "@/lib/schema/schema"
import db from "../db/db"
import { revalidatePath } from "next/cache"

export async function createPost(formData: FormData) {
  if (!formData) {
    return { error: "Invalid form data" }
  }

  const data = {
    slug: formData.get("slug"),
    type: formData.get("type"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    description_en: formData.get("description_en") || "",
    description_ar: formData.get("description_ar") || "",
    content_en: formData.get("content_en") || "",
    content_ar: formData.get("content_ar") || "",
    pdfUrl: formData.get("pdfUrl"),
    imageUrl: formData.get("imageUrl"),
    readTime: formData.get("readTime") || "",
    published: formData.get("published") === "true",
    featured: formData.get("featured") === "true",
    tags: formData.getAll("tags"),
  }

  const validatedFields = createPostSchema.safeParse(data)

  if (!validatedFields.success) {
    console.error("Validation error:", validatedFields.error)
    return { error: validatedFields.error.flatten().fieldErrors }
  }

  try {
    const prismaData = {
      ...validatedFields.data,
      imageUrl: validatedFields.data.imageUrl || null,
      pdfUrl: validatedFields.data.pdfUrl || null,
      content_en: validatedFields.data.type === PostType.PUBLICATION 
        ? "" 
        : (validatedFields.data.content_en || ""),
      content_ar: validatedFields.data.type === PostType.PUBLICATION 
        ? "" 
        : (validatedFields.data.content_ar || ""),
      tags: {
        connect: validatedFields.data.tags.map((tagId) => ({ 
          id: parseInt(tagId, 10)
        })),
      },
    } as const;

    const post = await db.post.create({
      data: prismaData
    });

    revalidatePath("/admin/blog")
    return { success: true, post }
  } catch (error) {
    console.error("Failed to create post:", error)
    return { error: "Failed to create post" }
  }
}

