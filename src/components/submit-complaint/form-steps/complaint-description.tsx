"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import type { ComplaintDescriptionData } from "@/types/form-types"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/LanguageContext"

export interface ComplaintDescriptionProps {
  onNext: (data: ComplaintDescriptionData) => void
  onPrevious: () => void
  data?: ComplaintDescriptionData
}

export function ComplaintDescription({ onNext, onPrevious, data }: ComplaintDescriptionProps) {
  const [formData, setFormData] = useState<ComplaintDescriptionData>({
    description: data?.description || "",
    entity: data?.entity || "",
    filedInCourt: data?.filedInCourt || false,
  })
  const { currentLang } = useLanguage()

  const validateForm = () => {
    if (!formData.description.trim()) {
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description: currentLang === "ar" ? "وصف الشكوى مطلوب" : "Description of the complaint is required",
        variant: "destructive",
      })
      return false
    }
    if (!formData.entity.trim()) {
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description:
          currentLang === "ar"
            ? "الجهة المشتكى عليها مطلوبة"
            : "Entity against which the complaint is filed is required",
        variant: "destructive",
      })
      return false
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
      description: "Description of the Complaint",
      entity: "The entity against which the complaint is filed",
      filedInCourt: "Was this complaint filed in a court of law?",
      yes: "Yes",
      no: "No",
      previous: "Previous",
      next: "Next",
    },
    ar: {
      description: "وصف الشكوى",
      entity: "الجهة المشتكى عليها",
      filedInCourt: "هل تم تقديم هذه الشكوى في المحكمة؟",
      yes: "نعم",
      no: "لا",
      previous: "السابق",
      next: "التالي",
    },
  }

  const t = labels[currentLang as keyof typeof labels]

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="description">{t.description}</Label>
        <Textarea
          id="description"
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="entity">{t.entity}</Label>
        <Input
          id="entity"
          value={formData.entity}
          onChange={(e) => setFormData({ ...formData, entity: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>{t.filedInCourt}</Label>
        <RadioGroup
          defaultValue={formData.filedInCourt.toString()}
          onValueChange={(value) => setFormData({ ...formData, filedInCourt: value === "true" })}
          className="flex space-x-4 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="filedInCourtYes" />
            <Label htmlFor="filedInCourtYes">{t.yes}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="filedInCourtNo" />
            <Label htmlFor="filedInCourtNo">{t.no}</Label>
          </div>
        </RadioGroup>
      </div>

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

