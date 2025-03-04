"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLanguage } from "@/context/LanguageContext";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

interface TabButtonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function TabButtonDialog({ isOpen, onClose, title, content }: TabButtonDialogProps) {
  const { currentLang } = useLanguage();
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  const getDialogWidth = () => {
    if (windowWidth < 640) return "95%";
    if (windowWidth < 1024) return "80%";
    return "max-w-2xl";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${getDialogWidth()} max-h-[90vh] overflow-hidden flex flex-col`}
        style={{ width: windowWidth < 1024 ? getDialogWidth() : undefined }}
      >
        <DialogHeader className="flex justify-between items-start">
          <DialogTitle className="text-xl pr-8">{title}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-2 pb-4 text-sm text-muted-foreground">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        <DialogFooter className="mt-4 pt-2 border-t">
          <Button 
            onClick={onClose} 
            className="w-full sm:w-auto bg-gradient-to-r from-[#1C6AAF] to-[#872996] hover:opacity-90"
          >
            {currentLang === "ar" ? "إغلاق" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
