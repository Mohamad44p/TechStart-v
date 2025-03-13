"use client";

import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { RainbowButton } from "../../ui/rainbow-button";
import { Navbar } from "../Nav/Navbar";
import AnimatedNetworkBackground from "../Nav/AnimatedBackground";
import { useLanguage } from "@/context/LanguageContext";

const STEP_DURATION = 10000;

interface HeroStepData {
  title_en: string;
  title_ar: string;
  tagline_en: string;
  tagline_ar: string;
  description_en: string;
  description_ar: string;
  button_title_en: string;
  button_title_ar: string;
  button_link: string;
  color: string;
  imageUrl: string;
}

interface ProcessedStep {
  title: string;
  tagline: string;
  description: string;
  buttonTitle: string;
  buttonLink: string;
  color: string;
  imageUrl: string;
}

interface HeroProps {
  steps: Record<number, HeroStepData>;
}

const Hero = ({ steps }: HeroProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [key, setKey] = useState(0);
  const controls = useAnimation();
  const progressControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { currentLang } = useLanguage();

  const currentSteps: ProcessedStep[] = Object.values(steps).map((step) => ({
    title: currentLang === "ar" ? step.title_ar : step.title_en,
    tagline: currentLang === "ar" ? step.tagline_ar : step.tagline_en,
    description:
      currentLang === "ar" ? step.description_ar : step.description_en,
    buttonTitle:
      currentLang === "ar"
        ? step.button_title_ar || "ابدأ الآن"
        : step.button_title_en || "Get Started Now",
    buttonLink: step.button_link || "#",
    color: step.color,
    imageUrl: step.imageUrl,
  }));

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev + 1) % currentSteps.length);
    setKey((prev) => prev + 1);
  }, [currentSteps.length]);

  useEffect(() => {
    const interval = setInterval(nextStep, STEP_DURATION);
    return () => clearInterval(interval);
  }, [nextStep]);

  useEffect(() => {
    controls.start({
      backgroundColor: `${currentSteps[currentStep].color}10`,
      transition: { duration: 0.5, ease: "easeInOut" },
    });

    progressControls.set({ width: "0%" });
    progressControls.start({
      width: "100%",
      transition: { duration: STEP_DURATION / 1000, ease: "linear" },
    });
  }, [currentStep, controls, progressControls, currentSteps]);

  const handleTabClick = (index: number) => {
    setCurrentStep(index);
    setKey((prev) => prev + 1);
  };

  const gradientStyle = {
    backgroundImage: `
      radial-gradient(circle at 50% -100px, ${
        currentSteps[currentStep].color
      }10, transparent 400px),
      radial-gradient(circle at 100% 50%, ${
        currentSteps[(currentStep + 1) % currentSteps.length].color
      }05, transparent 400px),
      radial-gradient(circle at 0% 100%, ${
        currentSteps[(currentStep + 2) % currentSteps.length].color
      }05, transparent 400px)
    `,
  };

  return (
    <motion.div
      ref={containerRef}
      className={`relative min-h-screen overflow-hidden transition-all duration-500 ease-in-out ${
        currentLang === "ar" ? "rtl" : "ltr"
      }`}
      animate={{
        backgroundColor: `${currentSteps[currentStep].color}05`,
        transition: { duration: 0.5, ease: "easeInOut" },
      }}
      style={gradientStyle}
    >
      <AnimatedNetworkBackground color={currentSteps[currentStep].color} />
      <Navbar />
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col min-h-[calc(100vh-80px)] py-20">
          {/* Mobile Image (visible only on mobile) */}
          <div className="lg:hidden mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 1.05, rotateY: 15 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full h-[250px] sm:h-[300px] rounded-2xl overflow-hidden"
              >
                <div className="absolute inset-0 p-2 sm:p-4">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={
                        currentSteps[currentStep].imageUrl || "/placeholder.svg"
                      }
                      alt={currentSteps[currentStep].title}
                      fill
                      sizes="(max-width: 640px) 90vw,
                             (max-width: 768px) 70vw,
                             (max-width: 1024px) 60vw,
                             50vw"
                      priority={currentStep === 0}
                      quality={85}
                      className="object-cover object-center transform transition-transform duration-300 hover:scale-102"
                      style={{
                        WebkitBackfaceVisibility: "hidden",
                        backfaceVisibility: "hidden",
                        maxWidth: "100%",
                        maxHeight: "100%",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Desktop and Mobile Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep}-${currentLang}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="inline-block"
                  >
                    <span
                      className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${currentSteps[currentStep].color}20`,
                        color: currentSteps[currentStep].color,
                      }}
                    >
                      {currentSteps[currentStep].tagline}
                    </span>
                  </motion.div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                      className={`block bg-clip-text text-transparent py-2 ${
                        currentLang === "ar" ? "leading-relaxed" : ""
                      }`}
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${
                          currentSteps[currentStep].color
                        }, ${
                          currentSteps[(currentStep + 1) % currentSteps.length]
                            .color
                        })`,
                      }}
                    >
                      {currentSteps[currentStep].title}
                    </motion.span>
                  </h1>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl text-[#142451] leading-relaxed max-w-xl"
                >
                  {currentSteps[currentStep].description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-4 pt-4"
                >
                  <RainbowButton
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold shadow-lg shadow-current/20 hover:shadow-xl hover:shadow-current/30 transition-all duration-300"
                    href={currentSteps[currentStep].buttonLink}
                  >
                    {currentSteps[currentStep].buttonTitle}
                  </RainbowButton>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.div className="space-y-10 hidden lg:block">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 1.05, rotateY: 15 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] rounded-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 p-2 sm:p-4">
                    <div className="relative w-full h-full rounded-xl overflow-hidden">
                      <Image
                        src={
                          currentSteps[currentStep].imageUrl || "/placeholder.svg"
                        }
                        alt={currentSteps[currentStep].title}
                        fill
                        sizes="(max-width: 640px) 90vw,
                               (max-width: 768px) 70vw,
                               (max-width: 1024px) 60vw,
                               50vw"
                        priority={currentStep === 0}
                        quality={85}
                        className="object-cover object-center transform transition-transform duration-300 hover:scale-102"
                        style={{
                          WebkitBackfaceVisibility: "hidden",
                          backfaceVisibility: "hidden",
                          maxWidth: "100%",
                          maxHeight: "100%",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="space-y-6">
                <div className="flex flex-wrap md:flex-nowrap justify-center md:justify-between gap-4">
                  {currentSteps.map((step, index) => (
                    <motion.button
                      key={index}
                      className={`text-[16px] font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 flex-grow md:flex-grow-0 ${
                        index === currentStep
                          ? "text-white shadow-lg"
                          : "bg-white/50 hover:bg-white/80"
                      }`}
                      style={{
                        backgroundColor:
                          index === currentStep ? step.color : "transparent",
                        border: `2px solid ${step.color}`,
                        color: index === currentStep ? "white" : step.color,
                      }}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: step.color,
                        color: "white",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabClick(index)}
                    >
                      {step.tagline}
                    </motion.button>
                  ))}
                </div>
                <motion.div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    key={key}
                    className="h-full"
                    style={{ backgroundColor: currentSteps[currentStep].color }}
                    initial={{ width: "0%" }}
                    animate={progressControls}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>
          
          {/* Mobile Navigation Buttons */}
          <div className="lg:hidden mt-8 space-y-6">
            <div className="flex flex-wrap justify-center gap-4">
              {currentSteps.map((step, index) => (
                <motion.button
                  key={index}
                  className={`text-[16px] font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300 flex-grow sm:flex-grow-0 ${
                    index === currentStep
                      ? "text-white shadow-lg"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  style={{
                    backgroundColor:
                      index === currentStep ? step.color : "transparent",
                    border: `2px solid ${step.color}`,
                    color: index === currentStep ? "white" : step.color,
                  }}
                  whileHover={{
                    scale: 1.05,
                    backgroundColor: step.color,
                    color: "white",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabClick(index)}
                >
                  {step.tagline}
                </motion.button>
              ))}
            </div>
            <motion.div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                key={key}
                className="h-full"
                style={{ backgroundColor: currentSteps[currentStep].color }}
                initial={{ width: "0%" }}
                animate={progressControls}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Hero;
