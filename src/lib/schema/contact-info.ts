import { z } from "zod";

//contact info schema

export const contactInfoSchema = z.object({
  addressEn: z.string().min(1, "English address is required"),
  addressAr: z.string().min(1, "Arabic address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>; 