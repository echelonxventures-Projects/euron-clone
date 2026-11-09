"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "@/app/actions/auth";
import { NAV_LINKS } from "@/lib/data";
import { Logo, buttonClass } from "./ui";

type Props = { user: { name: string; role: "student" | "admin" } | null };

function AuthButtons({ user, onNavigate }: Props & { onNavigate?: () => void }) {
  if (!user)
    return (
      <>
        <Link href="/login" onClick={onNavigate} className={buttonClass("ghost")}>Log in</Link>
        <Link href="/signup" onClick={onNavigate} className={buttonClass("primary")}>Get started</Link>
      </>
    );
  return (
    <>
      {user.role === "admin" && (
        <Link href="/admin" onClick={onNavigate} className={buttonClass("ghost")}>Admin</Link>
      )}
      <Link href="/dashboard" onClick={onNavigate} className={buttonClass("primary")}>Dashboard</Link>
      <form action={logout}>
        <button className={buttonClass("outline")}>Log out</button>
      </form>
    </>
  );
}

export default function NavbarClient({ user }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md transition ${
        scrolled ? "border-line shadow-[0_4px_20px_-12px_rgba(0,0,0,.15)]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[70px] w-[min(1180px,100%-32px)] items-center gap-8">
        <Logo />
        <nav aria-label="Primary" className="mr-auto hidden gap-6 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="group relative font-medium">
              {l.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <AuthButtons user={user} />
        </div>
        <button
          className="ml-auto p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`my-[5px] block h-0.5 w-[22px] bg-ink transition ${open ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`my-[5px] block h-0.5 w-[22px] bg-ink transition ${open ? "opacity-0" : ""}`} />
          <span className={`my-[5px] block h-0.5 w-[22px] bg-ink transition ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      </div>

      <nav
        aria-label="Mobile"
        className={`absolute inset-x-0 top-[70px] -z-10 flex flex-col border-b border-line bg-white px-4 pb-6 pt-2 shadow-lg transition-transform duration-300 md:hidden ${
          open ? "translate-y-0" : "-translate-y-[130%]"
        }`}
      >
        {NAV_LINKS.map((l) => (
          <Link key={l.href} href={l.href} onClick={close} className="border-b border-line py-3 font-medium">
            {l.label}
          </Link>
        ))}
        <div className="mt-4 flex flex-wrap gap-2 [&>*]:flex-1">
          <AuthButtons user={user} onNavigate={close} />
        </div>
      </nav>
    </header>
  );
}
