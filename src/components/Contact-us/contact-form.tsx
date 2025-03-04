"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Send } from "lucide-react"
import { submitContactForm } from "@/app/actions/pages/contact-actions"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/context/LanguageContext"

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { currentLang } = useLanguage()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true)
    try {
      await submitContactForm(data)
      toast({
        title: currentLang === "ar" ? "تم إرسال الرسالة بنجاح" : "Message sent successfully",
        description:
          currentLang === "ar"
            ? "شكرًا لك على تواصلك. سنرد عليك قريبًا!"
            : "Thank you for your submission. We'll get back to you soon!",
        duration: 5000,
        className: "bg-gradient-to-r from-[#24386F] to-[#872996] text-white",
      })
      form.reset()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: currentLang === "ar" ? "حدث خطأ" : "An error occurred",
        description: currentLang === "ar" ? "يرجى المحاولة مرة أخرى" : "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const labels = {
    en: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
    },
    ar: {
      name: "الاسم",
      email: "البريد الإلكتروني",
      subject: "الموضوع",
      message: "الرسالة",
      send: "إرسال الرسالة",
      sending: "جاري الإرسال...",
    },
  }

  const currentLabels = labels[currentLang as keyof typeof labels]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 rounded-lg p-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentLabels.name}</FormLabel>
              <FormControl>
                <Input placeholder={currentLabels.name} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentLabels.email}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentLabels.subject}</FormLabel>
              <FormControl>
                <Input placeholder={currentLabels.subject} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{currentLabels.message}</FormLabel>
              <FormControl>
                <Textarea placeholder={currentLabels.message} className="min-h-[150px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-[#24386F] to-[#872996] hover:from-[#1c2d59] hover:to-[#6e217a] text-white rounded-lg py-3 transition-all duration-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? currentLabels.sending : currentLabels.send}
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  )
}

