import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/LanguageContext"

interface ComplaintDetailsData {
  facts: string
}

interface ComplaintDetailsProps {
  onNext: (data: ComplaintDetailsData) => void
  onPrevious: () => void
  data?: ComplaintDetailsData
}

export function ComplaintDetails({ onNext, onPrevious, data }: ComplaintDetailsProps) {
  const [formData, setFormData] = useState({
    facts: data?.facts || "",
  })

  const { currentLang } = useLanguage()

  const labels = {
    en: {
      factsAndGrounds: "Facts and grounds of the complaint",
      factsPlaceholder: "Please describe in detail the facts and grounds of your complaint...",
      previous: "Previous",
      next: "Next"
    },
    ar: {
      factsAndGrounds: "حقائق وأسباب الشكوى",
      factsPlaceholder: "يرجى وصف حقائق وأسباب شكواك بالتفصيل...",
      previous: "السابق",
      next: "التالي"
    }
  }

  const t = labels[currentLang as keyof typeof labels]

  const validateForm = () => {
    if (!formData.facts.trim()) {
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description: currentLang === "ar" ? "حقائق وأسباب الشكوى مطلوبة" : "Facts and grounds are required",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext(formData)
    }
  }

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="facts">Facts and grounds of the complaint</Label>
        <Textarea
          id="facts"
          rows={6}
          value={formData.facts}
          onChange={(e) => setFormData({ ...formData, facts: e.target.value })}
          required
        />
      </div>

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
    </motion.form>
  )
}

