import type { FieldErrors } from 'react-hook-form'

export interface StatData {
  name_en: string
  name_ar: string
  value: number // Changed from explicitly requiring an integer
  icon: string
  suffix_en: string
  suffix_ar: string
}

export type LanguageType = 'en' | 'ar';

interface ApiSuccess<T> {
  success: true
  data: T
  error?: never
}

interface ApiError {
  success: false
  data?: never
  error: string | FieldErrors
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

