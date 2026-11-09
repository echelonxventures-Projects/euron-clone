import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/components/AuthLayout";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign up — Euron" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getSession()) redirect("/dashboard");
  const { next } = await searchParams;
  return (
    <AuthLayout title="Create your account" subtitle="Start with free courses — upgrade anytime.">
      <AuthForm mode="signup" next={next} />
    </AuthLayout>
  );
}
