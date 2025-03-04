"use client";

import React, { useState, useRef} from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownProps } from "@/types/navbar";
import { useLanguage } from "@/context/LanguageContext";

export const MediaCenterDropdown: React.FC<DropdownProps> = ({ setPosition, translations }) => {
    const { currentLang } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<string | null>(null);
    const ref = useRef<null | HTMLLIElement>(null);

    const menuItems = [
        {
            id: "gallery",
            name: translations.menuItems.mediaCenter.gallery,
            subItems: [
                { id: "photo-gallery", name: translations.menuItems.mediaCenter.photoGallery, href: "/media-center/gallery/photos" },
                { id: "videos", name: translations.menuItems.mediaCenter.videos, href: "/media-center/gallery/videos" },
            ],
        },
        {
            id: "news",
            name: translations.menuItems.mediaCenter.news,
            subItems: [
                { id: "news-press", name: translations.menuItems.mediaCenter.newsPress, href: "/media-center/news" },
                { id: "publications", name: translations.menuItems.mediaCenter.publications, href: "/media-center/news/publications" },
                { id: "announcements", name: translations.menuItems.mediaCenter.announcements, href: "/media-center/news/announcements" }
            ],
        },
    ];

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
                });
                setIsOpen(true);
            }}
            onMouseLeave={() => {
                setIsOpen(false);
                setActiveItem(null);
            }}
            className="relative z-10 block cursor-pointer px-3 py-1.5 text-base font-medium text-[#1b316e] transition-colors hover:text-white"
        >
            {translations.mediaCenter}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className={`absolute mt-2 w-64 rounded-xl bg-white/90 backdrop-blur-md shadow-lg shadow-purple-500/20 border border-purple-100/20 overflow-hidden ${
                            currentLang === "ar" ? "right-0" : "left-0"
                        }`}
                    >
                        <div className="py-1">
                            {menuItems.map((item) => (
                                <div key={item.id}>
                                    <button
                                        onClick={() =>
                                            setActiveItem(activeItem === item.id ? null : item.id)
                                        }
                                        className="w-full text-left px-4 py-2.5 text-sm text-[#1b316e] hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:text-[#1b316e] transition-all group flex items-center justify-between"
                                    >
                                        {item.name}
                                        <motion.span
                                            animate={{
                                                rotate: activeItem === item.id ? 180 : 0,
                                            }}
                                            className="text-xs opacity-50 group-hover:opacity-100"
                                        >
                                            ▼
                                        </motion.span>
                                    </button>
                                    <AnimatePresence>
                                        {activeItem === item.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-gray-50"
                                            >
                                                {item.subItems.map((subItem) => (
                                                    <Link
                                                        href={subItem.href}
                                                        key={subItem.id}
                                                        className="block px-6 py-2 text-sm text-[#1b316e] hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:text-[#1b316e] transition-all"
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </li>
    );
};

