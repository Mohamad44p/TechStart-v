"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Pause, Play, Linkedin } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"
import type { TeamMemberData } from "@/app/actions/pages/team-actions"
import { getImageUrl } from "@/lib/utils/image-url"
import { useInView } from "react-intersection-observer"

interface OurTeamProps {
  teamMembersData: TeamMemberData[]
}

const OurTeam = ({ teamMembersData }: OurTeamProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [direction, setDirection] = useState(0)
  const itemsPerPage = 4
  const totalPages = Math.ceil(teamMembersData.length / itemsPerPage)
  const { currentLang } = useLanguage()
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  const handleNext = useCallback(() => {
    setDirection(1)
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }, [totalPages])

  const handlePrev = useCallback(() => {
    setDirection(-1)
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }, [totalPages])

  const goToPage = useCallback((pageIndex: number) => {
    if (currentPage === totalPages - 1 && pageIndex === 0) {
      setDirection(1)
    } else if (currentPage === 0 && pageIndex === totalPages - 1) {
      setDirection(-1)
    } else {
      setDirection(pageIndex > currentPage ? 1 : -1)
    }
    setCurrentPage(pageIndex)
  }, [currentPage, totalPages])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isAutoPlay && inView) {
      timer = setInterval(handleNext, 6000)
    }
    return () => clearInterval(timer)
  }, [isAutoPlay, handleNext, inView])

  const containerVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
        delay: index * 0.1,
      },
    }),
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  return (
    <div
      ref={ref}
      className="relative overflow-hidden py-24 min-h-screen flex items-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <motion.div
          className="absolute -top-32 -left-32 w-[30rem] h-[30rem]"
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div className="absolute w-full h-full bg-gradient-to-br from-purple-500/40 via-pink-500/40 to-transparent rounded-[100%] blur-[64px]" />
        </motion.div>
        <motion.div
          className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem]"
          animate={{
            x: [0, -20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          <div className="absolute w-full h-full bg-gradient-to-tl from-blue-500/40 via-cyan-500/40 to-transparent rounded-[100%] blur-[64px]" />
        </motion.div>
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          className="text-center space-y-4 mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold p-3 tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {currentLang === "ar" ? "تعرف على فريقنا " : "Meet Our Team"}
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto rounded-full" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <AnimatePresence initial={false} mode="wait" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              variants={containerVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4"
            >
              {teamMembersData
                .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                .map((member, index) => (
                  <motion.div
                    key={member.nameEn}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                    className="group perspective"
                  >
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 h-full transform-gpu transition-all duration-500 ease-out shadow-lg hover:shadow-2xl dark:shadow-purple-500/20">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10">
                        <div className="aspect-[4/5] overflow-hidden rounded-xl mb-6">
                          <motion.img
                            src={getImageUrl(member.imageUrl)}
                            alt={currentLang === "ar" ? member.nameAr : member.nameEn}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                        <motion.div
                          className="space-y-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {currentLang === "ar" ? member.nameAr : member.nameEn}
                          </h3>
                          <p className="text-sm font-medium text-purple-500/80 dark:text-purple-400/80">
                            {currentLang === "ar" ? member.jobTitleAr : member.jobTitleEn}
                          </p>
                          {member.linkedinUrl && (
                            <a 
                              href={member.linkedinUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                              <Linkedin className="w-5 h-5 mr-1" />
                              <span className="text-sm">LinkedIn</span>
                            </a>
                          )}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="flex justify-center items-center gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg hover:shadow-xl border border-purple-500/20 hover:border-purple-500 transition-all duration-300 group"
            >
              <ArrowLeft className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            </button>

            <div className="flex gap-3 items-center">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === i ? "bg-purple-500 scale-125" : "bg-purple-300/30 hover:bg-purple-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg hover:shadow-xl border border-purple-500/20 hover:border-purple-500 transition-all duration-300 group"
            >
              <ArrowRight className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
            </button>

            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur shadow-lg hover:shadow-xl border border-purple-500/20 hover:border-purple-500 transition-all duration-300 group"
            >
              {isAutoPlay ? (
                <Pause className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <Play className="w-6 h-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default OurTeam

