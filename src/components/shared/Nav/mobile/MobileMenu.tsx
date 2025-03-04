"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import { LogoAnimation } from "../../Hero/LogoAnimation";
import { NavTranslations } from "@/types/navbar";
import { getNavbarPrograms } from "@/app/actions/navbar-actions";

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
  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // State for Programs (dynamic)
  const [programCategories, setProgramCategories] = useState<ProgramCategory[]>(
    []
  );
  const [programsLoading, setProgramsLoading] = useState(true);
  // State to control expanded sections (by section id)
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  // For Programs accordion: track expanded category id
  const [expandedProgCategory, setExpandedProgCategory] = useState<
    string | null
  >(null);
  // Track both expanded program and its tabs
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  // Add new state for media center subsections
  const [expandedMediaSubsection, setExpandedMediaSubsection] = useState<string | null>(null);

  // Fetch programs when menu opens
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

  // Handlers to toggle expanded section
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

  // Static arrays for subsections for About Us, Media Center & Contact Us
  const aboutUsItems = [
    {
      id: "who-we-are",
      name: translations.menuItems.aboutUs.whoWeAre,
      href: "/About-us",
    },
    {
      id: "partners",
      name: translations.menuItems.aboutUs.partners,
      href: "/partners",
    },
    {
      id: "it-leads",
      name: translations.menuItems.aboutUs.itLeads,
      href: "/Palestinian-IT-leads",
    },
    {
      id: "work-with-us",
      name: translations.menuItems.aboutUs.workWithUs,
      href: "/work-with-us",
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
          href: "/media-center/gallery/photos",
        },
        {
          id: "videos",
          name: translations.menuItems.mediaCenter.videos,
          href: "/media-center/gallery/videos",
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
          href: "/media-center/news",
        },
        {
          id: "publications",
          name: translations.menuItems.mediaCenter.publications,
          href: "/media-center/news/publications",
        },
        {
          id: "announcements",
          name: translations.menuItems.mediaCenter.announcements,
          href: "/media-center/news/announcements",
        },
      ],
    },
  ];

  const contactUsItems = [
    {
      id: "contact-us",
      name: translations.menuItems.contactUs.contact,
      href: "/Contact-us",
    },
    {
      id: "complaints",
      name: translations.menuItems.contactUs.complaints,
      href: "/submit-complaint",
    },
    { id: "faqs", name: translations.menuItems.contactUs.faqs, href: "/FAQs" },
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
        >
          <div className="flex flex-col min-h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="relative h-12 w-36 flex items-center justify-center">
                <LogoAnimation />
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex-grow p-4 space-y-2">
              {/* Home Link */}
              <Link
                href="/"
                onClick={onClose}
                className="block p-3 text-lg font-medium text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
              >
                Home
              </Link>

              {/* Programs Section */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleSection("programs")}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium text-[#1b316e]"
                >
                  {translations.programs}
                  <ChevronRight
                    size={24}
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
                      className="pl-4 space-y-1"
                    >
                      {programsLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          Loading...
                        </div>
                      ) : (
                        programCategories.map((category) => (
                          <div key={category.id} className="space-y-1">
                            <button
                              onClick={() => toggleProgramCategory(category.id)}
                              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <span>{category.name_en}</span>
                              <ChevronRight
                                size={20}
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
                                    className="pl-4 space-y-1"
                                  >
                                    {category.programs.map((program) => (
                                      <div
                                        key={program.id}
                                        className="space-y-1"
                                      >
                                        <button
                                          onClick={() =>
                                            toggleProgram(program.id)
                                          }
                                          className="flex items-center justify-between w-full px-4 py-2 text-sm text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                          <span>{program.name_en}</span>
                                          {program.ProgramTab &&
                                            program.ProgramTab.length > 0 && (
                                              <ChevronRight
                                                size={16}
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
                                                className="pl-4 space-y-1"
                                              >
                                                {program.ProgramTab.map(
                                                  (tab) => (
                                                    <Link
                                                      key={tab.id}
                                                      href={`/programs/${program.id}#${tab.slug}`}
                                                      onClick={onClose}
                                                      className="block px-4 py-2 text-sm text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                      {tab.title_en}
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

              {/* About Us Section */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("aboutus")}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium text-[#1b316e]"
                >
                  {translations.aboutUs}
                  <ChevronRight
                    size={24}
                    className={`transform transition-transform ${
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
                      transition={{ duration: 0.3 }}
                      className="pl-4 mt-2"
                    >
                      {aboutUsItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={onClose}
                          className="block px-4 py-2 text-sm text-[#1b316e] hover:bg-gray-100 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Media Center Section */}
              <div className="space-y-1">
                <button
                  onClick={() => toggleSection("mediacenter")}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium text-[#1b316e]"
                >
                  {translations.mediaCenter}
                  <ChevronRight
                    size={24}
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
                      className="pl-4 space-y-1"
                    >
                      {mediaCenterItems.map((section) => (
                        <div key={section.id} className="space-y-1">
                          <button
                            onClick={() => toggleSection(section.id)}
                            className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <span>{section.name}</span>
                            <ChevronRight
                              size={20}
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
                                className="pl-4 space-y-1"
                              >
                                {section.subItems.map((item) => (
                                  <Link
                                    key={item.id}
                                    href={item.href}
                                    onClick={onClose}
                                    className="block px-4 py-2 text-sm text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
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
              <Link
                href="/Safeguards"
                onClick={onClose}
                className="block p-3 text-lg font-medium text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
              >
                {translations.safeguards}
              </Link>

              {/* FAQs Link */}
              <Link
                href="/FAQs"
                onClick={onClose}
                className="block p-3 text-lg font-medium text-[#1b316e] hover:bg-gray-100 rounded-lg transition-colors"
              >
                FAQs
              </Link>

              {/* Contact Us Section */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection("contactus")}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 transition-colors text-lg font-medium text-[#1b316e]"
                >
                  {translations.contactUs}
                  <ChevronRight
                    size={24}
                    className={`transform transition-transform ${
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
                      transition={{ duration: 0.3 }}
                      className="pl-4 mt-2"
                    >
                      {contactUsItems.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={onClose}
                          className="block px-4 py-2 text-sm text-[#1b316e] hover:bg-gray-100 transition-colors"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
