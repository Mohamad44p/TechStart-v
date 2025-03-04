"use server";

import { createGallerySchema } from "@/lib/schema/schema";
import { revalidatePath } from "next/cache";
import db from "../db/db";
import fs from 'fs/promises';
import path from 'path';
import { cache } from "react";

export async function createGallery(formData: FormData) {
  try {
    const imageUrls = formData.getAll("imageUrls") as string[];
    const imageTitles_en = formData.getAll("imageTitles_en") as string[];
    const imageTitles_ar = formData.getAll("imageTitles_ar") as string[];
    const imageFeatured = formData.getAll("imageFeatured").map(value => value === "true");

    const rawData = {
      title_en: formData.get("title_en"),
      title_ar: formData.get("title_ar"),
      date: formData.get("date"),
      imageUrls,
      imageTitles_en,
      imageTitles_ar,
      imageFeatured,
    };

    const validatedFields = createGallerySchema.safeParse(rawData);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.flatten().fieldErrors,
      };
    }

    const gallery = await db.gallery.create({
      data: {
        title_en: validatedFields.data.title_en,
        title_ar: validatedFields.data.title_ar,
        createdAt: new Date(validatedFields.data.date),
        images: {
          create: validatedFields.data.imageUrls.map((url, index) => ({
            url,
            title_en: (validatedFields.data.imageTitles_en ?? [])[index] || null,
            title_ar: (validatedFields.data.imageTitles_ar ?? [])[index] || null,
            featured: (validatedFields.data.imageFeatured ?? [])[index] || false,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    revalidatePath("/admin/ImageGallery");
    return { success: true, gallery };
  } catch (error) {
    console.error("Failed to create gallery:", error);
    return { success: false, error: "Failed to create gallery" };
  }
}

export async function deleteGallery(id: string) {
  try {
    const result = await db.$transaction(async (tx) => {
      const gallery = await tx.gallery.findUnique({
        where: { id },
        include: { images: true },
      });

      if (!gallery) {
        throw new Error('Gallery not found');
      }

      await tx.image.deleteMany({
        where: { galleryId: id },
      });

      await tx.gallery.delete({
        where: { id },
      });

      return gallery;
    });

    if (result.images) {
      for (const image of result.images) {
        if (!image.url) continue;
        const imagePath = path.join(process.cwd(), 'public', image.url.replace(/^\//, ''));
        try {
          await fs.access(imagePath);
          await fs.unlink(imagePath);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          console.log(`Could not delete file: ${imagePath}`);
        }
      }
    }

    revalidatePath('/admin/ImageGallery');
    return { success: true };

  } catch (error) {
    console.error('Error in deleteGallery:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete gallery'
    };
  }
}


export const getFeaturedImages = cache(async (limit = 4) => {
  try {
    const featuredImages = await db.image.findMany({
      where: { 
        featured: true,
      },
      take: limit,
      orderBy: { 
        createdAt: "desc" 
      },
      include: {
        gallery: {
          select: {
            title_en: true,
            title_ar: true
          }
        }
      }
    })
    if (!featuredImages.length) {
      console.log("No featured images found in database")
    }

    return { success: true, data: featuredImages }
  } catch (error) {
    console.error("Fetch featured images error:", error)
    return { success: false, error: "Failed to fetch featured images" }
  }
})


export const getGalleries = cache(async () => {
  try {
    const galleries = await db.gallery.findMany({
      include: {
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
    return { success: true, data: galleries }
  } catch (error) {
    console.error("Fetch galleries error:", error)
    return { success: false, error: "Failed to fetch galleries" }
  }
})