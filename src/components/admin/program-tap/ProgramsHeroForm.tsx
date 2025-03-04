"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { createProgramsHero, updateProgramsHero } from "@/app/actions/programs-hero-actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { CreateProgramsHeroInput, ProgramsHero, ProgramsPages } from "@/types/programs-hero"
import { IconSelector } from "@/components/shared/icon-selector"
import { ImageUpload } from "@/lib/ImageUpload"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProgramDialog } from "./ProgramDialog"
import { RichTextEditor } from "@/components/Editor/RichTextEditor"

const programsHeroSchema = z.object({
  name: z.string().min(1, "Name is required"),
  tagline_en: z.string().min(1, "English tagline is required"),
  tagline_ar: z.string().min(1, "Arabic tagline is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  highlightWord_en: z.string().min(1, "English highlight word is required"),
  highlightWord_ar: z.string().min(1, "Arabic highlight word is required"),
  description_en: z.string().min(1, "English description is required"),
  description_ar: z.string().min(1, "Arabic description is required"),
  imageUrl: z.string().nullable(),
  card1Title_en: z.string().nullable(),
  card1Title_ar: z.string().nullable(),
  card1Icon: z.string().nullable(),
  card1Description_en: z.string().nullable(),
  card1Description_ar: z.string().nullable(),
  card1Show: z.boolean(),
  card2Title_en: z.string().nullable(),
  card2Title_ar: z.string().nullable(),
  card2Icon: z.string().nullable(),
  card2Description_en: z.string().nullable(),
  card2Description_ar: z.string().nullable(),
  card2Show: z.boolean(),
  card3Title_en: z.string().nullable(),
  card3Title_ar: z.string().nullable(),
  card3Icon: z.string().nullable(),
  card3Description_en: z.string().nullable(),
  card3Description_ar: z.string().nullable(),
  card3Show: z.boolean(),
  programPageId: z.string().nullable(),
  objectives_en: z.string().optional().nullable(),
  objectives_ar: z.string().optional().nullable(),
  eligibility_en: z.string().nullable(),
  eligibility_ar: z.string().nullable(),
})

interface ProgramsHeroFormProps {
  programsHero?: ProgramsHero
  programs: ProgramsPages[]
}

export default function ProgramsHeroForm({ programsHero, programs: initialPrograms }: ProgramsHeroFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [programs, setPrograms] = useState(initialPrograms)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<CreateProgramsHeroInput>({
    resolver: zodResolver(programsHeroSchema),
    defaultValues: programsHero
      ? {
          ...programsHero,
          programPageId: programsHero.programPageId || null,
          eligibility_en: programsHero.eligibility_en || null,
          eligibility_ar: programsHero.eligibility_ar || null,
        }
      : {
          name: "",
          tagline_en: "",
          tagline_ar: "",
          title_en: "",
          title_ar: "",
          highlightWord_en: "",
          highlightWord_ar: "",
          description_en: "",
          description_ar: "",
          imageUrl: null,
          card1Title_en: null,
          card1Title_ar: null,
          card1Icon: null,
          card1Description_en: null,
          card1Description_ar: null,
          card1Show: true,
          card2Title_en: null,
          card2Title_ar: null,
          card2Icon: null,
          card2Description_en: null,
          card2Description_ar: null,
          card2Show: true,
          card3Title_en: null,
          card3Title_ar: null,
          card3Icon: null,
          card3Description_en: null,
          card3Description_ar: null,
          card3Show: true,
          programPageId: null,
          objectives_en: null,
          objectives_ar: null,
          eligibility_en: null,
          eligibility_ar: null,
        },
  })

  async function onSubmit(data: CreateProgramsHeroInput) {
    setIsSubmitting(true)
    try {
      // Ensure data is a valid object
      if (!data || typeof data !== 'object') {
        toast({
          title: "Validation Error",
          description: "Invalid form data",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Add validation for eligibility content
      if (!data.eligibility_en?.trim() && !data.eligibility_ar?.trim()) {
        toast({
          title: "Validation Error",
          description: "Eligibility criteria in at least one language is required",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Clean the data by removing empty strings and converting them to null
      const cleanedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value === "") {
          acc[key] = null
        } else if (Array.isArray(value)) {
          acc[key] = value[0] === "" ? null : value[0]
        } else {
          acc[key] = value
        }
        return acc
      }, {} as Record<string, any>) as CreateProgramsHeroInput

      console.log("Submitting data:", cleanedData)

      let result
      try {
        if (programsHero) {
          result = await updateProgramsHero({ 
            ...cleanedData, 
            id: programsHero.id 
          })
        } else {
          result = await createProgramsHero(cleanedData)
        }
      } catch (submitError) {
        console.error("Error during submission:", submitError)
        
        // Try alternative approach with FormData if the direct approach fails
        try {
          console.log("Trying FormData approach...")
          const formData = new FormData()
          
          // Add all fields to FormData
          Object.entries(cleanedData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, value.toString())
            }
          })
          
          if (programsHero) {
            formData.append('id', programsHero.id)
            result = await updateProgramsHero(formData as any)
          } else {
            result = await createProgramsHero(formData as any)
          }
        } catch (formDataError) {
          console.error("FormData approach also failed:", formDataError)
          toast({
            title: "Submission Error",
            description: "Failed to submit form data. Please try again.",
            variant: "destructive",
          })
          setIsSubmitting(false)
          return
        }
      }

      if (result?.success) {
        toast({
          title: `Programs hero ${programsHero ? "updated" : "created"}`,
          description: `The programs hero has been ${programsHero ? "updated" : "created"} successfully.`,
        })
        router.push("/admin/programs-hero")
      } else if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Unknown error occurred",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Unexpected error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleProgramUpdate = (updatedPrograms: ProgramsPages[]) => {
    setPrograms(updatedPrograms)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{programsHero ? "Edit" : "Create"} Programs Hero</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter hero name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="programPageId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Associated Program</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programs.map((program) => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ProgramDialog programs={programs} onProgramsUpdate={handleProgramUpdate} />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value || ""} onUpload={(url) => field.onChange(url)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Tabs defaultValue="english" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">Arabic</TabsTrigger>
              </TabsList>
              <TabsContent value="english">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tagline_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter English tagline" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter English title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="highlightWord_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlight Word (English)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter English highlight word" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter English description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="objectives_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objectives (English)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value || ""}
                            onChange={field.onChange}
                            dir="ltr"
                            placeholder="Write your objectives in English..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eligibility_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eligibility Criteria (English)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value || ""}
                            onChange={field.onChange}
                            dir="ltr"
                            placeholder="Write your eligibility criteria in English..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              <TabsContent value="arabic">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="tagline_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Arabic tagline" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Arabic title" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="highlightWord_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlight Word (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Arabic highlight word" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Arabic)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter Arabic description" {...field} dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="objectives_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objectives (Arabic)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value || ""}
                            onChange={field.onChange}
                            dir="rtl"
                            placeholder="Write your objectives in Arabic..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="eligibility_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Eligibility Criteria (Arabic)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value || ""}
                            onChange={field.onChange}
                            dir="rtl"
                            placeholder="Write your eligibility criteria in Arabic..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {[1, 2, 3].map((cardNumber) => (
              <Card key={cardNumber}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Card {cardNumber}
                    <FormField
                      control={form.control}
                      name={`card${cardNumber}Show` as keyof CreateProgramsHeroInput}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="m-0">Show Card</FormLabel>
                        </FormItem>
                      )}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs defaultValue="en" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">Arabic</TabsTrigger>
                    </TabsList>
                    <TabsContent value="en" className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`card${cardNumber}Title_en` as keyof CreateProgramsHeroInput}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Enter card ${cardNumber} English title`}
                                {...field}
                                value={String(field.value || "")}
                                onChange={(e) => field.onChange(e.target.value || null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`card${cardNumber}Description_en` as keyof CreateProgramsHeroInput}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Enter card ${cardNumber} English description`}
                                {...field}
                                value={String(field.value || "")}
                                onChange={(e) => field.onChange(e.target.value || null)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="ar" className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`card${cardNumber}Title_ar` as keyof CreateProgramsHeroInput}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Enter card ${cardNumber} Arabic title`}
                                {...field}
                                value={String(field.value || "")}
                                onChange={(e) => field.onChange(e.target.value || null)}
                                dir="rtl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`card${cardNumber}Description_ar` as keyof CreateProgramsHeroInput}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder={`Enter card ${cardNumber} Arabic description`}
                                {...field}
                                value={String(field.value || "")}
                                onChange={(e) => field.onChange(e.target.value || null)}
                                dir="rtl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>

                  <FormField
                    control={form.control}
                    name={`card${cardNumber}Icon` as keyof CreateProgramsHeroInput}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Icon</FormLabel>
                        <FormControl>
                          <IconSelector value={String(field.value || "")} onChange={(value) => field.onChange(value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting..." : (programsHero ? "Update" : "Create") + " Programs Hero"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

