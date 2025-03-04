"use client";

import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ProgramsDropdown } from "./ProgramsDropdown";
import { AboutUsDropdown } from "./AboutUsDropdown";
import { ContactUsDropdown } from "./ContactUsDropdown";
import { MediaCenterDropdown } from "./MediaCenterDropdown";
import { useLanguage } from "@/context/LanguageContext";
import { Position } from "@/types/navbar";
import navbarTranslations from "@/translations/navbar";

export const SlideTabs: React.FC = () => {
  const { currentLang } = useLanguage();
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const translations = navbarTranslations[currentLang];
  
  if (!translations) {
    return null; 
  }

  return (
    <ul
      dir={currentLang === "ar" ? "rtl" : "ltr"}
      onMouseLeave={() => {
        setPosition((pv) => ({
          ...pv,
          opacity: 0,
        }));
      }}
      className="relative mx-auto flex w-fit rounded-full border border-gray-200/50 bg-white/80 p-1 backdrop-blur-md shadow-lg shadow-purple-500/5"
    >
      <AboutUsDropdown setPosition={setPosition} translations={translations} />
      <ProgramsDropdown setPosition={setPosition} translations={translations} />
      <MediaCenterDropdown setPosition={setPosition} translations={translations} />
      <Link href="/Safeguards">
        <Tab setPosition={setPosition}>{translations.safeguards}</Tab>
      </Link>
      <ContactUsDropdown setPosition={setPosition} translations={translations} />
      <Cursor position={position} />
    </ul>
  );
};

const Tab = ({
  children,
  setPosition,
}: {
  children: string;
  setPosition: Dispatch<SetStateAction<Position>>;
}) => {
  const ref = useRef<null | HTMLLIElement>(null);
  const { currentLang } = useLanguage();

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
          isRtl: currentLang === "ar"
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-base font-medium text-[#1b316e] transition-colors hover:text-white"
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: { position: Position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-8 rounded-full bg-gradient-to-r from-[#142451] to-[#862996] bg-opacity-45"
    />
  );
};

