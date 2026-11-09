"use client";

import Link from "next/link";
import { useState } from "react";
import { PLANS } from "@/lib/data";
import Reveal from "./Reveal";
import { CheckList, Container, SectionHead, buttonClass } from "./ui";

type Billing = "monthly" | "yearly";

export default function Pricing({ activePlan }: { activePlan?: boolean }) {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section id="pricing" className="py-[72px] sm:py-24">
      <Container>
        <Reveal>
          <SectionHead eyebrow="Pricing" title="Simple pricing. Everything included.">
            <div className="mt-4 inline-flex rounded-full bg-tint p-1">
              {(["monthly", "yearly"] as const).map((b) => (
                <button
                  key={b}
                  onClick={() => setBilling(b)}
                  className={`rounded-full px-5 py-2 font-semibold capitalize transition ${
                    billing === b ? "bg-white text-ink shadow" : "text-muted"
                  }`}
                >
                  {b}
                  {b === "yearly" && (
                    <em className="ml-1.5 rounded-full bg-primary-50 px-2 py-0.5 text-xs not-italic text-primary-700">Save 40%</em>
                  )}
                </button>
              ))}
            </div>
          </SectionHead>
        </Reveal>

        <div className="mx-auto grid max-w-[460px] items-stretch gap-6 lg:max-w-none lg:grid-cols-3">
          {PLANS.map((plan, i) => {
            const featured = plan.featured;
            const price = typeof plan.price === "string" ? null : plan.price[billing];
            const href =
              plan.name === "Starter" ? "/signup" : plan.name === "Teams" ? "/contact" : `/checkout?billing=${billing}`;
            return (
              <Reveal key={plan.name} delay={i * 80}>
                <article
                  className={`relative flex h-full flex-col rounded-[22px] p-8 ${
                    featured
                      ? "bg-linear-160 from-ink to-[#0a3c46] text-slate-300 shadow-[0_30px_60px_-25px_rgba(14,153,173,.6)] lg:scale-[1.03] [&_h3]:text-white"
                      : "border border-line bg-white"
                  }`}
                >
                  {featured && (
                    <span className="absolute -top-3 right-6 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-ink">Most popular</span>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className={featured ? "text-slate-400" : "text-muted"}>{plan.tagline}</p>
                  <div className={`mb-1 mt-2 flex items-baseline gap-1 font-display text-5xl font-extrabold ${featured ? "text-white" : "text-ink"}`}>
                    {price === null ? (
                      plan.price as string
                    ) : (
                      <>
                        <span className="text-2xl">₹</span>
                        {price.toLocaleString("en-IN")}
                        <small className="font-sans text-base font-medium text-slate-400">/{billing === "yearly" ? "year" : "month"}</small>
                      </>
                    )}
                  </div>
                  <CheckList items={plan.features} dark={featured} className="flex-1 content-start" />
                  <Link href={featured && activePlan ? "/dashboard" : href} className={buttonClass(featured ? "primary" : "outline", "md", "w-full")}>
                    {featured && activePlan ? "You're subscribed ✓" : plan.cta}
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
