import { CAREER_FEATURES } from "@/lib/data";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./ui";

export default function CareerTools() {
  return (
    <section id="career" className="py-[72px] sm:py-24">
      <Container>
        <Reveal>
          <SectionHead eyebrow="Career toolkit" title="From learning to hired, in one place">
            Everything after the course is covered too.
          </SectionHead>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CAREER_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 80}>
              <article className="h-full rounded-[18px] border border-line bg-white p-6 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-card">
                <div className="mb-4 grid size-[50px] place-items-center rounded-2xl bg-tint text-2xl">{f.icon}</div>
                <h3 className="mb-2 text-xl font-bold">{f.title}</h3>
                <p className="text-muted">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
