import type { ProgramsPages as PrismaProgram } from "@prisma/client"

export interface TabButton {
  id?: string;
  tabId?: string;
  name_en: string;
  name_ar: string;
  content_en: string;
  content_ar: string;
  order?: number;
}

export interface ProgramTab {
  id: string
  title_en: string
  title_ar: string
  slug: string
  content_en: string
  content_ar: string
  processFile: string | null
  programPageId: string | null
  programPage?: PrismaProgram | null
  buttons: TabButton[];
  createdAt: Date
  updatedAt: Date
}

export interface ProgramsPages {
  id: string
  name_en: string
  name_ar: string
  categoryId: string | null
  category?: ProgramCategory | null
  ProgramTab?: ProgramTab[]
  createdAt: Date
  updatedAt: Date
}

export interface ProgramCategory {
  id: string;
  name_en: string;
  name_ar: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  programs?: ProgramsPages[];
}

export interface ProgramWithTabs {
  id: string;
  name_en: string;
  name_ar: string;
  categoryId: string | null;
  category?: ProgramCategory | null;
  ProgramTab?: {
    id: string;
    title_en: string;
    title_ar: string;
    slug: string;
  }[];
}

// Update ProgramsResponse interface
export interface ProgramsResponse {
  success: boolean;
  programs: SimpleProgramType[];
  error?: string;
}

export interface CreateProgramTabInput {
  title_en: string;
  title_ar: string;
  slug: string;
  content_en: string;
  content_ar: string;
  programPageId: string | null;
  processFile?: string | null;
  buttons?: Omit<TabButton, 'id' | 'tabId'>[];
}

export interface UpdateProgramTabInput extends CreateProgramTabInput {
  id: string
}

export interface CreateProgramInput {
  name_en: string;
  name_ar: string;
  categoryId?: string;
}

export interface UpdateProgramInput extends CreateProgramInput {
  id: string;
}

export interface SimpleProgramType {
  id: string;
  name_en: string;
  name_ar: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string | null;
}


