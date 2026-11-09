import { STEPS } from "@/lib/data";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./ui";

export default function HowItWorks() {
  return (
    <section className="bg-ink py-[72px] text-slate-300 sm:py-24 [&_h2]:text-white [&_h3]:text-white">
      <Container>
        <Reveal>
          <SectionHead eyebrow="How it works" title="Four steps to your next role" light />
        </Reveal>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <li className="h-full rounded-[18px] border border-white/10 bg-white/[.04] p-6">
                <span className="mb-2 inline-block bg-linear-to-r from-teal-300 to-blue-400 bg-clip-text font-display text-4xl font-extrabold text-transparent">
                  0{i + 1}
                </span>
                <h3 className="mb-1 text-xl font-bold">{s.title}</h3>
                <p>{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
