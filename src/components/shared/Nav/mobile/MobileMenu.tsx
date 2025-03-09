"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronRight, Home } from "lucide-react";
import { LogoAnimation } from "../../Hero/LogoAnimation";
import { NavTranslations } from "@/types/navbar";
import { getNavbarPrograms } from "@/app/actions/navbar-actions";
import { useLanguage } from "@/context/LanguageContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  translations: NavTranslations;
}

interface ProgramCategory {
  id: string;
  name_en: string;
  name_ar: string;
  programs?: {
    id: string;
    name_en: string;
    name_ar: string;
    ProgramTab?: {
      id: string;
      title_en: string;
      title_ar: string;
      slug: string;
    }[];
  }[];
}

export default function MobileMenu({
  isOpen,
  onClose,
  translations,
}: MobileMenuProps) {
  const { currentLang } = useLanguage();
  const isArabic = currentLang === 'ar';

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [programCategories, setProgramCategories] = useState<ProgramCategory[]>(
    []
  );
  const [programsLoading, setProgramsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [expandedProgCategory, setExpandedProgCategory] = useState<
    string | null
  >(null);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [expandedMediaSubsection, setExpandedMediaSubsection] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      (async () => {
        try {
          const result = await getNavbarPrograms();
          if (result.success && result.categories) {
            setProgramCategories(result.categories);
          }
        } catch (error) {
          console.error("Error fetching programs:", error);
        } finally {
          setProgramsLoading(false);
        }
      })();
    }
  }, [isOpen]);

  const toggleSection = (sectionId: string) => {
    if (sectionId === "gallery" || sectionId === "news") {
      setExpandedMediaSubsection(expandedMediaSubsection === sectionId ? null : sectionId);
      return;
    }
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const toggleProgramCategory = (id: string) => {
    setExpandedProgCategory(expandedProgCategory === id ? null : id);
  };

  const toggleProgram = (programId: string) => {
    setExpandedProgram(expandedProgram === programId ? null : programId);
  };

  const aboutUsItems = [
    {
      id: "who-we-are",
      name: translations.menuItems.aboutUs.whoWeAre,
      href: `/${currentLang}/About-us`,
    },
    {
      id: "partners",
      name: translations.menuItems.aboutUs.partners,
      href: `/${currentLang}/partners`,
    },
    {
      id: "it-leads",
      name: translations.menuItems.aboutUs.itLeads,
      href: `/${currentLang}/Palestinian-IT-leads`,
    },
    {
      id: "work-with-us",
      name: translations.menuItems.aboutUs.workWithUs,
      href: `/${currentLang}/work-with-us`,
    },
  ];

  const mediaCenterItems = [
    {
      id: "gallery",
      name: translations.menuItems.mediaCenter.gallery,
      subItems: [
        {
          id: "photos",
          name: translations.menuItems.mediaCenter.photoGallery,
          href: `/${currentLang}/media-center/gallery/photos`,
        },
        {
          id: "videos",
          name: translations.menuItems.mediaCenter.videos,
          href: `/${currentLang}/media-center/gallery/videos`,
        },
      ],
    },
    {
      id: "news",
      name: translations.menuItems.mediaCenter.news,
      subItems: [
        {
          id: "news",
          name: translations.menuItems.mediaCenter.newsPress,
          href: `/${currentLang}/media-center/news`,
        },
        {
          id: "publications",
          name: translations.menuItems.mediaCenter.publications,
          href: `/${currentLang}/media-center/news/publications`,
        },
        {
          id: "announcements",
          name: translations.menuItems.mediaCenter.announcements,
          href: `/${currentLang}/media-center/news/announcements`,
        },
      ],
    },
  ];

  const contactUsItems = [
    {
      id: "contact-us",
      name: translations.menuItems.contactUs.contact,
      href: `/${currentLang}/Contact-us`,
    },
    {
      id: "complaints",
      name: translations.menuItems.contactUs.complaints,
      href: `/${currentLang}/submit-complaint`,
    },
    { 
      id: "faqs", 
      name: translations.menuItems.contactUs.faqs, 
      href: `/${currentLang}/FAQs` 
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white z-[1000] overflow-y-auto"
          dir={isArabic ? "rtl" : "ltr"}
        >
          <div className="flex flex-col min-h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
              <div className="relative h-12 w-36 flex items-center justify-center">
                <LogoAnimation />
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex-grow p-4 space-y-3">
              {/* Home link with icon */}
              <Link
                href={`/${currentLang}`}
                onClick={onClose}
                className="flex items-center gap-2 p-3 text-lg font-medium text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Home size={20} />
                <span>Home</span>
              </Link>

              {/* Main navigation items in a rounded container similar to desktop */}
              <div className="rounded-xl border border-gray-200/50 bg-white/80 backdrop-blur-md shadow-sm overflow-hidden">
                {/* About Us Section */}
                <div className="border-b border-gray-100 last:border-none">
                  <button
                    onClick={() => toggleSection("aboutus")}
                    className="flex items-center justify-between w-full p-4 transition-colors text-base font-medium text-[#1b316e] hover:bg-gray-50"
                  >
                    {translations.aboutUs}
                    <ChevronRight
                      size={20}
                      className={`transform transition-transform duration-200 ${
                        expandedSection === "aboutus" ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "aboutus" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50"
                      >
                        {aboutUsItems.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={onClose}
                            className="block px-6 py-3 text-sm text-[#1b316e] hover:bg-gray-100 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Programs Section */}
                <div className="border-b border-gray-100 last:border-none">
                  <button
                    onClick={() => toggleSection("programs")}
                    className="flex items-center justify-between w-full p-4 transition-colors text-base font-medium text-[#1b316e] hover:bg-gray-50"
                  >
                    {translations.programs}
                    <ChevronRight
                      size={20}
                      className={`transform transition-transform duration-200 ${
                        expandedSection === "programs" ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "programs" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50"
                      >
                        {programsLoading ? (
                          <div className="px-6 py-3 text-sm text-gray-500">
                            Loading...
                          </div>
                        ) : (
                          programCategories.map((category) => (
                            <div key={category.id} className="border-t border-gray-100 first:border-none">
                              <button
                                onClick={() => toggleProgramCategory(category.id)}
                                className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-[#1b316e] hover:bg-gray-100 transition-colors"
                              >
                                <span>{isArabic ? category.name_ar : category.name_en}</span>
                                <ChevronRight
                                  size={16}
                                  className={`transform transition-transform duration-200 ${
                                    expandedProgCategory === category.id
                                      ? "rotate-90"
                                      : ""
                                  }`}
                                />
                              </button>

                              <AnimatePresence>
                                {expandedProgCategory === category.id &&
                                  category.programs && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="bg-gray-100"
                                    >
                                      {category.programs.map((program) => (
                                        <div
                                          key={program.id}
                                          className="border-t border-gray-200/50"
                                        >
                                          <button
                                            onClick={() =>
                                              toggleProgram(program.id)
                                            }
                                            className="flex items-center justify-between w-full px-8 py-2.5 text-sm text-[#1b316e] hover:bg-gray-200/50 transition-colors"
                                          >
                                            <span>{isArabic ? program.name_ar : program.name_en}</span>
                                            {program.ProgramTab &&
                                              program.ProgramTab.length > 0 && (
                                                <ChevronRight
                                                  size={14}
                                                  className={`transform transition-transform duration-200 ${
                                                    expandedProgram === program.id
                                                      ? "rotate-90"
                                                      : ""
                                                  }`}
                                                />
                                              )}
                                          </button>

                                          <AnimatePresence>
                                            {expandedProgram === program.id &&
                                              program.ProgramTab && (
                                                <motion.div
                                                  initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                  }}
                                                  animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                  }}
                                                  exit={{ height: 0, opacity: 0 }}
                                                  transition={{ duration: 0.2 }}
                                                  className="bg-gray-200/50"
                                                >
                                                  {program.ProgramTab.map(
                                                    (tab) => (
                                                      <Link
                                                        key={tab.id}
                                                        href={`/${currentLang}/programs/${program.id}#${tab.slug}`}
                                                        onClick={onClose}
                                                        className="block px-10 py-2 text-sm text-[#1b316e] hover:bg-gray-200 transition-colors"
                                                      >
                                                        {isArabic ? tab.title_ar : tab.title_en}
                                                      </Link>
                                                    )
                                                  )}
                                                </motion.div>
                                              )}
                                          </AnimatePresence>
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </div>
                          ))
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Media Center Section */}
                <div className="border-b border-gray-100 last:border-none">
                  <button
                    onClick={() => toggleSection("mediacenter")}
                    className="flex items-center justify-between w-full p-4 transition-colors text-base font-medium text-[#1b316e] hover:bg-gray-50"
                  >
                    {translations.mediaCenter}
                    <ChevronRight
                      size={20}
                      className={`transform transition-transform duration-200 ${
                        expandedSection === "mediacenter" ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "mediacenter" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50"
                      >
                        {mediaCenterItems.map((section) => (
                          <div key={section.id} className="border-t border-gray-100 first:border-none">
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="flex items-center justify-between w-full px-6 py-3 text-sm font-medium text-[#1b316e] hover:bg-gray-100 transition-colors"
                            >
                              <span>{section.name}</span>
                              <ChevronRight
                                size={16}
                                className={`transform transition-transform duration-200 ${
                                  expandedMediaSubsection === section.id ? "rotate-90" : ""
                                }`}
                              />
                            </button>

                            <AnimatePresence>
                              {expandedMediaSubsection === section.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="bg-gray-100"
                                >
                                  {section.subItems.map((item) => (
                                    <Link
                                      key={item.id}
                                      href={item.href}
                                      onClick={onClose}
                                      className="block px-8 py-2.5 text-sm text-[#1b316e] hover:bg-gray-200/50 transition-colors"
                                    >
                                      {item.name}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Safeguards Link */}
                <div className="border-b border-gray-100 last:border-none">
                  <Link
                    href={`/${currentLang}/Safeguards`}
                    onClick={onClose}
                    className="flex items-center justify-between w-full p-4 transition-colors text-base font-medium text-[#1b316e] hover:bg-gray-50"
                  >
                    {translations.safeguards}
                  </Link>
                </div>

                {/* Contact Us Section */}
                <div className="last:border-none">
                  <button
                    onClick={() => toggleSection("contactus")}
                    className="flex items-center justify-between w-full p-4 transition-colors text-base font-medium text-[#1b316e] hover:bg-gray-50"
                  >
                    {translations.contactUs}
                    <ChevronRight
                      size={20}
                      className={`transform transition-transform duration-200 ${
                        expandedSection === "contactus" ? "rotate-90" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedSection === "contactus" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-50"
                      >
                        {contactUsItems.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={onClose}
                            className="block px-6 py-3 text-sm text-[#1b316e] hover:bg-gray-100 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
