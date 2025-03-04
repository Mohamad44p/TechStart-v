'use client'

import { createContext, useContext, useCallback } from 'react'
import { useLanguage } from './LanguageContext'
import type { FaqCategory, FaqItem, LanguageType } from '@/types/faq'

interface FaqContextType {
  getLocalizedCategoryName: (category: FaqCategory) => string
  getLocalizedQuestion: (faq: FaqItem) => string
  getLocalizedAnswer: (faq: FaqItem) => string
  currentLang: LanguageType
}

const FaqContext = createContext<FaqContextType | undefined>(undefined)

export function FaqProvider({ children }: { children: React.ReactNode }) {
  const { currentLang } = useLanguage()

  const getLocalizedCategoryName = useCallback(
    (category: FaqCategory) => {
      return currentLang === 'ar' ? category.nameAr : category.nameEn
    },
    [currentLang]
  )

  const getLocalizedQuestion = useCallback(
    (faq: FaqItem) => {
      return currentLang === 'ar' ? faq.questionAr : faq.questionEn
    },
    [currentLang]
  )

  const getLocalizedAnswer = useCallback(
    (faq: FaqItem) => {
      return currentLang === 'ar' ? faq.answerAr : faq.answerEn
    },
    [currentLang]
  )

  return (
    <FaqContext.Provider
      value={{
        getLocalizedCategoryName,
        getLocalizedQuestion,
        getLocalizedAnswer,
        currentLang,
      }}
    >
      {children}
    </FaqContext.Provider>
  )
}

export function useFaq() {
  const context = useContext(FaqContext)
  if (!context) {
    throw new Error('useFaq must be used within a FaqProvider')
  }
  return context
}
