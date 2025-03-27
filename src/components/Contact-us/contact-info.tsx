"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getContactInfo } from "@/app/actions/pages/contactActions";
import { MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";

export function ContactInfo() {
  const { currentLang } = useLanguage();
  const [contactInfo, setContactInfo] = useState<{
    addressEn: string;
    addressAr: string;
    phone: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    async function fetchContactInfo() {
      const { data } = await getContactInfo();
      if (data) {
        setContactInfo(data);
      }
    }
    fetchContactInfo();
  }, []);

  if (!contactInfo) {
    const defaultContactInfo = {
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
    };
    
    const currentContactInfo = defaultContactInfo[currentLang as keyof typeof defaultContactInfo];
    
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
    );
  }

  const contactData = [
    {
      icon: MapPin,
      text: currentLang === "ar" ? contactInfo.addressAr : contactInfo.addressEn,
    },
    { icon: Phone, text: contactInfo.phone },
    { icon: Mail, text: contactInfo.email },
  ];

  return (
    <div className="space-y-4">
      {contactData.map((item, index) => (
        <div
          key={index}
          className="flex items-center p-4 bg-gradient-to-r from-[#24386F] to-[#872996] text-white rounded-lg shadow-md"
        >
          <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="text-sm">{item.text}</span>
        </div>
      ))}
    </div>
  );
}

