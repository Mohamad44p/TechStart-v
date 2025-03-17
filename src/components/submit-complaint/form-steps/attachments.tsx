import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/lib/FileUpload";
import { AttachmentData } from "@/types/complaint";
import { useLanguage } from "@/context/LanguageContext";

interface AttachmentsProps {
  onNext: (data: { attachments: AttachmentData[] }) => void;
  onPrevious: () => void;
  data: { attachments: AttachmentData[] };
}

export function Attachments({ onNext, onPrevious, data }: AttachmentsProps) {
  const [files, setFiles] = useState<AttachmentData[]>(data.attachments || []);
  const { currentLang } = useLanguage();
  
  const labels = {
    en: {
      previous: "Previous",
      next: "Next"
    },
    ar: {
      previous: "السابق",
      next: "التالي"
    }
  };
  
  const t = labels[currentLang as keyof typeof labels];

  const handleUpload = (uploadedFiles: string[]) => {
    const newAttachments = uploadedFiles.map(url => ({
      fileUrl: url,
      fileName: url.split('/').pop() || '',
      fileType: url.split('.').pop() || '',
      fileSize: 0 // You might want to get this from the upload response
    }));
    setFiles([...files, ...newAttachments]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ attachments: files });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FileUpload
            onUpload={handleUpload}
            defaultFiles={files.map(f => f.fileUrl)}
            maxFiles={5}
          />

          <div className="flex justify-between mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onPrevious}
            >
              {t.previous}
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-[#1E78C2] to-[#862996] hover:opacity-90 text-white"
            >
              {t.next}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
