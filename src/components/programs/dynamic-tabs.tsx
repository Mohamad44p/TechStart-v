"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { FaqProvider } from "@/context/FaqContext";
import { FAQSection } from "@/components/faq-section/faq-section";
import type { ProgramTab as PrismaProgramTab, FaqCategory, FaqItem, ProgramsPages as PrismaProgram } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { useMediaQuery } from "@/lib/use-media-query";
import { TabButtonDialog } from "./tab-button-dialog";
import type { TabButton } from "@/types/program-tab";
import { usePathname } from "next/navigation";

interface ExtendedProgramTab extends Omit<PrismaProgramTab, 'buttons'> {
  buttons: TabButton[];
  programPage?: PrismaProgram | null;
}

interface DynamicTabsProps {
  tabs: ExtendedProgramTab[];
  lang: string;
  faqCategories: FaqCategory[];
  faqsByCategory: Record<string, FaqItem[]>;
  programName?: string;
  programId?: string;
}

export default function DynamicTabs({ tabs, lang, faqCategories, faqsByCategory, programName, programId }: DynamicTabsProps): JSX.Element {
  const { currentLang } = useLanguage();
  const [activeTab, setActiveTab] = useState(tabs[0]?.slug || "");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedButton, setSelectedButton] = useState<{ title: string; content: string } | null>(null);
  const pathname = usePathname();
  const [activeAccordion, setActiveAccordion] = useState<string | undefined>(tabs[0]?.slug);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && tabs.some((tab) => tab.slug === hash)) {
        setActiveTab(hash);
        setActiveAccordion(hash);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [tabs]);

  useEffect(() => {
    if (activeTab && !window.location.hash.includes(activeTab)) {
      window.history.replaceState(null, "", `${pathname}#${activeTab}`);
    }
  }, [activeTab, pathname]);

  if (!tabs.length) return <></>;

  const allTabs = [
    ...tabs,
    {
      id: "faqs",
      slug: "faqs",
      title_en: "FAQs",
      title_ar: "الأسئلة الشائعة",
      content_en: "",
      content_ar: "",
      buttons: [],
      processFile: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      programPageId: null,
    } as ExtendedProgramTab,
  ];

  const buttonText = {
    overview: {
      en: "Grant overview",
      ar: "نظرة عامة على المنحة",
    },
    apply: {
      en: "APPLY HERE",
      ar: "تقدم الآن",
    },
    availability: {
      en: "The provision of this grant is subject to fund availability.",
      ar: "يخضع تقديم هذه المنحة لتوفر التمويل.",
    },
  };

  const handleProcessDetailsClick = (tab: ExtendedProgramTab) => {
    if (tab.processFile) {
      window.open(tab.processFile, "_blank");
    }
  };

  const renderTabContent = (tab: ExtendedProgramTab) => (
    <div className={`space-y-6 ${currentLang === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="prose max-w-none">
        <div
          dangerouslySetInnerHTML={{
            __html: lang === "ar" ? tab.content_ar : tab.content_en,
          }}
        />
      </div>

      <div className="space-y-4">
        <div className="w-full">
          <div className={`flex flex-wrap gap-3 ${currentLang === 'ar' ? 'justify-end' : 'justify-start'}`}>
            <Button
              variant="outline"
              size="sm"
              className="hover:bg-gradient-to-r hover:from-[#1C6AAF]/10 hover:to-[#872996]/10 
                       transition-all duration-300 border-gray-200 min-w-[120px] h-10 px-4 py-2"
              onClick={() => handleProcessDetailsClick(tab)}
              disabled={!tab.processFile}
            >
              {currentLang === "ar" ? buttonText.overview.ar : buttonText.overview.en}
            </Button>

            {tab.buttons && tab.buttons.length > 0 &&
              tab.buttons.map((button) => (
                <Button
                  key={button.id}
                  variant="outline"
                  size="sm"
                  className="h-10 min-w-[120px] px-4 py-2 hover:bg-gradient-to-r hover:from-[#1C6AAF]/10 
                           hover:to-[#872996]/10 border-gray-200 transition-all duration-300"
                  onClick={() => {
                    setSelectedButton({
                      title: currentLang === "ar" ? button.name_ar : button.name_en,
                      content: currentLang === "ar" ? button.content_ar : button.content_en,
                    });
                    setIsDialogOpen(true);
                  }}
                >
                  {currentLang === "ar" ? button.name_ar : button.name_en}
                </Button>
              ))
            }
          </div>

          <div className={`mt-6 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
            <Link href={programId === "cm7urp3n80015t718sk4lzm6r" 
              ? "https://fs20.formsite.com/DAIForms/np9dh3xik0/login" 
              : "https://fs20.formsite.com/DAIForms/smr0etmskv/login"} target="_blank" rel="noopener noreferrer">
              <Button
                size="default"
                className="bg-gradient-to-r from-[#1C6AAF] to-[#872996] hover:opacity-90 
                         transition-opacity shadow-lg hover:shadow-xl text-sm sm:text-base
                         px-8 py-2.5"
              >
                {currentLang === "ar"
                  ? buttonText.apply.ar
                  : buttonText.apply.en}
              </Button>
            </Link>
          </div>
        </div>

        <p className={`text-xs sm:text-sm text-gray-500 italic ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
          {currentLang === "ar"
            ? buttonText.availability.ar
            : buttonText.availability.en}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex-grow bg-gradient-to-b py-[1rem] from-gray-50 to-white" id="tabs-section">
      <motion.div
        className="container mx-auto h-full pt-8 pb-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Tabs Title and Description Section */}
        <div className="mb-12 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 p-3 bg-gradient-to-r from-[#1C6AAF] to-[#872996] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {programName ? `${currentLang === "ar" ? "منحه " : ""}${programName} ${currentLang === "ar" ? "" : "Windows"}` : (currentLang === "ar" ? "تفاصيل البرنامج" : "Program Details")}
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-[#1C6AAF] to-[#872996] mx-auto mb-6"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.7 }}
          />
        </div>

        {isMobile ? (
          <Accordion 
            type="single" 
            defaultValue={activeAccordion}
            value={activeAccordion}
            onValueChange={setActiveAccordion}
            className="w-full space-y-4"
          >
            {allTabs.map((tab) => (
              <AccordionItem key={tab.slug} value={tab.slug}>
                <AccordionTrigger className="text-lg font-semibold hover:bg-gradient-to-r hover:from-[#1C6AAF]/5 hover:to-[#872996]/5 px-4 py-2 rounded-lg transition-all duration-300">
                  {lang === "ar" ? tab.title_ar : tab.title_en}
                </AccordionTrigger>
                <AccordionContent className="px-4 py-6">
                  {tab.slug === "faqs" ? (
                    <FaqProvider>
                      <FAQSection
                        categories={faqCategories.map((category) => ({
                          ...category,
                          faqs: faqsByCategory[category.id] || [],
                        }))}
                        faqsByCategory={faqsByCategory}
                      />
                    </FaqProvider>
                  ) : (
                    renderTabContent(tab as ExtendedProgramTab)
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className={`flex flex-col lg:flex-row items-start h-full gap-6 ${currentLang === 'ar' ? 'lg:flex-row-reverse' : ''}`}
          >
            <div className="lg:w-96 w-full">
              <div
                className="sticky top-4 z-10 rounded-xl shadow-lg overflow-hidden backdrop-blur-md bg-white/90 border border-gray-100"
              >
                <TabsList
                  className="flex flex-col h-auto overflow-y-auto custom-scrollbar 
                                   scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent w-auto min-w-full"
                >
                  <div className="flex flex-col items-stretch w-full p-3 gap-2.5">
                    {allTabs.map((tab) => (
                      <TabsTrigger
                        key={tab.slug}
                        value={tab.slug}
                        className={`group flex items-center w-full px-4 py-4 text-start transition-all duration-300 text-sm font-medium text-gray-600 data-[state=active]:bg-gradient-to-r ${currentLang === 'ar' ? 'data-[state=active]:from-[#872996] data-[state=active]:to-[#1C6AAF] text-right' : 'data-[state=active]:from-[#1C6AAF] data-[state=active]:to-[#872996] text-left'} data-[state=active]:text-white rounded-lg hover:bg-gradient-to-r hover:from-[#1C6AAF]/5 hover:to-[#872996]/5 focus:outline-none focus:ring-2 focus:ring-[#1C6AAF]/50 relative overflow-hidden whitespace-normal break-words`}
                      >
                        <motion.div
                          className={`relative flex items-center gap-3 w-full ${currentLang === 'ar' ? 'flex-row-reverse' : ''}`}
                          whileHover={{ x: currentLang === 'ar' ? -3 : 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-current opacity-60" />
                          <span className="flex-grow">
                            {lang === "ar" ? tab.title_ar : tab.title_en}
                          </span>
                        </motion.div>
                      </TabsTrigger>
                    ))}
                  </div>
                </TabsList>
              </div>
            </div>

            <div
              className="flex-grow w-full lg:max-w-[calc(100%-25rem)] bg-white rounded-xl shadow-lg p-8 border border-gray-100"
            >
              {tabs.map((tab) => (
                <TabsContent
                  key={tab.slug}
                  value={tab.slug}
                  className="[&[data-state=active]]:animate-in [&[data-state=active]]:fade-in-50"
                >
                  {renderTabContent(tab)}
                </TabsContent>
              ))}

              <TabsContent value="faqs">
                <FaqProvider>
                  <FAQSection
                    categories={faqCategories.map((category) => ({
                      ...category,
                      faqs: faqsByCategory[category.id] || [],
                    }))}
                    faqsByCategory={faqsByCategory}
                  />
                </FaqProvider>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </motion.div>
      <TabButtonDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={selectedButton?.title || ""}
        content={selectedButton?.content || ""}
      />
    </div>
  );
}