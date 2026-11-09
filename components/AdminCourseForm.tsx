"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCourse } from "@/app/actions/admin";
import { CATEGORIES } from "@/lib/data";
import { FieldError, buttonClass, inputClass } from "./ui";

export default function AdminCourseForm() {
  const [state, action, pending] = useActionState(createCourse, undefined);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.success) ref.current?.reset();
  }, [state]);
  const fe = state?.fieldErrors;

  return (
    <form ref={ref} action={action} className="grid gap-3">
      <input name="title" placeholder="Course title" className={inputClass} required />
      <FieldError errors={fe?.title} />
      <textarea name="description" placeholder="Short description" rows={3} className={inputClass} required />
      <FieldError errors={fe?.description} />
      <div className="grid grid-cols-2 gap-3">
        <select name="category" className={inputClass}>
          {CATEGORIES.filter((c) => c.id !== "all").map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select name="level" className={inputClass}>
          {["Beginner", "Intermediate", "Advanced"].map((l) => <option key={l}>{l}</option>)}
        </select>
        <input name="hours" type="number" min={1} placeholder="Hours" className={inputClass} required />
        <input name="modules" type="number" min={1} placeholder="Modules" className={inputClass} required />
        <input name="icon" placeholder="Emoji icon" defaultValue="📘" className={inputClass} />
        <label className="flex items-center gap-2 font-medium"><input type="checkbox" name="isFree" className="size-4 accent-primary" /> Free course</label>
      </div>
      <FieldError errors={fe?.hours ?? fe?.modules} />
      {state?.success && <p className="text-sm font-semibold text-primary-700">{state.success}</p>}
      <button disabled={pending} className={buttonClass("primary", "md", "disabled:opacity-60")}>{pending ? "Saving…" : "Add course"}</button>
    </form>
  );
}
