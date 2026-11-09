"use server";

import { db, leads, newsletter } from "@/lib/db";
import { leadSchema, newsletterSchema, type FormState } from "@/lib/validation";

export async function joinNewsletter(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  await db.insert(newsletter).values({ email: parsed.data.email }).onConflictDoNothing();
  return { success: "Thanks! You're on the list. 🎉" };
}

export async function submitLead(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = leadSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };
  await db.insert(leads).values(parsed.data);
  return { success: "Thanks — our team will reach out within one business day." };
}
