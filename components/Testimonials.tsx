import { TESTIMONIALS } from "@/lib/data";
import Reveal from "./Reveal";
import { Container, SectionHead } from "./ui";

export default function Testimonials() {
  return (
    <section className="bg-tint py-[72px] sm:py-24">
      <Container>
        <Reveal>
          <SectionHead eyebrow="Learner stories" title="What learners say" />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.track} delay={i * 80}>
              <figure className="flex h-full flex-col justify-between gap-5 rounded-[18px] border border-line bg-white p-6">
                <blockquote className="text-[1.04rem]">“{t.quote}”</blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="grid size-[42px] place-items-center rounded-full bg-linear-135 from-primary to-accent font-bold text-white">
                    {t.initial}
                  </span>
                  <div>
                    <b className="block">Sample Learner</b>
                    <small className="text-muted">{t.track}</small>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
