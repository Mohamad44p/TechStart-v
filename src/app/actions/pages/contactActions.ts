"use server";

import db from "@/app/db/db";
import { revalidatePath } from "next/cache";
import { contactInfoSchema, type ContactInfoInput } from "@/lib/schema/contact-info";

export async function getContactInfo() {
  try {
    const contactInfo = await db.contactInfo.findFirst();
    return { data: contactInfo, error: null };
  } catch (error) {
    console.error("Error fetching contact info:", error);
    return { data: null, error: "Failed to fetch contact information" };
  }
}

//te

export async function updateContactInfo(input: ContactInfoInput) {
  try {
    const validatedData = contactInfoSchema.parse(input);
    
    const existingContact = await db.contactInfo.findFirst();
    
    if (existingContact) {
      const updatedContact = await db.contactInfo.update({
        where: { id: existingContact.id },
        data: validatedData,
      });
      revalidatePath("/Contact-us");
      return { data: updatedContact, error: null };
    } else {
      const newContact = await db.contactInfo.create({
        data: validatedData,
      });
      revalidatePath("/Contact-us");
      return { data: newContact, error: null };
    }
  } catch (error) {
    console.error("Error updating contact info:", error);
    return { data: null, error: "Failed to update contact information" };
  }
} 