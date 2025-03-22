"use server";

import { createPostSchema, PostType } from "@/lib/schema/schema";
import { revalidatePath } from "next/cache";
import db from "../db/db";

export async function editPost(id: number, formData: FormData) {
  if (!formData || !id) {
    return { error: "Invalid form data or post ID" };
  }

  try {
    // Basic validation for required fields
    const slug = formData.get("slug")?.toString();
    const type = formData.get("type")?.toString();
    const title_en = formData.get("title_en")?.toString();
    const title_ar = formData.get("title_ar")?.toString();
    
    if (!slug || !type || !title_en || !title_ar) {
      return { error: "Required fields are missing" };
    }

    // Get all other fields
    const description_en = formData.get("description_en")?.toString() || "";
    const description_ar = formData.get("description_ar")?.toString() || "";
    const content_en = formData.get("content_en")?.toString() || "";
    const content_ar = formData.get("content_ar")?.toString() || "";
    const pdfUrl = formData.get("pdfUrl")?.toString() || null;
    const imageUrl = formData.get("imageUrl")?.toString() || null;
    const readTime = formData.get("readTime")?.toString() || "";
    const published = formData.get("published") === "true";
    const featured = formData.get("featured") === "true";
    const tags = formData.getAll("tags").map(tag => tag.toString());
    const publishedAt = formData.get("publishedAt")?.toString();
    
    // Create update data
    const updateData = {
      slug,
      type,
      title_en,
      title_ar,
      description_en,
      description_ar,
      content_en: type === PostType.PUBLICATION ? "" : content_en,
      content_ar: type === PostType.PUBLICATION ? "" : content_ar,
      pdfUrl,
      imageUrl,
      readTime,
      published,
      featured,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      tags: {
        set: tags.map(tagId => ({ id: parseInt(tagId, 10) })),
      },
    };

    // Update the post directly
    const post = await db.post.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/blog");
    return { success: true, post };
  } catch (error) {
    console.error("Failed to edit post:", error);
    return { error: "Failed to edit post" };
  }
}

