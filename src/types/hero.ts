import { z } from 'zod'

// Base validation schema
export const heroStepSchema = z.object({
  title_en: z.string().min(2, "English title must be at least 2 characters"),
  title_ar: z.string().min(2, "Arabic title must be at least 2 characters"),
  tagline_en: z.string().min(2, "English tagline must be at least 2 characters"),
  tagline_ar: z.string().min(2, "Arabic tagline must be at least 2 characters"),
  description_en: z.string().min(10, "English description must be at least 10 characters"),
  description_ar: z.string().min(10, "Arabic description must be at least 10 characters"),
  button_title_en: z.string().min(2, "English button title must be at least 2 characters"),
  button_title_ar: z.string().min(2, "Arabic button title must be at least 2 characters"),
  button_link: z.string().min(1, "Button link is required"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  imageUrl: z.string().min(1),
  order: z.number().int().positive()
})

// Basic type without metadata
export type HeroStepInput = {
  title_en: string;
  title_ar: string;
  tagline_en: string;
  tagline_ar: string;
  description_en: string;
  description_ar: string;
  button_title_en: string;
  button_title_ar: string;
  button_link: string;
  color: string;
  imageUrl: string;
  order: number;
};

// Complete type with all fields
export interface HeroStep extends HeroStepInput {
  id: number
  createdAt: Date
  updatedAt: Date
}

// Validation error type
export type FieldErrors = {
  [K in keyof HeroStepInput]?: string[]
}

export interface ValidationErrors {
  fieldErrors: FieldErrors
}

// API response types
export interface ApiSuccess<T> {
  success: true
  data: T
}

export interface ApiError {
  success: false
  error: string | FieldErrors
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
