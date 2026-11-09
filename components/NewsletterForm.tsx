"use client";

import { useActionState } from "react";
import { joinNewsletter } from "@/app/actions/marketing";
import { buttonClass } from "./ui";

export default function NewsletterForm() {
  const [state, action, pending] = useActionState(joinNewsletter, undefined);
  return (
    <form action={action} className="max-w-[380px]">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="Your email"
          aria-label="Email"
          className="min-w-0 flex-1 rounded-xl border border-ink-3 bg-ink-2 px-4 py-2.5 text-white outline-none focus:border-primary"
        />
        <button disabled={pending} className={buttonClass("primary", "md", "disabled:opacity-60")}>
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      <p role="status" className={`mt-2 min-h-[1.4em] text-sm ${state?.error ? "text-red-400" : "text-teal-300"}`}>
        {state?.error ?? state?.success}
      </p>
    </form>
  );
}
