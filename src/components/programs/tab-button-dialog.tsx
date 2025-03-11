"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

interface TabButtonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function TabButtonDialog({ isOpen, onClose, title, content }: TabButtonDialogProps) {
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
        </DialogHeader>

        <div className="flex-1 overflow-y-auto mt-2 pb-4 text-sm text-muted-foreground">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
