/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { revalidatePath } from "next/cache";
import { FooterFormInput } from "@/lib/schema/footerSchema";
import db from "@/app/db/db";
import { PartnerType } from "@prisma/client";
import { cache } from "react";

export async function createFooter(data: FooterFormInput) {
  try {
    const footer = await db.footer.create({
      data: {
        techStartTitle_en: data.techStartTitle_en,
        techStartTitle_ar: data.techStartTitle_ar,
        titleColor: data.titleColor,
        gradientColor: data.gradientColor,
        instagram: data.instagram,
        linkedin: data.linkedin,
        facebook: data.facebook,
        youtube: data.youtube,
        twitter: data.twitter,
        partners: {
          create: [
            ...data.projectPartners.map((url, index) => ({
              type: PartnerType.PROJECT_OF,
              imageUrl: url,
              name_en: `Project Partner ${index + 1}`,
              name_ar: `شريك المشروع ${index + 1}`,
              order: index,
            })),
            ...data.fundedPartners.map((url, index) => ({
              type: PartnerType.FUNDED_BY,
              imageUrl: url,
              name_en: `Funded Partner ${index + 1}`,
              name_ar: `شريك التمويل ${index + 1}`,
              order: index,
            })),
            ...data.implementedPartners.map((url, index) => ({
              type: PartnerType.IMPLEMENTED_BY,
              imageUrl: url,
              name_en: `Implementation Partner ${index + 1}`,
              name_ar: `شريك التنفيذ ${index + 1}`,
              order: index,
            })),
          ],
        },
      },
    });
    revalidatePath("/admin/pages/footer");
    return { success: true, data: footer };
  } catch (error) {
    return { success: false, error: "Failed to create footer" };
  }
}

export async function updateFooter(id: string, data: FooterFormInput) {
  try {
    await db.partner.deleteMany({
      where: { footerId: id },
    });

    const footer = await db.footer.update({
      where: { id },
      data: {
        techStartTitle_en: data.techStartTitle_en,
        techStartTitle_ar: data.techStartTitle_ar,
        titleColor: data.titleColor,
        gradientColor: data.gradientColor,
        instagram: data.instagram,
        linkedin: data.linkedin,
        facebook: data.facebook,
        youtube: data.youtube,
        twitter: data.twitter,
        partners: {
          create: [
            ...data.projectPartners.map((url, index) => ({
              type: PartnerType.PROJECT_OF,
              imageUrl: url,
              name_en: `Project Partner ${index + 1}`,
              name_ar: `شريك المشروع ${index + 1}`,
              order: index,
            })),
            ...data.fundedPartners.map((url, index) => ({
              type: PartnerType.FUNDED_BY,
              imageUrl: url,
              name_en: `Funded Partner ${index + 1}`,
              name_ar: `شريك التمويل ${index + 1}`,
              order: index,
            })),
            ...data.implementedPartners.map((url, index) => ({
              type: PartnerType.IMPLEMENTED_BY,
              imageUrl: url,
              name_en: `Implementation Partner ${index + 1}`,
              name_ar: `شريك التنفيذ ${index + 1}`,
              order: index,
            })),
          ],
        },
      },
    });
    revalidatePath("/admin/pages/footer");
    return { success: true, data: footer };
  } catch (error) {
    return { success: false, error: "Failed to update footer" };
  }
}

export async function deleteFooter(id: string) {
  try {
    await db.partner.deleteMany({
      where: { footerId: id },
    });
    await db.footer.delete({
      where: { id },
    });
    revalidatePath("/admin/pages/footer");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete footer" };
  }
}


export const getFooter = cache(async () => {
  try {
    const footer = await db.footer.findFirst({
      include: {
        partners: true,
      },
    })

    return { success: true, data: footer }
  } catch (error) {
    console.error("Fetch footer error:", error)
    return { success: false, error: "Failed to fetch footer" }
  }
})