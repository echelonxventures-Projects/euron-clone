"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { courses, db, enrollments, subscriptions } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getActiveSubscription } from "@/lib/queries";

export async function enroll(courseId: number) {
  const session = await getSession();
  const course = await db.query.courses.findFirst({ where: eq(courses.id, courseId) });
  if (!course) throw new Error("Course not found");
  if (!session) redirect(`/login?next=/courses/${course.slug}`);

  if (!course.isFree && !(await getActiveSubscription(session.userId))) {
    redirect(`/checkout?billing=monthly&next=/courses/${course.slug}`);
  }

  await db.insert(enrollments).values({ userId: session.userId, courseId }).onConflictDoNothing();
  revalidatePath(`/courses/${course.slug}`);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProgress(enrollmentId: number, delta: number) {
  const session = await getSession();
  if (!session) redirect("/login");
  const row = await db.query.enrollments.findFirst({
    where: and(eq(enrollments.id, enrollmentId), eq(enrollments.userId, session.userId)),
  });
  if (!row) return;
  const progress = Math.max(0, Math.min(100, row.progress + delta));
  await db.update(enrollments).set({ progress }).where(eq(enrollments.id, row.id));
  revalidatePath("/dashboard");
}

export async function unenroll(enrollmentId: number) {
  const session = await getSession();
  if (!session) redirect("/login");
  await db
    .delete(enrollments)
    .where(and(eq(enrollments.id, enrollmentId), eq(enrollments.userId, session.userId)));
  revalidatePath("/dashboard");
}

export async function cancelSubscription() {
  const session = await getSession();
  if (!session) redirect("/login");
  // Access stays until currentPeriodEnd; we just stop renewal.
  await db.update(subscriptions).set({ status: "canceled" }).where(eq(subscriptions.userId, session.userId));
  revalidatePath("/dashboard");
}
