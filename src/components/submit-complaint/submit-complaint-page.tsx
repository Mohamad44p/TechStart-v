"use client"

import { motion } from "framer-motion"
import { Guidelines } from "./guidelines"
import { ComplaintForm } from "./complaint-form"
import { useLanguage } from "@/context/LanguageContext"

export default function SubmitComplaintPage() {
  const { currentLang } = useLanguage()

  const labels = {
    en: {
      title: "Submit a Complaint",
    },
    ar: {
      title: "تقديم شكوى",
    },
  }

  const t = labels[currentLang as keyof typeof labels]

  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8 ${
        currentLang === "ar" ? "rtl" : "ltr"
      }`}
      dir={currentLang === "ar" ? "rtl" : "ltr"}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-screen-2xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">{t.title}</h1>
        <Guidelines />
        <ComplaintForm />
      </motion.div>
    </div>
  )
}

