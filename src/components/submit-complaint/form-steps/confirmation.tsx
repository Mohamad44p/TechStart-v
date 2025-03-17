"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import type { FormDataType } from "@/types/form-types"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/LanguageContext"

interface ConfirmationProps {
  onSubmit: (data: FormDataType & { confirmed: boolean }) => void
  onPrevious: () => void
  data: FormDataType
  isSubmitting: boolean
}

export function Confirmation({ onSubmit, onPrevious, data, isSubmitting }: ConfirmationProps) {
  const [confirmed, setConfirmed] = useState(false)
  const { currentLang } = useLanguage()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!confirmed) {
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description:
          currentLang === "ar"
            ? "يجب تأكيد تفاصيل الشكوى قبل التقديم"
            : "You must confirm the complaint details before submitting",
        variant: "destructive",
      })
      return
    }
    onSubmit({ ...data, confirmed })
  }

  const labels = {
    en: {
      confirmation:
        "I, the complainant, do hereby assert and confirm that the aforementioned information, data and attachments are genuine, legitimate and accurate, and I undertake to bear full legal liability if they were found to be otherwise at any point of time, or if the complaint was found to be filed maliciously or with ill-intention.",
      previous: "Previous",
      submit: "Submit Complaint",
      submitting: "Submitting...",
    },
    ar: {
      confirmation:
        "أنا، مقدم الشكوى، أؤكد وأقر بأن المعلومات والبيانات والمرفقات المذكورة أعلاه صحيحة وشرعية ودقيقة، وأتعهد بتحمل المسؤولية القانونية الكاملة إذا تبين أنها غير ذلك في أي وقت، أو إذا تبين أن الشكوى قدمت بسوء نية أو بقصد الإضرار.",
      previous: "السابق",
      submit: "تقديم الشكوى",
      submitting: "جاري التقديم...",
    },
  }

  const t = labels[currentLang as keyof typeof labels]

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="confirmation"
          checked={confirmed}
          onCheckedChange={(checked) => setConfirmed(checked as boolean)}
        />
        <Label
          htmlFor="confirmation"
          className={`text-sm ${currentLang === "ar" ? "text-right mr-2" : "text-left ml-2"}`}
        >
          {t.confirmation}
        </Label>
      </div>

      <div className="flex justify-between mt-8">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
        >
          {t.previous}
        </Button>
        <Button 
          type="submit" 
          disabled={!confirmed || isSubmitting}
          className="bg-gradient-to-r from-[#1E78C2] to-[#862996] hover:opacity-90 text-white"
        >
          {isSubmitting ? t.submitting : t.submit}
        </Button>
      </div>
    </motion.form>
  )
}

