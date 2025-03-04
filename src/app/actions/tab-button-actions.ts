"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"

interface TabButtonInput {
  name_en: string;
  name_ar: string;
  content_en: string;
  content_ar: string;
  order: number;
  tabId: string;
}

export async function createTabButton(data: TabButtonInput) {
  try {
    const button = await db.tabButton.create({
      data
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, button };
  } catch (error) {
    console.error("Failed to create tab button:", error);
    return { error: "Failed to create tab button" };
  }
}

export async function updateTabButton(id: string, data: Partial<TabButtonInput>) {
  try {
    const button = await db.tabButton.update({
      where: { id },
      data
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, button };
  } catch (error) {
    console.error("Failed to update tab button:", error);
    return { error: "Failed to update tab button" };
  }
}

export async function deleteTabButton(id: string) {
  try {
    await db.tabButton.delete({
      where: { id }
    });

    revalidatePath("/admin/program-tabs");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete tab button:", error);
    return { error: "Failed to delete tab button" };
  }
}
