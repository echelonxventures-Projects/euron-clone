"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, signup } from "@/app/actions/auth";
import { FieldError, buttonClass, inputClass } from "./ui";

export default function AuthForm({ mode, next }: { mode: "login" | "signup"; next?: string }) {
  const [state, action, pending] = useActionState(mode === "login" ? login : signup, undefined);
  const fe = state?.fieldErrors;

  return (
    <form action={action} className="grid gap-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {mode === "signup" && (
        <label className="grid gap-1.5 font-medium">
          Full name
          <input name="name" autoComplete="name" required className={inputClass} />
          <FieldError errors={fe?.name} />
        </label>
      )}
      <label className="grid gap-1.5 font-medium">
        Email
        <input name="email" type="email" autoComplete="email" required className={inputClass} />
        <FieldError errors={fe?.email} />
      </label>
      <label className="grid gap-1.5 font-medium">
        Password
        <input
          name="password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
          className={inputClass}
        />
        <FieldError errors={fe?.password} />
      </label>
      {state?.error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{state.error}</p>}
      <button disabled={pending} className={buttonClass("primary", "lg", "mt-2 w-full disabled:opacity-60")}>
        {pending ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
      </button>
      <p className="text-center text-sm text-muted">
        {mode === "login" ? "New to Euron? " : "Already have an account? "}
        <Link
          href={`/${mode === "login" ? "signup" : "login"}${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-primary-700 hover:underline"
        >
          {mode === "login" ? "Create an account" : "Log in"}
        </Link>
      </p>
    </form>
  );
}
