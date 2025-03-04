import React from 'react';
import { useLanguage } from '@/context/LanguageContext'
import { cn } from '@/lib/utils'
import type { Category } from '@/types/beneficiary'

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  const { currentLang } = useLanguage()

  const allCategories = [
    { id: 'all', name_en: 'All', name_ar: 'الكل', slug: 'all' },
    ...categories
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => (
        <button
          key={category.slug}
          onClick={() => onCategoryChange(category.slug)}
          className={cn(
            "px-4 py-2 rounded-full text-sm transition-all",
            activeCategory === category.slug
              ? "bg-purple-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          )}
        >
          {currentLang === 'ar' ? category.name_ar : category.name_en}
        </button>
      ))}
    </div>
  )
}
