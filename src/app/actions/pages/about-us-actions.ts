"use server";

import db from "@/app/db/db";
import { revalidatePath } from "next/cache";
import { safeDbOperation } from "@/lib/db-utils";

export type AboutUsData = {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  imageUrl: string | null;
  card1Visible: boolean;
  card2Visible: boolean;
  card3Visible: boolean;
  cards: {
    titleEn: string;
    titleAr: string;
    descriptionEn: string;
    descriptionAr: string;
    icon: string;
  }[];
};

export async function getAboutUs() {
  const result = await safeDbOperation(
    () => db.aboutUs.findFirst({
      include: {
        cards: true,
      },
    }),
    'Failed to fetch about us data'
  );
  
  if (result.error) {
    throw new Error(result.error);
  }
  
  return result.data;
}

export async function getAboutUsById(id: string) {
  const result = await safeDbOperation(
    () => db.aboutUs.findUnique({
      where: { id },
      include: {
        cards: true,
      },
    }),
    `Failed to fetch about us with id ${id}`
  );
  
  if (result.error) {
    throw new Error(result.error);
  }
  
  return result.data;
}

export async function createAboutUs(data: AboutUsData) {
  const { cards, ...aboutUsData } = data;

  const result = await safeDbOperation(
    () => db.aboutUs.create({
      data: {
        ...aboutUsData,
        cards: {
          create: cards,
        },
      },
    }),
    'Failed to create about us'
  );
  
  if (result.error) {
    throw new Error(result.error);
  }
  
  revalidatePath("/admin/pages/about");
  return result.data;
}

export async function updateAboutUs(id: string, data: AboutUsData) {
  const { cards, ...aboutUsData } = data;

  const result = await safeDbOperation(
    () => db.aboutUs.update({
      where: { id },
      data: {
        ...aboutUsData,
        cards: {
          deleteMany: {},
          create: cards,
        },
      },
    }),
    `Failed to update about us with id ${id}`
  );
  
  if (result.error) {
    throw new Error(result.error);
  }
  
  revalidatePath("/admin/pages/about");
  return result.data;
}

export async function deleteAboutUs(id: string) {
  const result = await safeDbOperation(
    () => db.aboutUs.delete({
      where: { id },
    }),
    `Failed to delete about us with id ${id}`
  );
  
  if (result.error) {
    throw new Error(result.error);
  }
  
  revalidatePath("/admin/pages/about");
}
