"use server"

import db from "@/app/db/db"
import { revalidatePath } from "next/cache"

export type WorkType = "Procurement" | "Recruitment"

export interface WorkWithUsData {
  type: WorkType
  titleEn: string
  titleAr: string
  iconName: string
  descriptionEn: string
  descriptionAr: string
  tags: string
  deadline: Date
  applyLink?: string | null  // Add this field
}

export interface WorkWithUsListing extends WorkWithUsData {
  id: string
  createdAt: Date
  updatedAt: Date
}

export async function getWorkWithUsListings(type?: WorkType): Promise<WorkWithUsListing[]> {
  return db.workWithUs.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
  })
}

export async function getWorkWithUsListingById(id: string): Promise<WorkWithUsListing | null> {
  return db.workWithUs.findUnique({
    where: { id },
  })
}

export async function createWorkWithUsListing(data: WorkWithUsData): Promise<WorkWithUsListing> {
  const createdListing = await db.workWithUs.create({
    data,
  })

  revalidatePath("/admin/pages/work-with-us")
  return createdListing
}

export async function updateWorkWithUsListing(id: string, data: WorkWithUsData): Promise<WorkWithUsListing> {
  const updatedListing = await db.workWithUs.update({
    where: { id },
    data,
  })

  revalidatePath("/admin/pages/work-with-us")
  return updatedListing
}

export async function deleteWorkWithUsListing(id: string): Promise<void> {
  await db.workWithUs.delete({
    where: { id },
  })

  revalidatePath("/admin/pages/work-with-us")
}

