import Link from "next/link";
import type { Project } from "@/lib/db/schema";
import Reveal from "./Reveal";
import { CheckList, Container, LEVEL_TAG, Tag, buttonClass } from "./ui";

const ICON_BG = ["bg-primary-50", "bg-orange-50", "bg-blue-100", "bg-pink-100"];

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="bg-tint py-[72px] sm:py-24">
      <Container className="grid items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <span className="mb-3 inline-block text-[0.82rem] font-bold uppercase tracking-[0.12em] text-primary">AI-powered projects</span>
          <h2 className="mb-3 text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold leading-[1.12]">Build a portfolio that actually gets noticed</h2>
          <p className="text-lg text-muted">
            Guided, real-world projects with starter code, datasets and automated AI feedback on every submission. Ship
            work you can demo in an interview.
          </p>
          <CheckList
            className="mb-8"
            items={[
              "Step-by-step milestones with hints when you're stuck",
              "Instant AI code review and improvement suggestions",
              "One-click deploy and shareable project pages",
            ]}
          />
          <Link href="/signup" className={buttonClass("primary")}>Start a project</Link>
        </Reveal>
        <div className="grid gap-4">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <div className={`flex items-center gap-4 rounded-[18px] border border-line bg-white px-5 py-4 shadow-card transition hover:translate-x-1 ${i % 2 ? "sm:ml-8" : ""}`}>
                <div className={`grid size-[52px] flex-none place-items-center rounded-2xl text-2xl ${ICON_BG[i % ICON_BG.length]}`}>{p.icon}</div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold">{p.title}</h3>
                  <small className="text-muted">{p.stack}</small>
                </div>
                <Tag className={`ml-auto ${LEVEL_TAG[p.difficulty]}`}>{p.difficulty}</Tag>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
