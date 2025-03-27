"use server";

import db from "@/app/db/db";
import { revalidatePath } from "next/cache";
import { sendContactFormNotification } from "@/utils/email";
import { PaginatedResult, PaginationParams } from "@/types/pagination";
import { Prisma } from "@prisma/client";

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmission extends ContactFormData {
  id: string;
  status: string;
  createdAt: Date;
}

export async function submitContactForm(
  data: ContactFormData
): Promise<ContactSubmission> {
  const submission = await db.contactSubmission.create({
    data: {
      ...data,
      status: "new",
    },
  });

  // Send email notification to admins
  try {
    await sendContactFormNotification({
      ...data,
      id: submission.id,
    });
  } catch (error) {
    console.error("Failed to send email notification:", error);
    // Continue even if email fails, we've already saved to DB
  }

  revalidatePath("/admin/pages/contact-submissions");
  return submission;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getPaginatedContactSubmissions(params?: PaginationParams): Promise<PaginatedResult<ContactSubmission>> {
  try {
    // Ensure params is always an object with default values
    const safeParams = {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
      sortBy: params?.sortBy ?? 'createdAt',
      sortOrder: (params?.sortOrder ?? 'desc') as 'asc' | 'desc',
      search: params?.search ?? ''
    };

    // Calculate skip value for pagination
    const skip = (safeParams.page - 1) * safeParams.pageSize;

    // Build where clause for search
    const where = safeParams.search
      ? {
          OR: [
            { name: { contains: safeParams.search, mode: Prisma.QueryMode.insensitive } },
            { email: { contains: safeParams.search, mode: Prisma.QueryMode.insensitive } },
            { subject: { contains: safeParams.search, mode: Prisma.QueryMode.insensitive } },
            { message: { contains: safeParams.search, mode: Prisma.QueryMode.insensitive } },
            { status: { contains: safeParams.search, mode: Prisma.QueryMode.insensitive } },
          ],
        }
      : {};

    // Get total count for pagination
    const total = await db.contactSubmission.count({ where });

    // Get paginated data
    const submissions = await db.contactSubmission.findMany({
      where,
      orderBy: { [safeParams.sortBy]: safeParams.sortOrder },
      skip,
      take: safeParams.pageSize,
    });

    // Calculate total pages
    const totalPages = Math.ceil(total / safeParams.pageSize);

    // Return formatted result for the DataTable component
    return {
      data: submissions,
      total,
      page: safeParams.page,
      pageSize: safeParams.pageSize,
      totalPages,
    };
  } catch (error) {
    console.error('Error fetching paginated contact submissions:', error);
    throw error;
  }
}

export async function updateSubmissionStatus(
  id: string,
  status: string
): Promise<void> {
  await db.contactSubmission.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/pages/contact-submissions");
}

export async function deleteContactSubmission(id: string): Promise<void> {
  await db.contactSubmission.delete({
    where: { id },
  });

  revalidatePath("/admin/pages/contact-submissions");
}

export async function getContactSubmission(id: string) {
  try {
    const submission = await db.contactSubmission.findUnique({
      where: { id },
    })
    return submission
  } catch (error) {
    console.error("Error fetching contact submission:", error)
    return null
  }
}
