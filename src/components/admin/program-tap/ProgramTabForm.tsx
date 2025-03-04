"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { createProgramTab, updateProgramTab } from "@/app/actions/program-tab-actions"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import type { CreateProgramTabInput, ProgramTab, TabButton } from "@/types/program-tab"
import * as z from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProgramDialog } from "./ProgramDialog"
import { RichTextEditor } from "@/components/Editor/RichTextEditor"
import { FileUpload } from "@/lib/FileUpload"
import type { ProgramsPages as PrismaProgram } from "@prisma/client"

const programTabSchema = z.object({
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  slug: z.string().min(1, "Slug is required"),
  content_en: z.string().min(1, "English content is required"),
  content_ar: z.string().min(1, "Arabic content is required"),
  programPageId: z.string().nullable(),
  processFile: z.string().nullable(),
  buttons: z.array(
    z.object({
      name_en: z.string(),
      name_ar: z.string(),
      content_en: z.string(),
      content_ar: z.string(),
      order: z.number().optional(),
    })
  ).optional(),
});

type FormData = z.infer<typeof programTabSchema>;

interface ProgramTabFormProps {
  programTab?: ProgramTab;
  programs: PrismaProgram[];
}

export default function ProgramTabForm({ programTab, programs }: ProgramTabFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [programsList, setProgramsList] = useState(programs)
  const { toast } = useToast()
  const router = useRouter()
  const [buttons, setButtons] = useState<TabButton[]>(() => {
    return programTab?.buttons || [];
  });

  const form = useForm<FormData>({
    resolver: zodResolver(programTabSchema),
    defaultValues: {
      title_en: programTab?.title_en || "",
      title_ar: programTab?.title_ar || "",
      slug: programTab?.slug || "",
      content_en: programTab?.content_en || "",
      content_ar: programTab?.content_ar || "",
      programPageId: programTab?.programPageId || undefined,
      processFile: programTab?.processFile || undefined,
      buttons: programTab?.buttons?.map(button => ({
        name_en: button.name_en,
        name_ar: button.name_ar,
        content_en: button.content_en,
        content_ar: button.content_ar,
        order: button.order || 0
      })) || []
    },
  });

  const onSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const submitData: CreateProgramTabInput = {
        ...formData,
        programPageId: formData.programPageId || null,
        processFile: formData.processFile || null,
        buttons: buttons.map((button, index) => ({
          name_en: button.name_en || "",
          name_ar: button.name_ar || "",
          content_en: button.content_en || "",
          content_ar: button.content_ar || "",
          order: index
        }))
      };

      const result = programTab 
        ? await updateProgramTab({ ...submitData, id: programTab.id }) 
        : await createProgramTab(submitData);

      if (result.success) {
        toast({
          title: `Program tab ${programTab ? "updated" : "created"}`,
          description: `Your program tab has been ${programTab ? "updated" : "created"} successfully.`,
        })
        router.push("/admin/program-tabs")
      } else if (result.error) {
        toast({
          title: "Error",
          description: result.error,
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

  const handleProgramUpdate = (updatedPrograms: PrismaProgram[]) => {
    setProgramsList(updatedPrograms)
  }

  const handleFileUpload = (urls: string[]) => {
    if (urls.length > 0) {
      form.setValue("processFile", urls[0]);
    }
  };

  const addButton = () => {
    const newButton: TabButton = {
      name_en: "",
      name_ar: "",
      content_en: "",
      content_ar: "",
      order: buttons.length
    };
    
    const updatedButtons = [...buttons, newButton];
    setButtons(updatedButtons);

    form.setValue("buttons", [...buttons, newButton], {
      shouldValidate: false,
    });
  };

  const removeButton = (index: number) => {
    const filteredButtons = buttons.filter((_, i) => i !== index);
    setButtons(filteredButtons);

    form.setValue("buttons", filteredButtons, {
      shouldValidate: false,
    });
  };

  type ButtonFormFields = 'name_en' | 'name_ar' | 'content_en' | 'content_ar' | 'order';
  const updateButtonField = (index: number, field: ButtonFormFields, value: string) => {
    const updatedButtons = buttons.map((button, i) => {
      if (i === index) {
        const updatedButton = { ...button, [field]: value };
        return updatedButton;
      }
      return button;
    });
    setButtons(updatedButtons);

    form.setValue(`buttons.${index}.${field}`, value, {
      shouldValidate: false,
    });
  };

  const renderButtonFields = (index: number) => (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name={`buttons.${index}.name_en`}
        render={() => (
          <FormItem>
            <FormLabel>Button Name (English)</FormLabel>
            <FormControl>
              <Input 
                value={buttons[index]?.name_en || ""}
                onChange={(e) => updateButtonField(index, 'name_en', e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`buttons.${index}.name_ar`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Button Name (Arabic)</FormLabel>
            <FormControl>
              <Input {...field} dir="rtl" value={buttons[index]?.name_ar || ""} onChange={(e) => updateButtonField(index, 'name_ar', e.target.value)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="col-span-2">
        <FormField
          control={form.control}
          name={`buttons.${index}.content_en`}
          render={() => (
            <FormItem>
              <FormLabel>Content (English)</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={buttons[index]?.content_en || ""}
                  onChange={(value) => updateButtonField(index, 'content_en', value)}
                  dir="ltr"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="col-span-2">
        <FormField
          control={form.control}
          name={`buttons.${index}.content_ar`}
          render={() => (
            <FormItem>
              <FormLabel>Content (Arabic)</FormLabel>
              <FormControl>
                <RichTextEditor
                  content={buttons[index]?.content_ar || ""}
                  onChange={(value) => updateButtonField(index, 'content_ar', value)}
                  dir="rtl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Button
        type="button"
        variant="destructive"
        onClick={() => removeButton(index)}
        className="col-span-2"
      >
        Remove Button
      </Button>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{programTab ? "Edit" : "Create"} Program Tab</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter slug" {...field} />
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
                  <FormLabel>Program</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {programsList.length > 0 ? (
                        programsList.map((program) => (
                          <SelectItem key={program.id} value={program.id}>
                            {program.name_en}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-programs" disabled>
                          No programs available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ProgramDialog programs={programsList} onProgramsUpdate={handleProgramUpdate} />

            <FormField
              control={form.control}
              name="processFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Process Details PDF</FormLabel>
                  <FormControl>
                    <FileUpload
                      onUpload={handleFileUpload}
                      defaultFiles={field.value ? [field.value] : []}
                      maxFiles={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-semibold">Custom Buttons</h3>
              {buttons.map((button, index) => (
                <Card key={button.id || index} className="p-4">
                  {renderButtonFields(index)}
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addButton}
                className="w-full"
              >
                Add New Button
              </Button>
            </div>

            <Tabs defaultValue="english" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="english">English</TabsTrigger>
                <TabsTrigger value="arabic">Arabic</TabsTrigger>
              </TabsList>
              <TabsContent value="english">
                <div className="space-y-4">
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
                    name="content_en"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (English)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            dir="ltr"
                            placeholder="Write your content in English..."
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
                    name="title_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Arabic)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Arabic title" {...field} className="text-right" dir="rtl" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="content_ar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (Arabic)</FormLabel>
                        <FormControl>
                          <RichTextEditor
                            content={field.value}
                            onChange={field.onChange}
                            dir="rtl"
                            placeholder="Write your content in Arabic..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Submitting..." : (programTab ? "Update" : "Create") + " Program Tab"}
        </Button>
      </CardFooter>
    </Card>
  )
}

