"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function NotFound() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col items-center justify-center overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-center z-10 max-w-3xl px-4"
      >
        <motion.h1
          className="text-9xl font-extrabold mb-8 relative"
          animate={controls}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1C69AD] to-[#872996]">
            4
          </span>
          <motion.span
            className="inline-block"
            animate={{
              y: [0, -80, 0],
              rotateY: [0, 360, 0],
              transition: {
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              },
            }}
          >
            0
          </motion.span>
          <motion.span className="bg-clip-text text-transparent bg-gradient-to-r from-[#872996] to-pink-600">
            4
          </motion.span>
        </motion.h1>

        <motion.p
          className="text-3xl mb-12 text-gray-700 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Oops! You&apos;ve discovered our digital Bermuda Triangle.
        </motion.p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <Link
            href="/"
            prefetch
            className="bg-gradient-to-r from-[#872996] to-[#1C69AD] text-white font-bold py-4 px-10 rounded-full inline-block transition-all duration-300 shadow-lg hover:shadow-2xl relative overflow-hidden group"
          >
            <span className="relative z-10">Teleport to Home Base</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 1 }}
      />
    </div>
  );
}
