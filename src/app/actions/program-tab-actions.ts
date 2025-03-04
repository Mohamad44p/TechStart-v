"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import type { CreateProgramTabInput, UpdateProgramTabInput } from "@/types/program-tab"

export async function createProgramTab(data: CreateProgramTabInput) {
  try {
    const { buttons = [], ...tabData } = data;
    
    console.log('Creating program tab with buttons:', buttons); // Debug log

    const programTab = await db.programTab.create({
      data: {
        ...tabData,
        processFile: tabData.processFile || null,
        buttons: {
          create: buttons.map((button, index) => ({
            name_en: button.name_en,
            name_ar: button.name_ar,
            content_en: button.content_en,
            content_ar: button.content_ar,
            order: index,
          }))
        }
      },
      include: {
        programPage: true,
        buttons: true,
      },
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, programTab };
  } catch (error) {
    console.error("Failed to create program tab:", error);
    return { error: "Failed to create program tab" };
  }
}

export async function updateProgramTab(data: UpdateProgramTabInput) {
  try {
    const { buttons = [], id, ...tabData } = data;

    console.log('Updating program tab with buttons:', buttons); // Debug log

    // First delete existing buttons
    await db.tabButton.deleteMany({
      where: { tabId: id }
    });

    // Then update the tab with new buttons
    const programTab = await db.programTab.update({
      where: { id },
      data: {
        ...tabData,
        processFile: tabData.processFile || null,
        buttons: {
          create: buttons.map((button, index) => ({
            name_en: button.name_en,
            name_ar: button.name_ar,
            content_en: button.content_en,
            content_ar: button.content_ar,
            order: index,
          }))
        }
      },
      include: {
        programPage: true,
        buttons: true,
      },
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, programTab };
  } catch (error) {
    console.error("Failed to update program tab:", error);
    return { error: "Failed to update program tab" };
  }
}

export async function deleteProgramTab(id: string) {
  try {
    await db.programTab.delete({
      where: { id },
    })

    revalidatePath("/admin/program-tabs")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete program tab:", error)
    return { error: "Failed to delete program tab" }
  }
}

