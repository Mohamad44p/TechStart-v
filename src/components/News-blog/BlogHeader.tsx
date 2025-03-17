"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface NewsHeaderProps {
  title: string;
  description: string | null;
  image: string | null;
  date: Date;
  readTime: string | null;
  type: string;
}

export function NewsHeader({
  title,
  description,
  image,
  date,
  readTime,
  type,
}: NewsHeaderProps) {
  const { currentLang } = useLanguage();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(
      currentLang === "ar" ? "ar-SA" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );
  };

  return (
    <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
      
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <span className="inline-block px-3 py-1 text-sm font-semibold bg-[#862996] rounded-full mb-4">
              {type}
            </span>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {title}
            </h1>
            
            {description && (
              <p className="text-lg md:text-xl text-gray-200 mb-6">
                {description}
              </p>
            )}
            
            <div className="flex items-center gap-6 text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(date)}</span>
              </div>
              
              {readTime && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{readTime}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
