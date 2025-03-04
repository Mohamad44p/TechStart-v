"use server"

import db from "@/app/db/db"
import type { ProgramsResponse } from "@/types/program-tab"

export async function getPrograms(): Promise<ProgramsResponse> {
  try {
    const programs = await db.programsPages.findMany({
      select: {
        id: true,
        name_en: true,
        name_ar: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name_en: true,
            name_ar: true
          }
        }
      },
    });
    
    return { 
      success: true, 
      programs 
    };
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return { success: false, programs: [] };
  }
}

export async function getProgramBySlug(slug: string) {
  try {
    const program = await db.programsPages.findFirst({
      where: { id: slug },
      include: {
        ProgramsHero: true,
        ProgramTab: {
          orderBy: { createdAt: 'asc' }
        }
      }
    })
    return { success: true, program }
  } catch (error) {
    console.error("Failed to fetch program:", error)
    return { error: "Failed to fetch program" }
  }
}
