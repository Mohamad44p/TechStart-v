"use client"

import { useLanguage } from "@/context/LanguageContext"
import { MapPin, Phone, Mail } from "lucide-react"

export function ContactInfo() {
  const { currentLang } = useLanguage()

  const contactInfo = {
    en: [
      {
        icon: MapPin,
        text: "Haifa Building 4th floor, Al Irsal, Ramallah-AlBireh, Palestine",
      },
      { icon: Phone, text: "+970 2 296 4840" },
      { icon: Mail, text: "info@techstart.ps" },
    ],
    ar: [
      {
        icon: MapPin,
        text: "مبنى حيفا الطابق الرابع، الإرسال، رام الله-البيرة، فلسطين",
      },
      { icon: Phone, text: "+970 2 296 4840" },
      { icon: Mail, text: "info@techstart.ps" },
    ],
  }

  const currentContactInfo = contactInfo[currentLang as keyof typeof contactInfo]

  return (
    <div className="space-y-4">
      {currentContactInfo.map((item, index) => (
        <div
          key={index}
          className="flex items-center p-4 bg-gradient-to-r from-[#24386F] to-[#872996] text-white rounded-lg shadow-md"
        >
          <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="text-sm">{item.text}</span>
        </div>
      ))}
    </div>
  )
}

