import Link from "next/link";
import { LOGOS } from "@/lib/data";
import CountUp from "./CountUp";
import Reveal from "./Reveal";
import { Container, buttonClass } from "./ui";

export default function Hero({ stats }: { stats: { courses: number; projects: number; learners: number } }) {
  return (
    <section className="relative overflow-hidden pb-12 pt-12 sm:pt-[72px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[-10%] top-[-30%] h-[700px] bg-[radial-gradient(closest-side_at_25%_40%,rgba(14,153,173,.18),transparent),radial-gradient(closest-side_at_75%_30%,rgba(37,99,235,.14),transparent)]"
      />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-semibold text-primary-700 shadow-card">
            <span className="size-2 animate-pulse-ring rounded-full bg-primary" /> New: GenAI &amp; Agentic AI tracks are live
          </span>
          <h1 className="mb-4 text-[clamp(2.4rem,5.5vw,4.2rem)] font-extrabold leading-[1.08]">
            One student.
            <br />
            <span className="text-gradient">One subscription.</span>
            <br />
            Every skill you need.
          </h1>
          <p className="max-w-[560px] text-lg text-muted">
            Courses, hands-on AI projects, a resume builder, job matching and mock interviews — bundled into a single
            plan so you can go from learning to hired without juggling ten platforms.
          </p>
          <div className="my-8 flex flex-wrap gap-3">
            <Link href="/signup" className={buttonClass("primary", "lg")}>Start learning →</Link>
            <Link href="/courses" className={buttonClass("outline", "lg")}>Explore courses</Link>
          </div>
          <ul className="flex flex-wrap gap-6 sm:gap-10">
            {[
              { n: stats.courses, label: "courses" },
              { n: stats.projects, label: "AI projects" },
              { n: stats.learners, label: "learners" },
            ].map((s) => (
              <li key={s.label}>
                <strong className="font-display text-4xl text-ink"><CountUp to={s.n} /></strong>
                <span className="ml-1 font-medium text-muted">{s.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto w-full max-w-[520px]">
          <div className="-rotate-1 rounded-[22px] border border-line bg-white p-5 shadow-[0_30px_60px_-25px_rgba(11,18,32,.35)]">
            <div className="mb-4 flex items-center gap-3 font-bold text-ink">
              <span className="flex gap-1.5">
                <i className="size-2.5 rounded-full bg-red-300" />
                <i className="size-2.5 rounded-full bg-amber-300" />
                <i className="size-2.5 rounded-full bg-green-300" />
              </span>
              My learning
            </div>
            {[
              { t: "Generative AI with LLMs", tag: "In progress", tagC: "bg-primary-50 text-primary-700", w: 68, sub: "68% · 14 of 21 modules" },
              { t: "DSA in Python", tag: "Up next", tagC: "bg-orange-50 text-amber-700", w: 22, sub: "22% · 4 of 18 modules" },
            ].map((c) => (
              <div key={c.t} className="mb-3 rounded-2xl border border-line px-4 py-3.5">
                <div className="mb-2 flex items-center justify-between gap-2 text-[0.95rem]">
                  <b>{c.t}</b>
                  <span className={`rounded-full px-2 py-0.5 text-[0.72rem] font-bold ${c.tagC}`}>{c.tag}</span>
                </div>
                <div className="mb-1.5 h-2 overflow-hidden rounded-full bg-tint">
                  <span className="block h-full rounded-full bg-linear-to-r from-primary to-accent" style={{ width: `${c.w}%` }} />
                </div>
                <small className="text-muted">{c.sub}</small>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Resume score", "86/100"],
                ["Job matches", "12"],
                ["Mock interviews", "3"],
                ["Streak", "19🔥"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl bg-tint px-4 py-3">
                  <small className="block text-xs text-muted">{k}</small>
                  <b className="font-display text-2xl text-ink">{v}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-4 left-2 animate-bob rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold shadow-card sm:-left-7 sm:bottom-[22%]">
            ✅ Project “RAG Chatbot” submitted
          </div>
          <div className="absolute -top-5 right-2 animate-bob rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm font-semibold shadow-card [animation-delay:-2.5s] sm:-right-4">
            💼 New match: ML Engineer
          </div>
        </Reveal>
      </Container>

      <Container className="relative mt-16 text-center">
        <p className="text-sm font-medium text-muted">Learners from our community now work at teams like</p>
        <div className="mt-3 flex flex-wrap justify-center gap-x-12 gap-y-4 font-display text-[1.35rem] font-bold text-slate-400">
          {LOGOS.map((l) => <span key={l}>{l}</span>)}
        </div>
      </Container>
    </section>
  );
}
