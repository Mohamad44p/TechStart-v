"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  createStat,
  updateStat,
  type StatFormData,
} from "@/app/actions/pages/statActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Stat } from "@prisma/client";
import { IconSelector } from "@/components/shared/icon-selector";

const StatSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_ar: z.string().min(1, "Arabic name is required"),
  value: z.number().positive("Value must be a positive number"),
  icon: z.string().min(1, "Icon is required"),
  suffix_en: z.string().min(1, "English suffix is required"),
  suffix_ar: z.string().min(1, "Arabic suffix is required"),
});

interface StatFormProps {
  stat?: Stat;
  mode: "create" | "edit";
}

export function StatFormUnified({ stat, mode }: StatFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<StatFormData>({
    resolver: zodResolver(StatSchema),
    defaultValues: stat || {
      name_en: "",
      name_ar: "",
      value: 0,
      icon: "",
      suffix_en: "total",
      suffix_ar: "إجمالي",
    },
  });

  const onSubmit = async (data: StatFormData) => {
    setIsSubmitting(true);
    try {
      const response =
        mode === "create"
          ? await createStat(data)
          : await updateStat(stat!.id, data);

      if (!response.success) {
        throw new Error(response.error as string);
      }

      toast({
        title: `Stat ${mode === "create" ? "created" : "updated"}`,
        description: `Your stat has been successfully ${
          mode === "create" ? "created" : "updated"
        }.`,
      });

      router.push("/admin/pages/stats");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "create" ? "Create New Stat" : "Edit Stat"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter stat name in English"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم الإحصائية بالعربية"
                      {...field}
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Enter stat value"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconSelector value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suffix_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Suffix</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter suffix in English" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="suffix_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Suffix</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اللاحقة بالعربية"
                      {...field}
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/pages/stats")}
                className="w-full"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting
                  ? `${mode === "create" ? "Creating" : "Updating"}...`
                  : mode === "create"
                  ? "Create Stat"
                  : "Update Stat"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
