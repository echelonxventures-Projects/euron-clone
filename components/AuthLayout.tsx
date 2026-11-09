import type { ReactNode } from "react";
import { Logo } from "./ui";

export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-center px-4 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-md">
          <Logo />
          <h1 className="mb-1 mt-10 text-3xl font-extrabold">{title}</h1>
          <p className="mb-8 text-muted">{subtitle}</p>
          {children}
        </div>
      </div>
      <div className="relative hidden overflow-hidden bg-linear-135 from-ink to-[#0a3c46] lg:flex lg:items-center lg:justify-center">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,153,173,.45),transparent_55%)]" />
        <div className="relative max-w-md px-10 text-slate-300">
          <p className="font-display text-4xl font-extrabold leading-tight text-white">
            One student. <span className="text-gradient">One subscription.</span>
          </p>
          <p className="mt-4 text-lg">Courses, AI projects and career tools — all in one place.</p>
        </div>
      </div>
    </div>
  );
}
