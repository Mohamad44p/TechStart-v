"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateContactInfo } from "@/app/actions/pages/contactActions";
import { contactInfoSchema, type ContactInfoInput } from "@/lib/schema/contact-info";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

//contact info form

interface ContactInfoFormProps {
  initialData: {
    id?: string;
    addressEn: string;
    addressAr: string;
    phone: string;
    email: string;
  } | null;
}

export function ContactInfoForm({ initialData }: ContactInfoFormProps) {
  const router = useRouter();
  const form = useForm<ContactInfoInput>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      addressEn: initialData?.addressEn || "",
      addressAr: initialData?.addressAr || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
    },
  });

  async function onSubmit(data: ContactInfoInput) {
    try {
      const result = await updateContactInfo(data);
      
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormField
          control={form.control}
          name="addressEn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (English)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter your address in English" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="addressAr"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address (Arabic)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Enter your address in Arabic" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter your phone number" />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="Enter your email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
} 