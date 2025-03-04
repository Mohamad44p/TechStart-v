"use server";

import db from "@/app/db/db";
import { revalidatePath } from "next/cache";

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

  revalidatePath("/admin/pages/contact-submissions");
  return submission;
}

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  return db.contactSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });
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
