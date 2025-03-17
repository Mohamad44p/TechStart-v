"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/lib/use-outside-click";
import { Input } from "@/components/ui/input";
import { CategoryTabs } from "./category-tabs";
import type { Beneficiary, Category } from "@/types/beneficiary";
import { useLanguage } from "@/context/LanguageContext";

interface BeneficiariesSectionProps {
  beneficiaries: Beneficiary[];
  categories: Category[];
}

export function BeneficiariesSection({
  beneficiaries,
  categories,
}: BeneficiariesSectionProps) {
  const [active, setActive] = useState<Beneficiary | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { currentLang } = useLanguage();

  const DEFAULT_IMAGE = "/car-front-2.png";
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const getValidImageUrl = (url?: string) => {
    if (!url || url.trim() === "") return DEFAULT_IMAGE;
    return url;
  };

  const getLocalizedContent = (content: Beneficiary) => ({
    title: currentLang === "ar" ? content.title_ar : content.title_en,
    description:
      currentLang === "ar" ? content.description_ar : content.description_en,
  });

  const filteredBeneficiaries = beneficiaries.filter((beneficiary) => {
    const localizedContent = getLocalizedContent(beneficiary);
    const matchesSearch = (
      localizedContent.title + (localizedContent.description || "")
    )
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || beneficiary.category.slug === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <div className="w-full bg-white py-16">
      <div className="max-w-screen-xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-[#1E78C2] to-[#862996] text-transparent bg-clip-text"
        >
          {currentLang === "ar"
            ? "رواد تكنولوجيا المعلومات في فلسطين"
            : "Meet the Pioneers of the Palestinian IT Sector"}
        </motion.h2>

        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search beneficiaries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-72"
          />
          <CategoryTabs
            categories={categories}
            activeCategory={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />
        </div>

        <AnimatePresence>
          {active && typeof active === "object" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm h-full w-full z-10"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {active && (
            <div className="fixed inset-0 grid place-items-center z-[100] p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{
                  duration: 0.2,
                  ease: [0.19, 1.0, 0.22, 1.0],
                }}
                style={{ willChange: "transform, opacity" }}
                layoutId={`card-${active.id}-${id}`}
                ref={ref}
                className="w-full max-w-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border"
              >
                <motion.button
                  key={`button-${active.id}-${id}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 right-4 z-20 bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-all"
                  onClick={() => setActive(null)}
                >
                  <CloseIcon />
                </motion.button>

                <motion.div layoutId={`image-${active.id}-${id}`}>
                  <Image
                    priority
                    loading="eager"
                    width={600}
                    height={400}
                    src={getValidImageUrl(active.imageUrl)}
                    alt={getLocalizedContent(active).title}
                    className="w-full h-64 object-contain bg-gray-50 p-8"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_IMAGE;
                    }}
                  />
                </motion.div>

                <div className="p-6 pt-4">
                  <motion.h3
                    layoutId={`title-${active.id}-${id}`}
                    className="text-2xl font-bold text-black mb-2"
                  >
                    {getLocalizedContent(active).title}
                  </motion.h3>
                  {getLocalizedContent(active).description && (
                    <motion.p
                      layoutId={`description-${active.id}-${id}`}
                      className="text-gray-700 mb-4"
                    >
                      {getLocalizedContent(active).description}
                    </motion.p>
                  )}

                  <motion.a
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    href={active.ctaLink || active.buttonLink || "#"}
                    target="_blank"
                    className="mt-4 block w-full text-center px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-all"
                  >
                    {active.ctaText ||
                      active.buttonText ||
                      (currentLang === "ar" ? "عرض المزيد" : "Learn More")}
                  </motion.a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.ul
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delayChildren: 0.2,
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {filteredBeneficiaries.map((beneficiary) => {
            const localizedContent = getLocalizedContent(beneficiary);
            return (
              <motion.li
                key={beneficiary.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    },
                  },
                }}
                layoutId={`card-${beneficiary.id}-${id}`}
                onClick={() => setActive(beneficiary)}
                className="bg-white border rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="p-6 flex flex-col items-center">
                  <motion.div
                    layoutId={`image-${beneficiary.id}-${id}`}
                    className="mb-4 w-32 h-32 flex items-center justify-center"
                  >
                    <Image
                      width={120}
                      height={120}
                      loading="eager"
                      src={getValidImageUrl(beneficiary.imageUrl)}
                      alt={localizedContent.title}
                      className="rounded-full object-contain w-full h-full p-2 bg-gray-50 group-hover:rotate-6 transition-transform duration-300 border will-change-transform"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = DEFAULT_IMAGE;
                      }}
                    />
                  </motion.div>
                  <div className="text-center">
                    <motion.h3
                      layoutId={`title-${beneficiary.id}-${id}`}
                      className="font-bold text-lg text-black mb-1"
                    >
                      {localizedContent.title}
                    </motion.h3>
                    {localizedContent.description && (
                      <motion.p
                        layoutId={`description-${beneficiary.id}-${id}`}
                        className="text-gray-700 text-sm"
                      >
                        {localizedContent.description}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0, rotate: -90 }}
      animate={{ opacity: 1, rotate: 0 }}
      exit={{
        opacity: 0,
        rotate: 90,
        transition: { duration: 0.2 },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
