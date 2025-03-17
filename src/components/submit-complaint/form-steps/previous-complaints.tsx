"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import type { PreviousComplaintData } from "@/types/complaint"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/LanguageContext"

interface PreviousComplaintsProps {
  onNext: (data: PreviousComplaintData) => void
  onPrevious: () => void
  data?: PreviousComplaintData
}

export function PreviousComplaints({ onNext, onPrevious, data }: PreviousComplaintsProps) {
  const [formData, setFormData] = useState<PreviousComplaintData>({
    hasPreviousComplaint: data?.hasPreviousComplaint || false,
    previousComplaintEntity: data?.previousComplaintEntity || "",
    previousComplaintDate: data?.previousComplaintDate || "",
    receivedResponse: data?.receivedResponse || false,
    responseDate: data?.responseDate || "",
  })
  const { currentLang } = useLanguage()

  const validateForm = () => {
    if (formData.hasPreviousComplaint) {
      if (!formData.previousComplaintEntity?.trim()) {
        toast({
          title: currentLang === "ar" ? "خطأ" : "Error",
          description:
            currentLang === "ar" ? "الجهة المقدم إليها الشكوى السابقة مطلوبة" : "Previous complaint entity is required",
          variant: "destructive",
        })
        return false
      }
      if (!formData.previousComplaintDate?.trim()) {
        toast({
          title: currentLang === "ar" ? "خطأ" : "Error",
          description: currentLang === "ar" ? "تاريخ الشكوى السابقة مطلوب" : "Previous complaint date is required",
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    onNext(formData)
  }

  const labels = {
    en: {
      hasPreviousComplaint: "Have you filed a similar complaint before?",
      yes: "Yes",
      no: "No",
      previousEntity: "Previous Entity",
      previousDate: "Date of Previous Complaint",
      previous: "Previous",
      next: "Next",
    },
    ar: {
      hasPreviousComplaint: "هل قدمت شكوى مماثلة من قبل؟",
      yes: "نعم",
      no: "لا",
      previousEntity: "الجهة السابقة",
      previousDate: "تاريخ الشكوى السابقة",
      previous: "السابق",
      next: "التالي",
    },
  }

  const t = labels[currentLang as keyof typeof labels]

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>{t.hasPreviousComplaint}</Label>
        <RadioGroup
          defaultValue={formData.hasPreviousComplaint.toString()}
          onValueChange={(value) => setFormData({ ...formData, hasPreviousComplaint: value === "true" })}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="hasPreviousYes" />
            <Label htmlFor="hasPreviousYes">{t.yes}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="hasPreviousNo" />
            <Label htmlFor="hasPreviousNo">{t.no}</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.hasPreviousComplaint && (
        <>
          <div className="space-y-2">
            <Label htmlFor="previousEntity">{t.previousEntity}</Label>
            <Input
              id="previousEntity"
              value={formData.previousComplaintEntity}
              onChange={(e) => setFormData({ ...formData, previousComplaintEntity: e.target.value })}
              className={currentLang === "ar" ? "text-right" : "text-left"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousDate">{t.previousDate}</Label>
            <Input
              id="previousDate"
              type="date"
              value={formData.previousComplaintDate}
              onChange={(e) => setFormData({ ...formData, previousComplaintDate: e.target.value })}
              className={currentLang === "ar" ? "text-right" : "text-left"}
            />
          </div>
        </>
      )}

      <div className={`flex justify-between`}>
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
    </motion.form>
  )
}

