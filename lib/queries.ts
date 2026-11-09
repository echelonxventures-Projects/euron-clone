import "server-only";
import { and, asc, count, desc, eq, gt, like, ne, or } from "drizzle-orm";
import { courses, db, enrollments, newsletter, payments, projects, subscriptions, users, leads } from "@/lib/db";

export type CourseFilter = { q?: string; category?: string; includeUnpublished?: boolean };

export async function listCourses({ q, category, includeUnpublished }: CourseFilter = {}) {
  const conds = [];
  if (!includeUnpublished) conds.push(eq(courses.published, true));
  if (category && ["ai", "data", "dev", "cloud"].includes(category))
    conds.push(eq(courses.category, category as "ai"));
  if (q) conds.push(or(like(courses.title, `%${q}%`), like(courses.description, `%${q}%`)));
  return db.select().from(courses).where(and(...conds)).orderBy(asc(courses.id));
}

export async function getCourseBySlug(slug: string) {
  return db.query.courses.findFirst({ where: and(eq(courses.slug, slug), eq(courses.published, true)) });
}

export async function listProjects() {
  return db.select().from(projects).orderBy(asc(projects.id));
}

export async function getPlatformStats() {
  const [[c], [p], [u]] = await Promise.all([
    db.select({ n: count() }).from(courses).where(eq(courses.published, true)),
    db.select({ n: count() }).from(projects),
    db.select({ n: count() }).from(users),
  ]);
  return { courses: c.n, projects: p.n, learners: u.n };
}

export async function getActiveSubscription(userId: number) {
  return db.query.subscriptions.findFirst({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.status, "active"),
      gt(subscriptions.currentPeriodEnd, new Date()),
    ),
  });
}

export async function getSubscription(userId: number) {
  return db.query.subscriptions.findFirst({ where: eq(subscriptions.userId, userId) });
}

export async function getEnrollment(userId: number, courseId: number) {
  return db.query.enrollments.findFirst({
    where: and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)),
  });
}

export async function listEnrollments(userId: number) {
  return db
    .select({
      id: enrollments.id,
      progress: enrollments.progress,
      course: courses,
    })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId))
    .orderBy(desc(enrollments.createdAt));
}

export async function getAdminOverview() {
  const [[u], [s], [e], [n], subs, recentUsers, recentLeads] = await Promise.all([
    db.select({ n: count() }).from(users),
    db.select({ n: count() }).from(subscriptions).where(eq(subscriptions.status, "active")),
    db.select({ n: count() }).from(enrollments),
    db.select({ n: count() }).from(newsletter),
    db.select().from(newsletter).orderBy(desc(newsletter.createdAt)).limit(10),
    db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(10),
  ]);
  return {
    totals: { users: u.n, activeSubs: s.n, enrollments: e.n, newsletter: n.n },
    newsletter: subs,
    recentUsers,
    recentLeads,
  };
}

export async function listPayments(userId: number) {
  return db
    .select()
    .from(payments)
    .where(and(eq(payments.userId, userId), ne(payments.status, "created")))
    .orderBy(desc(payments.createdAt))
    .limit(10);
}
