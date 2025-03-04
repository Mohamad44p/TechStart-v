"use server";

import { revalidatePath } from "next/cache";
import { unlink } from 'fs/promises';
import path from 'path';
import db from "../db/db";

export async function deletePost(id: number) {
  try {
    const post = await db.post.findUnique({
      where: { id },
    });

    if (!post) {
      return { error: "Post not found" };
    }

    if (post.imageUrl) {
      const imagePath = path.join(process.cwd(), 'public', post.imageUrl);
      try {
        await unlink(imagePath);
      } catch (error) {
        console.error("Failed to delete image file:", error);
      }
    }

    await db.post.delete({
      where: { id },
    });

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { error: "Failed to delete post. Please try again." };
  }
}
