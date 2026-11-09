"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { courses, db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { courseSchema, slugify, type FormState } from "@/lib/validation";

const GRADIENTS = [
  "linear-gradient(135deg,#0e99ad,#2563eb)",
  "linear-gradient(135deg,#7c3aed,#ec4899)",
  "linear-gradient(135deg,#f59e0b,#ef4444)",
  "linear-gradient(135deg,#16a34a,#0e99ad)",
];

function revalidateCourses() {
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/admin");
}

export async function createCourse(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = courseSchema.safeParse({ ...Object.fromEntries(formData), isFree: formData.get("isFree") === "on" });
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors };

  const slug = slugify(parsed.data.title);
  const exists = await db.query.courses.findFirst({ where: eq(courses.slug, slug) });
  if (exists) return { fieldErrors: { title: ["A course with this title already exists"] } };

  await db.insert(courses).values({
    ...parsed.data,
    slug,
    gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
  });
  revalidateCourses();
  return { success: `Created “${parsed.data.title}”` };
}

export async function togglePublish(id: number) {
  await requireAdmin();
  const c = await db.query.courses.findFirst({ where: eq(courses.id, id) });
  if (!c) return;
  await db.update(courses).set({ published: !c.published }).where(eq(courses.id, id));
  revalidateCourses();
}

export async function deleteCourse(id: number) {
  await requireAdmin();
  await db.delete(courses).where(eq(courses.id, id));
  revalidateCourses();
}
