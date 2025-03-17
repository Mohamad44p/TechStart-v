"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ComplainantInfo } from "./form-steps/complainant-info"
import { ComplaintDescription } from "./form-steps/complaint-description"
import { PreviousComplaints } from "./form-steps/previous-complaints"
import { ComplaintDetails } from "./form-steps/complaint-details"
import { Attachments } from "./form-steps/attachments"
import { Confirmation } from "./form-steps/confirmation"
import { AnonymousComplaintForm } from "./anonymous-complaint-form"
import type { FormDataType } from "@/types/form-types"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/LanguageContext"

export function ComplaintForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormDataType>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { currentLang } = useLanguage()

  const steps = {
    en: [
      "Complainant Info",
      "Complaint Description",
      "Previous Complaints",
      "Complaint Details",
      "Attachments",
      "Confirmation",
    ],
    ar: ["معلومات مقدم الشكوى", "وصف الشكوى", "الشكاوى السابقة", "تفاصيل الشكوى", "المرفقات", "التأكيد"],
  }

  const labels = {
    en: {
      regularComplaint: "Regular Complaint",
      anonymousComplaint: "Anonymous Complaint",
    },
    ar: {
      regularComplaint: "شكوى عادية",
      anonymousComplaint: "شكوى مجهولة",
    },
  }

  const t = labels[currentLang as keyof typeof labels]

  const handleNext = (stepData: Partial<FormDataType>) => {
    setFormData((prevData) => ({ ...prevData, ...stepData }))
    setCurrentStep((prev) => Math.min(prev + 1, steps[currentLang as keyof typeof steps].length - 1))
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleSubmit = async (data: FormDataType & { confirmed: boolean }) => {
    setIsSubmitting(true)
    const finalData = { ...formData, ...data }
    try {
      const response = await fetch("/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      })

      if (!response.ok) {
        throw new Error("Failed to submit complaint")
      }

      const result = await response.json()
      if (result.success) {
        toast({
          title: currentLang === "ar" ? "تم تقديم الشكوى" : "Complaint Submitted",
          description:
            currentLang === "ar"
              ? `تم تقديم شكواك بنجاح. رقم الشكوى: ${result.complaintNumber}`
              : `Your complaint has been successfully submitted. Complaint number: ${result.complaintNumber}`,
        })
        // Reset form or redirect to a success page
        setFormData({})
        setCurrentStep(0)
      } else {
        throw new Error(result.error || "Failed to submit complaint")
      }
    } catch (error) {
      console.error("Error submitting complaint:", error)
      toast({
        title: currentLang === "ar" ? "خطأ" : "Error",
        description:
          currentLang === "ar"
            ? "فشل في تقديم الشكوى. يرجى المحاولة مرة أخرى."
            : "Failed to submit complaint. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`max-w-4xl mx-auto ${currentLang === "ar" ? "rtl" : "ltr"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <Tabs defaultValue="regular" className="w-full" dir={currentLang === "ar" ? "rtl" : "ltr"}>
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="regular" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E78C2] data-[state=active]:to-[#862996] data-[state=active]:text-white"
              >
                {t.regularComplaint}
              </TabsTrigger>
              <TabsTrigger 
                value="anonymous"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1E78C2] data-[state=active]:to-[#862996] data-[state=active]:text-white"
              >
                {t.anonymousComplaint}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="regular">
              <div className="mb-8">
                <div className="relative">
                  <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
                    {steps[currentLang as keyof typeof steps].map((step, idx) => (
                      <motion.div
                        key={step}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(idx <= currentStep ? 100 : 0) / steps[currentLang as keyof typeof steps].length}%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-[#1E78C2] to-[#862996]"
                      />
                    ))}
                  </div>
                  <div className={`flex ${currentLang === "ar" ? "flex-row-reverse" : "flex-row"} justify-between`}>
                    {steps[currentLang as keyof typeof steps].map((step, idx) => (
                      <div
                        key={step}
                        className={`flex flex-col items-center ${
                          idx <= currentStep ? "text-[#1E78C2]" : "text-gray-400"
                        }`}
                      >
                        <div
                          className={`rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 flex items-center justify-center ${
                            idx <= currentStep 
                              ? "border-none bg-gradient-to-r from-[#1E78C2] to-[#862996] text-white" 
                              : "border-gray-300"
                          }`}
                        >
                          {idx + 1}
                        </div>
                        <div className="text-xs mt-2 text-center">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: currentLang === "ar" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: currentLang === "ar" ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentStep === 0 && <ComplainantInfo onNext={handleNext} data={formData} />}
                  {currentStep === 1 && (
                    <ComplaintDescription
                      onNext={(data) => handleNext({ complaintDescription: data })}
                      onPrevious={handlePrevious}
                      data={formData.complaintDescription}
                    />
                  )}
                  {currentStep === 2 && (
                    <PreviousComplaints
                      onNext={(data) => handleNext({ previousComplaints: data })}
                      onPrevious={handlePrevious}
                      data={formData.previousComplaints}
                    />
                  )}
                  {currentStep === 3 && (
                    <ComplaintDetails
                      onNext={(data) => handleNext({ complaintDetails: data })}
                      onPrevious={handlePrevious}
                      data={formData.complaintDetails}
                    />
                  )}
                  {currentStep === 4 && (
                    <Attachments
                      onNext={(data) => handleNext({ attachments: data.attachments })}
                      onPrevious={handlePrevious}
                      data={{ attachments: formData.attachments || [] }}
                    />
                  )}
                  {currentStep === 5 && (
                    <Confirmation
                      onSubmit={handleSubmit}
                      onPrevious={handlePrevious}
                      data={formData}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="anonymous">
              <AnonymousComplaintForm />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}

