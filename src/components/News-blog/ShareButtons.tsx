"use client";

import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Link2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "../ui/button";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const { toast } = useToast();
  const { currentLang } = useLanguage();
  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}${url}`;

  const shareButtons = [
    {
      icon: Facebook,
      label: "Facebook",
      onClick: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
          "_blank"
        ),
      color: "#1877f2",
    },
    {
      icon: Twitter,
      label: "Twitter",
      onClick: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`,
          "_blank"
        ),
      color: "#1da1f2",
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      onClick: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
          "_blank"
        ),
      color: "#0a66c2",
    },
    {
      icon: Mail,
      label: "Email",
      onClick: () =>
        window.open(
          `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(fullUrl)}`,
          "_blank"
        ),
      color: "#ea4335",
    },
    {
      icon: Link2,
      label: "Copy Link",
      onClick: () => {
        navigator.clipboard.writeText(fullUrl);
        toast({
          title: currentLang === "ar" ? "تم النسخ" : "Copied",
          description:
            currentLang === "ar"
              ? "تم نسخ الرابط إلى الحافظة"
              : "Link copied to clipboard",
        });
      },
      color: "#6b7280",
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 sticky top-24"
    >
      <h3 className="text-lg font-semibold mb-4">
        {currentLang === "ar" ? "مشاركة" : "Share"}
      </h3>
      <div className="flex flex-col gap-3">
        {shareButtons.map((button) => (
          <Button
            key={button.label}
            onClick={button.onClick}
            className="w-full justify-start gap-3 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: button.color }}
          >
            <button.icon className="h-5 w-5" />
            {button.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}
