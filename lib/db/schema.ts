import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
};

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text("role", { enum: ["student", "admin"] }).notNull().default("student"),
  ...timestamps,
});

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", { enum: ["ai", "data", "dev", "cloud"] }).notNull(),
  level: text("level", { enum: ["Beginner", "Intermediate", "Advanced"] }).notNull(),
  hours: integer("hours").notNull(),
  modules: integer("modules").notNull().default(10),
  icon: text("icon").notNull().default("📘"),
  gradient: text("gradient").notNull().default("linear-gradient(135deg,#0e99ad,#2563eb)"),
  isFree: integer("is_free", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

export const projects = sqliteTable("projects", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  stack: text("stack").notNull(),
  difficulty: text("difficulty", { enum: ["Beginner", "Intermediate", "Advanced"] }).notNull(),
  icon: text("icon").notNull(),
  ...timestamps,
});

export const enrollments = sqliteTable(
  "enrollments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
    progress: integer("progress").notNull().default(0),
    ...timestamps,
  },
  (t) => [uniqueIndex("enrollment_user_course").on(t.userId, t.courseId)],
);

export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  plan: text("plan", { enum: ["one"] }).notNull().default("one"),
  billing: text("billing", { enum: ["monthly", "yearly"] }).notNull(),
  status: text("status", { enum: ["active", "canceled"] }).notNull().default("active"),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }).notNull(),
  ...timestamps,
});

export const newsletter = sqliteTable("newsletter", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  ...timestamps,
});

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  organization: text("organization").notNull(),
  message: text("message").notNull().default(""),
  ...timestamps,
});

export const payments = sqliteTable("payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider", { enum: ["razorpay", "mock"] }).notNull().default("razorpay"),
  orderId: text("order_id").notNull().unique(),
  paymentId: text("payment_id").unique(),
  billing: text("billing", { enum: ["monthly", "yearly"] }).notNull(),
  amount: integer("amount").notNull(), // smallest currency unit (paise)
  currency: text("currency").notNull().default("INR"),
  status: text("status", { enum: ["created", "paid", "failed"] }).notNull().default("created"),
  paidAt: integer("paid_at", { mode: "timestamp" }),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type Payment = typeof payments.$inferSelect;
