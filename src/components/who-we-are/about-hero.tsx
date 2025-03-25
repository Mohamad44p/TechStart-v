"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { useLanguage } from "@/context/LanguageContext"
import type { AboutUsData } from "@/app/actions/pages/about-us-actions"
import { Card } from "@/components/ui/card"
import { getImageUrl } from "@/lib/utils/image-url"
import { AVAILABLE_ICONS, type IconName } from "@/config/icons"

interface AboutHeroProps {
  aboutUsData: AboutUsData
}

const AboutHero = ({ aboutUsData }: AboutHeroProps) => {
  const { currentLang } = useLanguage()

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4"
      >
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="order-1 lg:order-2 w-full lg:w-1/2 mb-8 lg:mb-0"
          >
            {aboutUsData.imageUrl && (
              <div className="relative w-full aspect-square sm:aspect-[4/3] md:aspect-[3/3] rounded-2xl overflow-hidden">
                <Image
                  src={getImageUrl(aboutUsData.imageUrl) || "/TechLogo.svg"}
                  alt={currentLang === "ar" ? aboutUsData.titleAr : aboutUsData.titleEn}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-2 lg:order-1 w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1 rounded-full bg-[#142452] text-white text-sm font-medium dark:bg-purple-900 dark:text-purple-300"
            >
              {currentLang === "ar" ? "تعرف علينا" : "About Us"}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[#142452] dark:text-gray-100"
            >
              <span className="block bg-gradient-to-r from-[#1F6DB3] to-[#142452] bg-clip-text text-transparent mt-2 relative p-2 md:p-5 leading-tight">
                {currentLang === "ar" ? aboutUsData.titleAr : aboutUsData.titleEn}
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-[#1F6DB3] dark:text-gray-300 leading-relaxed"
            >
              {currentLang === "ar" ? aboutUsData.descriptionAr : aboutUsData.descriptionEn}
            </motion.p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-20">
          {aboutUsData.cards.map((card, index) => (
            <AboutCard
              key={index}
              card={card}
              index={index}
              currentLang={currentLang}
              isVisible={
                (index === 0 && aboutUsData.card1Visible) ||
                (index === 1 && aboutUsData.card2Visible) ||
                (index === 2 && aboutUsData.card3Visible)
              }
            />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

interface AboutCardProps {
  card: AboutUsData["cards"][0]
  index: number
  currentLang: string
  isVisible: boolean
}

const AboutCard = ({ card, index, currentLang, isVisible }: AboutCardProps) => {
  const Icon = AVAILABLE_ICONS[card.icon as IconName] as React.ComponentType<{ className?: string }>

  if (!Icon || !isVisible) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
    >
      <Card className="group relative h-full overflow-hidden rounded-2xl bg-white/80 backdrop-blur shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800/80">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="relative p-6 md:p-8 space-y-4 md:space-y-6">
          <motion.div
            className="flex items-center gap-4"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
          >
            <div className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Icon className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#142452] group-hover:text-[#1F6DB3] transition-colors duration-300 dark:text-gray-100 dark:group-hover:text-[#1F6DB3]">
              {currentLang === "ar" ? card.titleAr : card.titleEn}
            </h3>
          </motion.div>
          <motion.p
            className="text-base md:text-lg text-[#1F6DB3] group-hover:text-[#142452] transition-colors duration-300 dark:text-gray-300 dark:group-hover:text-gray-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            {currentLang === "ar" ? card.descriptionAr : card.descriptionEn}
          </motion.p>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full origin-left transform bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
      </Card>
    </motion.div>
  )
}

export default AboutHero

