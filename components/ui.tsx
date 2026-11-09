import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "light";
type Size = "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white shadow-glow hover:bg-primary-600",
  outline: "border-[1.5px] border-line bg-white text-ink hover:border-primary hover:text-primary-700",
  ghost: "text-ink hover:text-primary",
  light: "bg-white text-primary-700",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5",
  lg: "px-6 py-3.5 text-[1.05rem]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra = "") {
  return `inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl font-semibold transition hover:-translate-y-px ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function Button({
  variant,
  size,
  className = "",
  ...props
}: ComponentProps<"a"> & { variant?: Variant; size?: Size }) {
  return <a className={buttonClass(variant, size, className)} {...props} />;
}

export function Container({ children, className = "", narrow = false }: { children: ReactNode; className?: string; narrow?: boolean }) {
  return <div className={`mx-auto ${narrow ? "w-[min(780px,100%-32px)]" : "w-[min(1180px,100%-32px)]"} ${className}`}>{children}</div>;
}

export function SectionHead({ eyebrow, title, children, light = false }: { eyebrow: string; title: string; children?: ReactNode; light?: boolean }) {
  return (
    <div className="mx-auto mb-12 max-w-[680px] text-center">
      <span className={`mb-3 inline-block text-[0.82rem] font-bold uppercase tracking-[0.12em] ${light ? "text-teal-300" : "text-primary"}`}>
        {eyebrow}
      </span>
      <h2 className="mb-2 text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold leading-[1.12]">{title}</h2>
      {children && <div className="text-[1.08rem] text-muted">{children}</div>}
    </div>
  );
}

export function CheckList({ items, dark = false, className = "" }: { items: string[]; dark?: boolean; className?: string }) {
  return (
    <ul className={`my-5 grid gap-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className={`mt-0.5 grid size-5 flex-none place-items-center rounded-full text-[0.72rem] font-extrabold ${
              dark ? "bg-teal-300/15 text-teal-300" : "bg-primary-50 text-primary-700"
            }`}
          >
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="/" aria-label="Euron home" className={`inline-flex items-center gap-2 font-display text-2xl font-extrabold tracking-tighter ${light ? "text-white" : "text-ink"}`}>
      <span className="grid size-[34px] place-items-center rounded-[10px] bg-linear-135 from-primary to-accent text-lg text-white">E</span>
      euron
    </a>
  );
}

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1 text-sm text-red-600">{errors[0]}</p>;
}

export const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function Tag({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold ${className}`}>{children}</span>;
}

export const LEVEL_TAG: Record<string, string> = {
  Beginner: "bg-pink-100 text-pink-700",
  Intermediate: "bg-orange-50 text-amber-700",
  Advanced: "bg-primary-50 text-primary-700",
};
