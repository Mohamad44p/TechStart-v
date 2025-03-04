"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { SafeAnimation } from "./safe-animation";
import type { Safeguard } from "@/types/safeguard";
import { useLanguage } from "@/context/LanguageContext";

interface SafeScrollProps {
  safeguards: Safeguard[] | undefined;
  initialLang: string;
}

const handleDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "document";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error("Download failed:", error);
  }
};

export function SafeScroll({ safeguards = [], initialLang }: SafeScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentLang = initialLang } = useLanguage();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      const newIndex = Math.floor(latest * safeguards.length);
      if (newIndex !== currentIndex && newIndex < safeguards.length) {
        setCurrentIndex(newIndex);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, currentIndex, safeguards.length]);

  return (
    <div ref={containerRef} className="relative">
      {(safeguards || []).map((safeguard, index) => (
        <div
          key={index}
          className="min-h-[100dvh] flex items-center justify-center sticky top-0 overflow-hidden"
        >
          <motion.div
            className="w-full h-full absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${safeguard.bgColor}dd, ${safeguard.bgColor}99)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: currentIndex === index ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          />
          <div className="container mx-auto px-4 lg:px-8 py-6 sm:py-12 flex flex-col lg:flex-row items-center justify-between relative z-10 gap-6 sm:gap-12">
            <motion.div 
              className="w-full lg:w-1/2 max-w-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: currentIndex === index ? 1 : 0,
                x: currentIndex === index ? 0 : -50,
              }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="space-y-4 sm:space-y-8">
                <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-gray-800/10 rounded-full text-gray-700 text-base sm:text-lg font-medium">
                  {safeguard.domain}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                  {currentLang === "ar" ? safeguard.title_ar : safeguard.title_en}
                </h2>
                <p className="text-lg sm:text-xs lg:text-xl text-gray-600 font-medium">
                  {currentLang === "ar" ? safeguard.tagline_ar : safeguard.tagline_en}
                </p>
                <p className="text-base sm:text-[16px] text-gray-700 leading-relaxed">
                  {currentLang === "ar" ? safeguard.description_ar : safeguard.description_en}
                </p>
                {safeguard.attachmentUrl && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#152756] to-[#862996] text-white rounded-xl 
                    hover:from-[#1a326e] hover:to-[#9d31b3] transition-all duration-300 shadow-lg hover:shadow-2xl text-sm sm:text-base"
                    onClick={() => {
                      const filename =
                        safeguard.attachmentUrl?.split("/").pop() ||
                        "document";
                      handleDownload(
                        `/api/download?url=${encodeURIComponent(
                          safeguard.attachmentUrl!
                        )}`,
                        filename
                      );
                    }}
                  >
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span className="tracking-wide">
                      {currentLang === "ar"
                        ? "تحميل المستند"
                        : "Download Document"}
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
            <div className="w-full sm:w-4/5 lg:w-1/2 max-w-lg lg:max-w-2xl">
              <SafeAnimation
                imageUrl={safeguard.imageUrl}
                index={index}
                currentIndex={currentIndex}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
