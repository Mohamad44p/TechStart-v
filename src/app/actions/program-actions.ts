"use server"

import { revalidatePath } from "next/cache"
import db from "@/app/db/db"
import type { CreateProgramInput, UpdateProgramInput, ProgramCategory } from "@/types/program-tab"

export async function getCategories(): Promise<{ 
  success: boolean; 
  categories: Omit<ProgramCategory, 'programs'>[]; 
  error?: string;
}> {
  try {
    const categories = await db.programCategory.findMany({
      orderBy: { order: 'asc' }
    });
    return { success: true, categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return { success: false, categories: [], error: "Failed to fetch categories" };
  }
}

export async function createCategory(data: { name_en: string; name_ar: string }) {
  try {
    const newCategory = await db.programCategory.create({
      data: {
        name_en: data.name_en,
        name_ar: data.name_ar,
        order: 0
      }
    });

    const categories = await db.programCategory.findMany({
      orderBy: { order: 'asc' }
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, categories, newCategory };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "Failed to create category", categories: [], newCategory: undefined };
  }
}

export async function updateCategory(data: { id: string; name_en: string; name_ar: string }) {
  try {
    await db.programCategory.update({
      where: { id: data.id },
      data: {
        name_en: data.name_en,
        name_ar: data.name_ar,
      },
    });

    const categories = await db.programCategory.findMany({
      orderBy: { order: 'asc' }
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, categories };
  } catch (error) {
    console.error("Failed to update category:", error);
    return { success: false, error: "Failed to update category", categories: [] };
  }
}

export async function deleteCategory(id: string) {
  try {
    await db.programCategory.delete({
      where: { id },
    });

    const categories = await db.programCategory.findMany({
      orderBy: { order: 'asc' }
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, categories };
  } catch (error) {
    console.error("Failed to delete category:", error);
    return { success: false, error: "Failed to delete category", categories: [] };
  }
}

export async function createProgram(data: CreateProgramInput) {
  try {
    await db.programsPages.create({
      data: {
        name_en: data.name_en,
        name_ar: data.name_ar,
        categoryId: data.categoryId
      },
    });

    const programs = await db.programsPages.findMany({
      include: {
        category: true
      }
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, programs };
  } catch (error) {
    console.error("Failed to create program:", error);
    return { error: "Failed to create program" };
  }
}

export async function updateProgram(data: UpdateProgramInput) {
  try {
    await db.programsPages.update({
      where: { id: data.id },
      data: {
        name_en: data.name_en,
        name_ar: data.name_ar,
        categoryId: data.categoryId
      },
    });

    const programs = await db.programsPages.findMany({
      include: {
        category: true
      }
    });

    revalidatePath("/admin/program-tabs");
    return { success: true, programs };
  } catch (error) {
    console.error("Failed to update program:", error);
    return { error: "Failed to update program" };
  }
}

export async function deleteProgram(id: string) {
  try {
    await db.programsPages.delete({
      where: { id },
    })

    const programs = await db.programsPages.findMany()

    revalidatePath("/admin/program-tabs")
    return { success: true, programs }
  } catch (error) {
    console.error("Failed to delete program:", error)
    return { error: "Failed to delete program" }
  }
}

export async function getProgramsWithHero() {
  try {
    const programs = await db.programsPages.findMany({
      include: {
        ProgramsHero: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return { 
      success: true, 
      data: programs.map(program => ({
        id: program.id,
        name_en: program.name_en,
        name_ar: program.name_ar,
        description_en: program.ProgramsHero[0]?.description_en || '',
        description_ar: program.ProgramsHero[0]?.description_ar || '',
        imageUrl: program.ProgramsHero[0]?.imageUrl || ''
      }))
    };
  } catch (error) {
    console.error("Failed to fetch programs with hero:", error);
    return { success: false, error: "Failed to fetch programs" };
  }
}

