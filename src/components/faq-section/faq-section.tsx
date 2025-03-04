'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFaq } from '@/context/FaqContext'
import type { FaqCategory, FaqItem } from '@/types/faq'

export interface FAQSectionProps {
  categories: FaqCategory[];
  faqsByCategory: Record<string, FaqItem[]>;
}

export function FAQSection({ categories, faqsByCategory }: FAQSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.id || '')
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const { getLocalizedCategoryName, getLocalizedQuestion, getLocalizedAnswer, currentLang } = useFaq()

  return (
    <div className="min-h-[90vh] bg-white text-gray-900 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header section */}
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-purple-600 text-center mb-4"
        >
          {currentLang === 'ar' ? 'دعنا نجيب على بعض الأسئلة' : "Let's answer some questions"}
        </motion.p>
        
        {/* Categories section */}
        <motion.div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id)
                setActiveIndex(null)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all duration-300",
                activeCategory === category.id
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {getLocalizedCategoryName(category)}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Items section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {faqsByCategory[activeCategory]?.map((faq, index) => (
              <motion.div
                key={faq.id}
                className="rounded-xl overflow-hidden shadow-md"
              >
                <motion.button
                  onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
                  whileHover={{ backgroundColor: "rgba(243, 244, 246, 1)" }}
                >
                  <span className="text-lg text-gray-800 font-medium">
                    {getLocalizedQuestion(faq)}
                  </span>
                  <motion.div
                    animate={{ rotate: activeIndex === index ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Plus className="w-5 h-5 text-purple-600" />
                  </motion.div>
                </motion.button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-4 bg-white">
                        <p className="text-gray-600">{getLocalizedAnswer(faq)}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
