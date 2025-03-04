"use server";

import { editGallerySchema } from "@/lib/schema/schema";
import { revalidatePath } from "next/cache";
import db from "../db/db";
import fs from 'fs/promises';
import path from 'path';

export async function editGallery(id: string, formData: FormData) {
  const rawData = {
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    date: formData.get("date"),
    imageUrls: formData.getAll("imageUrls"),
    imageTitles_en: formData.getAll("imageTitles_en"),
    imageTitles_ar: formData.getAll("imageTitles_ar"),
    imageFeatured: formData.getAll("imageFeatured").map(value => value === "true"),
    deletedImageIds: formData.getAll("deletedImageIds"),
  };

  const validatedFields = editGallerySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const existingGallery = await db.gallery.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingGallery) {
      return { success: false, error: "Gallery not found" };
    }

    for (const imageId of validatedFields.data.deletedImageIds) {
      const imageToDelete = existingGallery.images.find(img => img.id === imageId);
      if (imageToDelete) {
        const imagePath = path.join(process.cwd(), 'public', imageToDelete.url.replace(/^\//, ''));
        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.error(`Failed to delete image file: ${imagePath}`, error);
        }
      }
    }

    const updatedGallery = await db.gallery.update({
      where: { id },
      data: {
        title_en: validatedFields.data.title_en,
        title_ar: validatedFields.data.title_ar,
        createdAt: new Date(validatedFields.data.date),
        images: {
          deleteMany: {
            id: { in: validatedFields.data.deletedImageIds },
          },
          upsert: validatedFields.data.imageUrls.map((url, index) => ({
            where: { id: existingGallery.images[index]?.id || 'new-image' },
            update: {
              url,
              title_en: (validatedFields.data.imageTitles_en ?? [])[index] || null,
              title_ar: (validatedFields.data.imageTitles_ar ?? [])[index] || null,
              featured: (validatedFields.data.imageFeatured ?? [])[index] || false,
            },
            create: {
              url,
              title_en: (validatedFields.data.imageTitles_en ?? [])[index] || null,
              title_ar: (validatedFields.data.imageTitles_ar ?? [])[index] || null,
              featured: (validatedFields.data.imageFeatured ?? [])[index] || false,
            },
          })),
        },
      },
      include: {
        images: true,
      },
    });

    revalidatePath("/admin/ImageGallery");
    return { success: true, gallery: updatedGallery };
  } catch (error) {
    console.error("Failed to edit gallery:", error);
    return { success: false, error: "Failed to edit gallery" };
  }
}

