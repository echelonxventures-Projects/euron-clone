import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email").trim().toLowerCase(),
  password: z.string().min(1, "Password is required"),
});

export const newsletterSchema = z.object({ email: z.email("Enter a valid email").trim().toLowerCase() });

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.email("Enter a valid email").trim().toLowerCase(),
  organization: z.string().trim().min(2).max(120),
  message: z.string().trim().max(2000).optional().default(""),
});

export const courseSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(2000),
  category: z.enum(["ai", "data", "dev", "cloud"]),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  hours: z.coerce.number().int().min(1).max(1000),
  modules: z.coerce.number().int().min(1).max(500),
  icon: z.string().trim().min(1).max(8).default("📘"),
  isFree: z.coerce.boolean().default(false),
});

export const checkoutSchema = z.object({ billing: z.enum(["monthly", "yearly"]) });

export type FormState = { error?: string; fieldErrors?: Record<string, string[] | undefined>; success?: string } | undefined;

export function slugify(s: string) {
  return s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
