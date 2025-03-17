"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { FormEvent } from "react"
import type { ComplainantData } from "@/types/form-types"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/LanguageContext"

interface ComplainantInfoProps {
  onNext: (data: { complainantInfo: ComplainantData }) => void
  data: { complainantInfo?: ComplainantData }
}

export function ComplainantInfo({ onNext, data }: ComplainantInfoProps) {
  const [complainantType, setComplainantType] = useState<"individual" | "firm">(
    data.complainantInfo?.complainantType || "individual",
  )
  const [formData, setFormData] = useState<ComplainantData>({
    complainantType: data.complainantInfo?.complainantType || "individual",
    name: data.complainantInfo?.name || "",
    gender: data.complainantInfo?.gender || "",
    phone: data.complainantInfo?.phone || "",
    email: data.complainantInfo?.email || "",
    firmName: data.complainantInfo?.firmName || "",
    firmPhone: data.complainantInfo?.firmPhone || "",
    firmEmail: data.complainantInfo?.firmEmail || "",
  })
  const { currentLang } = useLanguage()

  const validateForm = () => {
    if (complainantType === "individual") {
      if (!formData.name?.trim()) {
        toast({
          title: currentLang === "ar" ? "خطأ" : "Error",
          description: currentLang === "ar" ? "الاسم مطلوب" : "Name is required",
          variant: "destructive",
        })
        return false
      }
      if (!formData.phone?.trim()) {
        toast({
          title: currentLang === "ar" ? "خطأ" : "Error",
          description: currentLang === "ar" ? "رقم الهاتف مطلوب" : "Phone number is required",
          variant: "destructive",
        })
        return false
      }
      if (!formData.email?.trim()) {
        toast({
          title: currentLang === "ar" ? "خطأ" : "Error",
          description: currentLang === "ar" ? "البريد الإلكتروني مطلوب" : "Email is required",
          variant: "destructive",
        })
        return false
      }
    } else {
      if (!formData.firmName?.trim()) {
        toast({
          title: currentLang === "ar" ? "خطأ" : "Error",
          description: currentLang === "ar" ? "اسم الشركة مطلوب" : "Firm name is required",
          variant: "destructive",
        })
        return false
      }
      if (!formData.firmPhone?.trim()) {
        toast({
          title: currentLang === "ar" ? "خطأ" : "Error",
          description: currentLang === "ar" ? "رقم هاتف الشركة مطلوب" : "Firm phone number is required",
          variant: "destructive",
        })
        return false
      }
      if (!formData.firmEmail?.trim()) {
        toast({
          title: currentLang === "ar" ? "خطأ" : "Error",
          description: currentLang === "ar" ? "البريد الإلكتروني للشركة مطلوب" : "Firm email is required",
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
    onNext({ complainantInfo: { ...formData, complainantType } })
  }

  const labels = {
    en: {
      complainantType: "Complainant Type",
      individual: "Individual",
      firm: "Firm",
      name: "Name",
      gender: "Gender",
      male: "Male",
      female: "Female",
      firmName: "Firm Name",
      phone: "Phone Number",
      email: "Email Address",
      next: "Next",
    },
    ar: {
      complainantType: "نوع مقدم الشكوى",
      individual: "فرد",
      firm: "شركة",
      name: "الاسم",
      gender: "الجنس",
      male: "ذكر",
      female: "أنثى",
      firmName: "اسم الشركة",
      phone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      next: "التالي",
    },
  }

  const t = labels[currentLang as keyof typeof labels]

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className={`space-y-6 ${currentLang === 'ar' ? "rtl" : "ltr"}`}
    >
      <div className="space-y-4">
        <Label className={`${currentLang === "ar" ? "text-right block" : ""}`}>
          {t.complainantType}
        </Label>
        <RadioGroup
          defaultValue={complainantType}
          onValueChange={(value) => {
            setComplainantType(value as "individual" | "firm")
            setFormData({ ...formData, complainantType: value as "individual" | "firm" })
          }}
          className={`flex ${currentLang === "ar" ? "flex-row-reverse justify-end" : ""} gap-4`}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" className={`${currentLang === "ar" ? "ml-2" : "mr-2"}`} />
            <Label htmlFor="individual">{t.individual}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="firm" id="firm" className={`${currentLang === "ar" ? "ml-2" : "mr-2"}`} />
            <Label htmlFor="firm">{t.firm}</Label>
          </div>
        </RadioGroup>
      </div>

      {complainantType === "individual" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="name">{t.name}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className={currentLang === "ar" ? "text-right" : "text-left"}
            />
          </div>
          <div>
            <Label>{t.gender}</Label>
            <RadioGroup
              defaultValue={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
              className={`flex space-x-4 mt-2 ${currentLang === "ar" ? "flex-row-reverse" : ""}`}
            >
              <div className={`flex items-center ${currentLang === "ar" ? "space-x-reverse" : "space-x-2"}`}>
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">{t.male}</Label>
              </div>
              <div className={`flex items-center ${currentLang === "ar" ? "space-x-reverse" : "space-x-2"}`}>
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">{t.female}</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="firmName">{t.firmName}</Label>
          <Input
            id="firmName"
            value={formData.firmName}
            onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
            required
            className={currentLang === "ar" ? "text-right" : "text-left"}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor={complainantType === "individual" ? "phone" : "firmPhone"}>{t.phone}</Label>
        <Input
          id={complainantType === "individual" ? "phone" : "firmPhone"}
          type="tel"
          value={complainantType === "individual" ? formData.phone : formData.firmPhone}
          onChange={(e) =>
            setFormData(
              complainantType === "individual"
                ? { ...formData, phone: e.target.value }
                : { ...formData, firmPhone: e.target.value },
            )
          }
          required
          className={currentLang === "ar" ? "text-right" : "text-left"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor={complainantType === "individual" ? "email" : "firmEmail"}>{t.email}</Label>
        <Input
          id={complainantType === "individual" ? "email" : "firmEmail"}
          type="email"
          value={complainantType === "individual" ? formData.email : formData.firmEmail}
          onChange={(e) =>
            setFormData(
              complainantType === "individual"
                ? { ...formData, email: e.target.value }
                : { ...formData, firmEmail: e.target.value },
            )
          }
          required
          className={currentLang === "ar" ? "text-right" : "text-left"}
        />
      </div>

      <div className="flex justify-end mt-6">
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

