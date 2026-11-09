"use client";

import { useActionState } from "react";
import { submitLead } from "@/app/actions/marketing";
import { FieldError, buttonClass, inputClass } from "./ui";

export default function LeadForm() {
  const [state, action, pending] = useActionState(submitLead, undefined);
  if (state?.success) return <p className="rounded-xl bg-primary-50 px-4 py-3 font-semibold text-primary-700">{state.success}</p>;
  const fe = state?.fieldErrors;
  return (
    <form action={action} className="grid gap-4">
      {([
        ["name", "Your name", "text"],
        ["email", "Work email", "email"],
        ["organization", "College or company", "text"],
      ] as const).map(([name, label, type]) => (
        <label key={name} className="grid gap-1.5 font-medium">
          {label}
          <input name={name} type={type} required className={inputClass} />
          <FieldError errors={fe?.[name]} />
        </label>
      ))}
      <label className="grid gap-1.5 font-medium">
        How can we help?
        <textarea name="message" rows={4} className={inputClass} />
      </label>
      <button disabled={pending} className={buttonClass("primary", "lg", "disabled:opacity-60")}>
        {pending ? "Sending…" : "Contact sales"}
      </button>
    </form>
  );
}
