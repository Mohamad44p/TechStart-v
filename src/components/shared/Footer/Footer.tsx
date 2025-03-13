"use client"

import React from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { Instagram, Facebook, Linkedin, Youtube } from "lucide-react"
import AnimatedNetworkBackground from "../Nav/AnimatedBackground"
import Clients from "../Clients/Clients"
import { useLanguage } from "@/context/LanguageContext"
import type { Footer as FooterType } from "@/types/footer"

interface FooterProps {
  footerData: FooterType
}

export default function Footer({ footerData }: FooterProps) {
  const footerRef = React.useRef(null)
  const isInView = useInView(footerRef, { once: false })
  const { currentLang } = useLanguage()

  const {
    gradientColor = "#862996",
    titleColor = "#1b316e",
    techStartTitle_en = "TechStart",
    techStartTitle_ar = "تك ستارت",
    partners = [],
    instagram = null,
    linkedin = null,
    facebook = null,
    youtube = null,
  } = footerData || {};

  const gradientStyle = {
    backgroundImage: `linear-gradient(to bottom, white, ${gradientColor}40)`,
    backgroundColor: "transparent",
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        type: "spring",
        damping: 10,
        stiffness: 100,
      },
    }),
  }

  const title = currentLang === "ar" ? techStartTitle_ar : techStartTitle_en

  const renderTitle = () => {
    if (currentLang === "ar") {
      return (
        <motion.div
          className="text-6xl p-3 md:text-8xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${titleColor}, ${gradientColor})`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {title}
        </motion.div>
      );
    }

    return (
      <motion.div
        className="text-6xl md:text-8xl font-bold"
        style={{
          background: `linear-gradient(135deg, ${titleColor}, ${gradientColor})`,
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {Array.from(title).map((letter, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={letterVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            style={{ display: "inline-block" }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <footer ref={footerRef} className="relative py-16 overflow-hidden border-t border-gray-200" style={gradientStyle}>
      <AnimatedNetworkBackground color={gradientColor} />

      <motion.div
        className="max-w-7xl mx-auto px-4 md:px-6 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="flex flex-col items-center space-y-12">
          {renderTitle()}
          
          <motion.div variants={itemVariants} className="w-full py-8">
            <Clients partners={partners} />
          </motion.div>

          <motion.div variants={itemVariants} className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.p variants={itemVariants} className="text-sm text-gray-600 text-center">
              <span>© Tech Start. All rights reserved.</span>
            </motion.p>

            <motion.div variants={itemVariants} className="flex justify-center md:justify-end space-x-4">
              {[
                { Icon: Instagram, url: instagram },
                { Icon: Linkedin, url: linkedin },
                { Icon: Facebook, url: facebook },
                { Icon: Youtube, url: youtube },
              ].map(
                ({ Icon, url }, i) =>
                  url && (
                    <Link
                      key={i}
                      href={url}
                      target="_blank"
                      className="p-2 mx-3 rounded-full bg-white/80 hover:bg-[#91268f]/10 text-gray-600 hover:text-[#91268f] transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Icon size={20} />
                    </Link>
                  ),
              )}
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}

