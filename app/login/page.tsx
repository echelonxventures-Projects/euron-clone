import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/components/AuthLayout";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Log in — Euron" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getSession()) redirect("/dashboard");
  const { next } = await searchParams;
  return (
    <AuthLayout title="Welcome back" subtitle="Log in to continue learning.">
      <AuthForm mode="login" next={next} />
    </AuthLayout>
  );
}
