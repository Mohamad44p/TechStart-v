"use server"

import db from "@/app/db/db"
import { revalidatePath } from "next/cache"
import { Focusarea } from "@/types/focusarea"
import { PaginatedResult, PaginationParams } from "@/types/pagination"

export type FocusareaData = {
  titleEn: string
  titleAr: string
  descriptionEn: string
  descriptionAr: string
  cards: {
    titleEn: string
    titleAr: string
    imageUrl: string
    buttonUrl?: string | null
  }[]
}

export async function getFocusareas(): Promise<Focusarea[]> {
  const focusareas = await db.focusarea.findMany({
    include: {
      cards: true,
    },
  })
  return focusareas as Focusarea[]
}

export async function getPaginatedFocusareas(params?: PaginationParams): Promise<PaginatedResult<Focusarea>> {
  try {
    const safeParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      sortBy: params?.sortBy ?? 'createdAt',
      sortOrder: (params?.sortOrder ?? 'desc') as 'asc' | 'desc',
      search: params?.search ?? ''
    };

    const skip = (safeParams.page - 1) * safeParams.pageSize;

    const where = safeParams.search
      ? {
          OR: [
            { titleEn: { contains: safeParams.search, mode: 'insensitive' } },
            { titleAr: { contains: safeParams.search, mode: 'insensitive' } },
            { descriptionEn: { contains: safeParams.search, mode: 'insensitive' } },
            { descriptionAr: { contains: safeParams.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const total = await db.focusarea.count({ where });

    const focusareas = await db.focusarea.findMany({
      where,
      include: {
        cards: true,
      },
      orderBy: { [safeParams.sortBy]: safeParams.sortOrder },
      skip,
      take: safeParams.pageSize,
    });

    const totalPages = Math.ceil(total / safeParams.pageSize);

    return {
      data: focusareas as Focusarea[],
      total,
      page: safeParams.page,
      pageSize: safeParams.pageSize,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching paginated focus areas:', error);
    throw error;
  }
}

export async function getFocusareaById(id: string) {
  return db.focusarea.findUnique({
    where: { id },
    include: {
      cards: true,
    },
  })
}

export async function createFocusarea(data: FocusareaData) {
  const { cards, ...focusareaData } = data

  const createdFocusarea = await db.focusarea.create({
    data: {
      ...focusareaData,
      cards: {
        create: cards.map(card => ({
          ...card
        })),
      },
    },
    include: {
      cards: true,
    },
  })

  revalidatePath("/admin/pages/focusareas")
  return createdFocusarea
}

export async function updateFocusarea(id: string, data: FocusareaData) {
  const { cards, ...focusareaData } = data

  const updatedFocusarea = await db.focusarea.update({
    where: { id },
    data: {
      ...focusareaData,
      cards: {
        deleteMany: {},
        create: cards,
      },
    },
    include: {
      cards: true,
    },
  })

  revalidatePath("/admin/pages/focusareas")
  return updatedFocusarea
}

export async function deleteFocusarea(id: string) {
  await db.focusarea.delete({
    where: { id },
  })

  revalidatePath("/admin/pages/focusareas")
}

