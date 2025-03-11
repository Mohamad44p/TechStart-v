"use client"

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

interface SafeGHeaderProps {
  initialLang: string;
}

export default function SafeGHeader({ initialLang }: SafeGHeaderProps) {
  const { currentLang = initialLang } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-16 lg:mb-24"
    >
      <motion.h2 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold p-3 tracking-tight bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-transparent"
      >
        {currentLang === "ar" ? "إرشادات السلامة لدينا" : "Our Safety Guidelines"}
      </motion.h2>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "6rem" }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="h-1 sm:h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"
      />
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-600 max-w-3xl mx-auto"
      >
        {currentLang === "ar"
          ? "الالتزام بضمان بيئة آمنة ومأمونة للجميع."
          : "Commitment to ensuring a safe and secure environment for everyone."}
      </motion.p>
    </motion.div>
  );
}
