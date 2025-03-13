"use client"
import Image from "next/image"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"
import type { PartnerPage } from "@/types/partner"

interface PartnersPageClientProps {
  partners: PartnerPage[]
}

export default function PartnersPageClient({ partners }: PartnersPageClientProps) {
  const { currentLang } = useLanguage()
  const isRTL = currentLang === "ar"

  return (
    <section className={`bg-gradient-to-b from-white to-gray-50 py-32 px-4 md:px-6 relative ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-800"
        >
          {isRTL ? "شركاؤنا" : "Our Partners"}
        </motion.h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <Partner key={partner.id} partner={partner} index={index} isRTL={isRTL} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Partner({ partner, index, isRTL }: { partner: PartnerPage; index: number; isRTL: boolean }) {
  const getPartnerTypeLabel = (type: string) => {
    switch (type) {
      case "PROJECT_OF":
        return isRTL ? "مشروع لـ" : "A Project of"
      case "FUNDED_BY":
        return isRTL ? "ممول من قبل" : "Funded By"
      case "IMPLEMENTED_BY":
        return isRTL ? "منفذ من قبل" : "Implemented By"
      default:
        return ""
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 cursor-pointer"
      onClick={() => window.open(partner.websiteUrl, "_blank")}
    >
      <div className="flex flex-col items-center">
        <span className="text-sm text-gray-600 font-medium mb-2">{getPartnerTypeLabel(partner.type)}</span>
        <div className="w-[160px] h-[100px] relative mb-4">
          <Image
            src={partner.imageUrl || "/placeholder.svg"}
            alt={isRTL ? partner.title_ar : partner.title_en}
            fill
            className="object-contain"
            priority={index < 3}
            quality={85}
          />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{isRTL ? partner.title_ar : partner.title_en}</h3>
      </div>
    </motion.div>
  )
}

