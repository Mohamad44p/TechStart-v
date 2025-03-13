/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createTeamMember, updateTeamMember, deleteTeamMember, type TeamMemberData } from "@/app/actions/pages/team-actions"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { ImageUpload } from "@/lib/ImageUpload"

const teamMemberSchema = z.object({
  nameEn: z.string().min(1, "Name in English is required"),
  nameAr: z.string().min(1, "Name in Arabic is required"),
  jobTitleEn: z.string().min(1, "Job title in English is required"),
  jobTitleAr: z.string().min(1, "Job title in Arabic is required"),
  imageUrl: z.string().min(1, "Image is required"),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

type TeamMemberFormValues = z.infer<typeof teamMemberSchema>

interface TeamMemberFormProps {
  initialData?: TeamMemberData & { id: string }
}

export function TeamMemberForm({ initialData }: TeamMemberFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: initialData || {
      nameEn: "",
      nameAr: "",
      jobTitleEn: "",
      jobTitleAr: "",
      imageUrl: "",
      linkedinUrl: "",
    },
  })

  async function onSubmit(data: TeamMemberFormValues) {
    setIsLoading(true)
    try {
      if (initialData) {
        await updateTeamMember(initialData.id, data)
        toast({ title: "Team member updated successfully" })
      } else {
        await createTeamMember(data)
        toast({ title: "Team member created successfully" })
      }
      router.push("/admin/pages/team")
      router.refresh()
    } catch (error) {
      toast({ title: "An error occurred", description: "Please try again", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  async function onDelete() {
    if (!initialData) return
    setIsLoading(true)
    try {
      await deleteTeamMember(initialData.id)
      toast({ title: "Team member deleted successfully" })
      router.push("/admin/pages/team")
      router.refresh()
    } catch (error) {
      toast({ title: "An error occurred", description: "Please try again", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Team Member Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ar">Arabic</TabsTrigger>
              </TabsList>
              <TabsContent value="en" className="space-y-4">
                <FormField
                  control={form.control}
                  name="nameEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitleEn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title (English)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              <TabsContent value="ar" className="space-y-4">
                <FormField
                  control={form.control}
                  name="nameAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitleAr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title (Arabic)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <ImageUpload 
                      onUpload={(url) => field.onChange(url)}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkedinUrl"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>LinkedIn URL (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://www.linkedin.com/in/username" 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Update" : "Create"} Team Member
          </Button>
          {initialData && (
            <Button type="button" variant="destructive" onClick={onDelete} disabled={isLoading}>
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  )
}

