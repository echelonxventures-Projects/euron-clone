"use client";

import { useState } from "react";
import { FAQS } from "@/lib/data";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./ui";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-[72px] sm:py-24">
      <Container narrow>
        <Reveal>
          <SectionHead eyebrow="FAQ" title="Frequently asked questions" />
        </Reveal>
        <div className="grid gap-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`rounded-2xl border bg-white px-5 transition ${isOpen ? "border-primary/50" : "border-line"}`}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-4 text-left font-semibold text-ink"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {f.q}
                  <span className={`text-2xl leading-none text-primary transition ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden text-muted">{f.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
