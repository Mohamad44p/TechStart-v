/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import db from "@/app/db/db"
import { revalidatePath } from "next/cache"
import { PaginationParams, PaginatedResult } from "@/types/pagination"

export type TeamMemberData = {
  nameEn: string
  nameAr: string
  jobTitleEn: string
  jobTitleAr: string
  imageUrl: string
  linkedinUrl?: string
}

export async function getTeamMembers(params?: PaginationParams): Promise<PaginatedResult<any>> {
  try {
    // Ensure params is always an object with default values
    const safeParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      sortBy: params?.sortBy ?? 'createdAt',
      sortOrder: (params?.sortOrder ?? 'asc') as 'asc' | 'desc',
      search: params?.search ?? ''
    };

    // Calculate skip value for pagination
    const skip = (safeParams.page - 1) * safeParams.pageSize;

    // Build where clause for search
    const where = safeParams.search
      ? {
          OR: [
            { nameEn: { contains: safeParams.search, mode: 'insensitive' } },
            { nameAr: { contains: safeParams.search, mode: 'insensitive' } },
            { jobTitleEn: { contains: safeParams.search, mode: 'insensitive' } },
            { jobTitleAr: { contains: safeParams.search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Get total count for pagination
    const total = await db.teamMember.count({ where: where as any });

    // Get paginated data
    const teamMembers = await db.teamMember.findMany({
      where: where as any,
      orderBy: { [safeParams.sortBy]: safeParams.sortOrder },
      skip,
      take: safeParams.pageSize,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / safeParams.pageSize);

    return {
      data: teamMembers,
      total,
      page: safeParams.page,
      pageSize: safeParams.pageSize,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
}

export async function getAllTeamMembers() {
  try {
    return await db.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    })
  } catch (error) {
    console.error('Error fetching all team members:', error)
    throw error
  }
}

export async function getTeamMemberById(id: string) {
  try {
    return await db.teamMember.findUnique({
      where: { id },
    })
  } catch (error) {
    console.error(`Error fetching team member with id ${id}:`, error)
    throw error
  }
}

export async function createTeamMember(data: TeamMemberData) {
  try {
    const createdTeamMember = await db.teamMember.create({
      data,
    })

    revalidatePath("/admin/pages/team")
    return createdTeamMember
  } catch (error) {
    console.error('Error creating team member:', error)
    throw error
  }
}

export async function updateTeamMember(id: string, data: TeamMemberData) {
  try {
    const updatedTeamMember = await db.teamMember.update({
      where: { id },
      data,
    })

    revalidatePath("/admin/pages/team")
    return updatedTeamMember
  } catch (error) {
    console.error(`Error updating team member with id ${id}:`, error)
    throw error
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await db.teamMember.delete({
      where: { id },
    })

    revalidatePath("/admin/pages/team")
  } catch (error) {
    console.error(`Error deleting team member with id ${id}:`, error)
    throw error
  }
}

