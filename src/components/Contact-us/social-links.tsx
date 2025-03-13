"use client"

import { motion } from "framer-motion"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"
import { useLanguage } from "@/context/LanguageContext"

interface SocialLinksProps {
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    youtube?: string
  } | null
}

export function SocialLinks({ socialLinks }: SocialLinksProps) {
  const { currentLang } = useLanguage()

  const socialIcons = [
    { icon: Facebook, key: "facebook" },
    { icon: Instagram, key: "instagram" },
    { icon: Linkedin, key: "linkedin" },
    { icon: Youtube, key: "youtube" },
  ]

  return (
    <div className="flex justify-center space-x-4">
      {socialIcons.map((social) => {
        const url = socialLinks?.[social.key as keyof typeof socialLinks]
        if (!url) return null

        return (
          <motion.a
            key={social.key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2  mx-3 bg-gradient-to-r from-[#24386F] to-[#872996] text-white rounded-full hover:from-[#1c2d59] hover:to-[#6e217a] transition-all duration-300"
            aria-label={`${social.key} ${currentLang === "ar" ? "رابط" : "link"}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <social.icon className="w-5 h-5" />
          </motion.a>
        )
      })}
    </div>
  )
}

