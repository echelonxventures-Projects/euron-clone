"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Course } from "@/lib/db/schema";
import { CATEGORIES } from "@/lib/data";
import CourseCard from "./CourseCard";
import Reveal from "./Reveal";
import { Container, SectionHead, buttonClass } from "./ui";

export default function CourseExplorer({ courses }: { courses: Course[] }) {
  const [filter, setFilter] = useState<string>("all");
  const list = useMemo(
    () => (filter === "all" ? courses : courses.filter((c) => c.category === filter)).slice(0, 8),
    [courses, filter],
  );

  return (
    <section id="courses" className="py-[72px] sm:py-24">
      <Container>
        <Reveal>
          <SectionHead eyebrow="Course library" title="Industry-ready courses, all included">
            Live and self-paced programs built with practitioners. Pick a track or mix and match — your subscription
            unlocks everything.
          </SectionHead>
          <div role="tablist" className="mb-8 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={filter === c.id}
                onClick={() => setFilter(c.id)}
                className={`rounded-full border-[1.5px] px-4 py-2 font-semibold transition ${
                  filter === c.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-primary"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Reveal>
        <div key={filter} className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {list.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
        </div>
        <div className="mt-10 text-center">
          <Link href={filter === "all" ? "/courses" : `/courses?category=${filter}`} className={buttonClass("outline")}>
            View all courses →
          </Link>
        </div>
      </Container>
    </section>
  );
}
