"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { WordPullUpDemo } from "../../ui/FoucursTitle";
import { useLanguage } from "@/context/LanguageContext";
import type { FocusareaData } from "@/app/actions/pages/focusareas-actions";
import { getImageUrl } from "@/lib/utils/image-url";
import { Card } from "@/components/ui/card";

interface FoucesAreaProps {
  focusareasData: FocusareaData[];
}

const ServiceCard = ({
  card,
  index,
}: {
  card: FocusareaData["cards"][0];
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });
  const controls = useAnimation();
  const { currentLang } = useLanguage();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.8,
            ease: [0.6, -0.05, 0.01, 0.99],
            delay: index * 0.1,
          },
        },
      }}
      className="h-full"
    >
      <Card className="group relative flex flex-col h-full overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-2xl dark:bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={getImageUrl(card.imageUrl) || "/placeholder.svg"}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            alt={currentLang === "ar" ? card.titleAr : card.titleEn}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
        <div className="flex flex-col flex-grow p-6">
          <h2 className="mb-2 text-2xl font-bold text-[#1F6DB3] transition-colors duration-300 group-hover:text-purple-600 dark:text-gray-100 dark:group-hover:text-purple-400">
            {currentLang === "ar" ? card.titleAr : card.titleEn}
          </h2>
          
          <div className="flex-grow"></div>
          
          {card.buttonUrl && (
            <div className="mt-4">
              <a
                href={card.buttonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-[#1F6DB3] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-600 z-10 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {currentLang === "ar" ? "المزيد" : "Learn More"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`ml-2 h-4 w-4 ${currentLang === "ar" ? "rotate-180" : ""}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full origin-left transform bg-gradient-to-r from-purple-500 to-blue-500 scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></div>
      </Card>
    </motion.div>
  );
};

export default function FoucesArea({ focusareasData }: FoucesAreaProps) {
  const { currentLang } = useLanguage();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white m-2 py-24 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-5"></div>
      <motion.div
        className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-purple-300 opacity-20 blur-3xl dark:bg-purple-900"
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-300 opacity-20 blur-3xl dark:bg-blue-900"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-center"
        >
          <div className="mb-4 text-5xl font-bold">
            <WordPullUpDemo
              text={
                currentLang === "ar"
                  ? focusareasData[0].titleAr
                  : focusareasData[0].titleEn
              }
            />
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {focusareasData[0].cards.map((card, index) => (
            <ServiceCard key={card.titleEn} card={card} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
