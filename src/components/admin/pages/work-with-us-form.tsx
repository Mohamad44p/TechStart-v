/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createWorkWithUsListing,
  updateWorkWithUsListing,
  deleteWorkWithUsListing,
  type WorkWithUsData,
} from "@/app/actions/pages/work-with-us-actions";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { IconSelector } from "@/components/shared/icon-selector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const workWithUsSchema = z.object({
  type: z.enum(["Procurement", "Recruitment"]),
  titleEn: z.string().min(1, "Title in English is required"),
  titleAr: z.string().min(1, "Title in Arabic is required"),
  iconName: z.string().min(1, "Icon is required"),
  descriptionEn: z.string().min(1, "Description in English is required"),
  descriptionAr: z.string().min(1, "Description in Arabic is required"),
  tags: z.string().min(1, "At least one tag is required"),
  deadline: z.date({ required_error: "Deadline is required" }),
  applyLink: z.string().url("Must be a valid URL").nullish(), // Changed to nullish()
});

type WorkWithUsFormValues = z.infer<typeof workWithUsSchema>;

interface WorkWithUsFormProps {
  initialData?: WorkWithUsFormValues & { id: string }; // Updated interface
}

export function WorkWithUsForm({ initialData }: WorkWithUsFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WorkWithUsFormValues>({
    resolver: zodResolver(workWithUsSchema),
    defaultValues: {
      type: "Procurement",
      titleEn: "",
      titleAr: "",
      iconName: "",
      descriptionEn: "",
      descriptionAr: "",
      tags: "",
      deadline: new Date(),
      applyLink: "", // Add default value
      ...initialData, // Spread initialData after default values
    },
  });

  async function onSubmit(data: WorkWithUsFormValues) {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateWorkWithUsListing(initialData.id, data);
        toast({ title: "Listing updated successfully" });
      } else {
        await createWorkWithUsListing(data);
        toast({ title: "Listing created successfully" });
      }
      router.push("/admin/pages/work-with-us");
      router.refresh();
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function onDelete() {
    if (!initialData) return;
    setIsLoading(true);
    try {
      await deleteWorkWithUsListing(initialData.id);
      toast({ title: "Listing deleted successfully" });
      router.push("/admin/pages/work-with-us");
      router.refresh();
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Work With Us Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Procurement">Procurement</SelectItem>
                        <SelectItem value="Recruitment">Recruitment</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Tabs defaultValue="en" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">English</TabsTrigger>
                  <TabsTrigger value="ar">Arabic</TabsTrigger>
                </TabsList>
                <TabsContent value="en" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titleEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (English)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descriptionEn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (English)</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="ar" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titleAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title (Arabic)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="descriptionAr"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Arabic)</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>

              <FormField
                control={form.control}
                name="iconName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <IconSelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tags separated by commas"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="applyLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Application Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/apply"
                        type="url"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="submit" disabled={isLoading}>
            {initialData ? "Update" : "Create"} Listing
          </Button>
          {initialData && (
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              disabled={isLoading}
            >
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
