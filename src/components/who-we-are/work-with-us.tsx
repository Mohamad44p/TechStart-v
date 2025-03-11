"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon } from "lucide-react";
import type { WorkWithUsListing } from "@/app/actions/pages/work-with-us-actions";
import { format } from "date-fns";
import { AVAILABLE_ICONS, IconName } from "@/config/icons";
import { useLanguage } from "@/context/LanguageContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

interface WorkWithUsProps {
  procurementListings: WorkWithUsListing[];
  recruitmentListings: WorkWithUsListing[];
}

export function WorkWithUs({
  procurementListings,
  recruitmentListings,
}: WorkWithUsProps) {
  const { currentLang } = useLanguage();
  const isArabic = currentLang === "ar";

  const translations = {
    joinUs: isArabic ? "انضم إلينا" : "JOIN US",
    workWithUs: isArabic ? "اعمل معنا" : "Work With Us",
    description: isArabic
      ? "استكشف فرص التعاون والنمو مع تيك ستارت. نقدم طرقًا متنوعة للمشاركة في مشروعنا والمساهمة في تطوير قطاع تكنولوجيا المعلومات الفلسطيني."
      : "Explore opportunities to collaborate and grow with TechStart. We offer various ways to engage with our project and contribute to the Palestinian IT sector's development.",
    procurement: isArabic ? "العطائات" : "Procurement",
    recruitment: isArabic ? "التوظيف" : "Recruitment",
    deadline: isArabic ? "الموعد النهائي" : "Deadline",
    applyNow: isArabic ? "قدم الآن" : "Apply Now",
    comingSoon: isArabic ? "قريباً" : "Coming Soon",
    noListingsYet: isArabic
      ? "سيتم إضافة الفرص قريباً"
      : "Opportunities will be added soon",
    stayTuned: isArabic ? "ترقبوا المزيد" : "Stay tuned",
  };

  const ComingSoonMessage = () => (
    <motion.div
      variants={itemVariants}
      className="text-center p-12 bg-gray-50 rounded-lg w-full"
    >
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">
        {translations.comingSoon}
      </h3>
      <p className="text-gray-600">{translations.noListingsYet}</p>
      <p className="text-gray-500 mt-2">{translations.stayTuned}</p>
    </motion.div>
  );

  return (
    <div
      className={`bg-gradient-to-b from-blue-50 via-white to-green-50 py-24 ${
        isArabic ? "rtl" : "ltr"
      }`}
    >
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full mb-4">
            {translations.joinUs}
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            {translations.workWithUs}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {translations.description}
          </p>
        </motion.div>

        <Tabs defaultValue="procurements" className="w-full max-w-md mx-auto">
          <TabsList className="w-full max-w-md mx-auto mb-12 m-0 p-0 bg-blue-100 rounded-full">
            <TabsTrigger
              value="procurements"
              className="w-1/2 py-3 text-lg transition-all rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {translations.procurement}
            </TabsTrigger>
            <TabsTrigger
              value="recruitment"
              className="w-1/2 py-3 text-lg transition-all rounded-full data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {translations.recruitment}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="procurements">
            <motion.div
              variants={itemVariants}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {procurementListings.length > 0 ? (
                procurementListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    variant="procurement"
                    translations={translations}
                  />
                ))
              ) : (
                <div className="col-span-3">
                  <ComingSoonMessage />
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="recruitment">
            <motion.div
              variants={itemVariants}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {recruitmentListings.length > 0 ? (
                recruitmentListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    variant="recruitment"
                    translations={translations}
                  />
                ))
              ) : (
                <div className="col-span-3">
                  <ComingSoonMessage />
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

interface ListingCardProps {
  listing: WorkWithUsListing;
  variant: "procurement" | "recruitment";
  translations: Record<string, string>;
}

function ListingCard({ listing, variant, translations }: ListingCardProps) {
  const { currentLang } = useLanguage();
  const isArabic = currentLang === "ar";
  const Icon = AVAILABLE_ICONS[
    listing.iconName as IconName
  ] as React.ComponentType<{ className?: string }>;

  const formattedDate = isArabic
    ? new Date(listing.deadline).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : format(new Date(listing.deadline), "PPP");

  const colorScheme =
    variant === "procurement"
      ? {
          bg: "bg-blue-50",
          icon: "bg-blue-100 text-blue-600",
          button: "bg-blue-600 hover:bg-blue-700",
        }
      : {
          bg: "bg-green-50",
          icon: "bg-green-100 text-green-600",
          button: "bg-green-600 hover:bg-green-700",
        };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-105">
      <CardHeader
        className={`${colorScheme.bg} flex flex-row items-center space-y-0 gap-4`}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${colorScheme.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl font-semibold">
          {isArabic ? listing.titleAr : listing.titleEn}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-gray-600 mb-4">
          {isArabic ? listing.descriptionAr : listing.descriptionEn}
        </p>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {translations.deadline}: {formattedDate}
        </div>
        <div className="flex flex-wrap gap-2">
          {listing.tags.split(",").map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={`${colorScheme.bg}`}
            >
              {tag.trim()}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        {listing.applyLink ? (
          <Button
            className={`w-full ${colorScheme.button} text-white transition-colors`}
            asChild
          >
            <a
              href={listing.applyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {translations.applyNow}
            </a>
          </Button>
        ) : (
          <Button
            className={`w-full ${colorScheme.button} text-white transition-colors`}
            disabled
          >
            {translations.comingSoon}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
