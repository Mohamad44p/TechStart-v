"use client";

import { useState, useMemo } from "react";
import { ContentCard } from "./content-card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { ContentItem } from "@/types/blog";

interface ContentGridProps {
  title: string;
  subtitle: string;
  items: ContentItem[];
}

export function ContentGrid({ title, subtitle, items }: ContentGridProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const { currentLang } = useLanguage();

  const types = ["all", ...new Set(items.map((item) => item.type))];

  const getTypeLabel = (type: string) => {
    if (type === "all") {
      return currentLang === "ar" ? "الكل" : "All";
    }
    if (type === "blog") {
      return currentLang === "ar" ? "الأخبار والبيانات الصحفية" : "News & Press Releases";
    }
    return type;
  };

  const localizedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        title: currentLang === "ar" ? item.title_ar : item.title_en,
        description:
          currentLang === "ar" ? item.description_ar : item.description_en,
        tags:
          item.tags?.map((tag) => ({
            name: currentLang === "ar" ? tag.name_ar : tag.name_en,
            slug: tag.slug,
          })) || [],
      })),
    [items, currentLang]
  );

  const filteredItems = localizedItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.tags?.some((tag) =>
        tag.name.toLowerCase().includes(search.toLowerCase())
      );
    const matchesType = selectedType === "all" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-lg leading-8 text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="flex flex-col gap-6 max-w-xl mx-auto mb-12">
        <Input
          placeholder={
            currentLang === "ar"
              ? "ابحث بواسطة العنوان أو الوصف أو الوسوم..."
              : "Search by title, description, or tags..."
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-center"
        />

        <div className="flex flex-wrap gap-3 justify-center">
          {types.map((type) => (
            <Badge
              key={type}
              variant={selectedType === type ? "default" : "secondary"}
              className="cursor-pointer text-sm capitalize px-4 py-1.5"
              onClick={() => setSelectedType(type)}
            >
              {getTypeLabel(type)}
            </Badge>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg">
          {currentLang === "ar"
            ? "لا توجد عناصر تطابق معايير البحث."
            : "No items found matching your criteria."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative cursor-pointer hover:scale-105 transition-transform"
              onClick={() =>
                item.isPdf && item.pdfUrl
                  ? window.open(item.pdfUrl, "_blank")
                  : null
              }
            >
              <ContentCard {...item} isPdf={item.isPdf} tags={item.tags} />
              {item.isPdf && (
                <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-sm">
                  PDF
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
