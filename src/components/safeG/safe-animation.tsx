"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface SafeAnimationProps {
  imageUrl: string | null;
  index: number;
  currentIndex: number;
}

export function SafeAnimation({ imageUrl, index, currentIndex }: SafeAnimationProps) {
  return (
    <AnimatePresence mode="wait">
      {currentIndex === index && (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotateY: 0,
            transition: {
              duration: 0.6,
              ease: "easeOut"
            }
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.8, 
            rotateY: -45,
            transition: {
              duration: 0.4
            }
          }}
          className="w-full aspect-square max-w-[280px] sm:max-w-[320px] md:max-w-[360px] lg:max-w-[400px] xl:max-w-[440px] rounded-xl sm:rounded-2xl"
        >
          {imageUrl ? (
            <motion.div 
              className="w-full h-full relative"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={imageUrl}
                alt="Safeguard illustration"
                width={1200}
                height={800}
                className="rounded-xl sm:rounded-2xl object-cover"
                priority
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-xl sm:rounded-2xl">
              <p className="text-sm sm:text-base lg:text-lg text-gray-500">No image available</p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

