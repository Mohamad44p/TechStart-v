"use server"

import db from "@/app/db/db"
import type { ProgramCategory } from "@/types/program-tab"

interface NavbarProgramsResponse {
  success: boolean;
  categories: ProgramCategory[];
}

export async function getNavbarPrograms(): Promise<NavbarProgramsResponse> {
  try {
    const categories = await db.programCategory.findMany({
      where: {
        programs: {
          some: {} 
        }
      },
      include: {
        programs: {
          include: {
            ProgramTab: {
              select: {
                id: true,
                title_en: true,
                title_ar: true,
                slug: true,
                content_en: true,
                content_ar: true,
                processFile: true,
                programPageId: true,
                createdAt: true,
                updatedAt: true,
                buttons: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    return { 
      success: true, 
      categories
    };
  } catch (error) {
    console.error("Error fetching navbar programs:", error);
    return { success: false, categories: [] };
  }
}
