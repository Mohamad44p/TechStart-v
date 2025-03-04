/* eslint-disable @typescript-eslint/no-unused-vars */
"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import type { CreateProgramsHeroInput, UpdateProgramsHeroInput } from "@/types/programs-hero"

export async function createProgramsHero(formData: CreateProgramsHeroInput | FormData) {
  try {
    let data: Record<string, any>;
    
    // Handle FormData or direct object input
    if (formData instanceof FormData) {
      // Convert FormData to object
      data = Object.fromEntries(formData.entries());
    } else if (Array.isArray(formData)) {
      // Handle array input (first item)
      data = formData[0];
    } else {
      // Direct object input
      data = formData;
    }
    
    // Validate data
    if (!data || typeof data !== 'object') {
      console.error("Invalid data format:", data);
      return { error: "Invalid input data format" };
    }

    // Clean the data - convert empty strings to null
    const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value === "" ? null : value;
      return acc;
    }, {} as Record<string, any>);

    // Extract specific fields
    const { 
      programPageId, 
      objectives_en, 
      objectives_ar,
      eligibility_en,
      eligibility_ar,
      ...otherData 
    } = cleanedData;

    // Validate required fields
    if (!otherData.title_en?.trim() || !otherData.title_ar?.trim()) {
      return { error: "Title in both English and Arabic is required" };
    }
    if (!otherData.description_en?.trim() || !otherData.description_ar?.trim()) {
      return { error: "Description in both English and Arabic is required" };
    }
    if (!otherData.tagline_en?.trim() || !otherData.tagline_ar?.trim()) {
      return { error: "Tagline in both English and Arabic is required" };
    }

    // Prepare data for database
    const createData: Record<string, any> = {
      ...otherData,
      objectives_en: objectives_en || null,
      objectives_ar: objectives_ar || null,
      eligibility_en: eligibility_en || null,
      eligibility_ar: eligibility_ar || null,
      card1Show: otherData.card1Show === "true" || otherData.card1Show === true,
      card2Show: otherData.card2Show === "true" || otherData.card2Show === true,
      card3Show: otherData.card3Show === "true" || otherData.card3Show === true,
    };

    // Handle programPageId if present
    if (programPageId && programPageId !== "null" && programPageId !== "") {
      createData.programPageId = programPageId;
    } else {
      createData.programPageId = null;
    }

    // Create the record
    const programsHero = await db.programsHero.create({
      data: createData,
      include: {
        programPage: true,
      },
    });

    revalidatePath("/admin/programs-hero");
    return { success: true, programsHero };
  } catch (error) {
    console.error("Failed to create programs hero:", error);
    if (error instanceof Error) {
      return { error: `Failed to create programs hero: ${error.message}` };
    }
    return { error: "Failed to create programs hero" };
  }
}

export async function updateProgramsHero(data: UpdateProgramsHeroInput) {
  try {
    // Handle array input
    const inputData = Array.isArray(data) ? data[0] : data;
    
    if (!inputData || !inputData.id) {
      return { error: "Invalid input: ID is required" };
    }

    const { 
      programPageId, 
      id, 
      objectives_en, 
      objectives_ar,
      eligibility_en,
      eligibility_ar, 
      ...updateData 
    } = inputData;

    const updatePayload = {
      ...updateData,
      objectives_en: objectives_en || null,
      objectives_ar: objectives_ar || null,
      eligibility_en: eligibility_en || null,
      eligibility_ar: eligibility_ar || null,
    };

    // Only include programPageId if it's provided and not null/empty
    if (programPageId && programPageId !== "null" && programPageId !== "") {
      updatePayload.programPageId = programPageId;
    } else {
      updatePayload.programPageId = null;
    }

    const programsHero = await db.programsHero.update({
      where: { id },
      data: updatePayload,
      include: {
        programPage: true
      }
    });

    revalidatePath("/admin/programs-hero");
    return { success: true, programsHero };
  } catch (error) {
    console.error("Failed to update programs hero:", error);
    if (error instanceof Error) {
      return { error: `Failed to update programs hero: ${error.message}` };
    }
    return { error: "Failed to update programs hero" };
  }
}

export async function deleteProgramsHero(id: string) {
  try {
    await db.programsHero.delete({
      where: { id },
    });

    revalidatePath("/admin/programs-hero");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete programs hero:", error);
    if (error instanceof Error) {
      return { error: `Failed to delete programs hero: ${error.message}` };
    }
    return { error: "Failed to delete programs hero" };
  }
}

export async function getProgramsHeroes() {
  try {
    const programsHeroes = await db.programsHero.findMany({
      include: { programPage: true },
    });
    return { success: true, programsHeroes };
  } catch (error) {
    console.error("Failed to fetch programs heroes:", error);
    if (error instanceof Error) {
      return { error: `Failed to fetch programs heroes: ${error.message}` };
    }
    return { error: "Failed to fetch programs heroes" };
  }
}

