import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import CourseCard from "@/components/CourseCard";
import { Container, inputClass, buttonClass } from "@/components/ui";
import { CATEGORIES } from "@/lib/data";
import { listCourses } from "@/lib/queries";

export const metadata: Metadata = { title: "Courses — Euron" };

export default async function CoursesPage({ searchParams }: { searchParams: Promise<{ q?: string; category?: string }> }) {
  const { q = "", category = "all" } = await searchParams;
  const courses = await listCourses({ q: q.trim() || undefined, category: category === "all" ? undefined : category });

  const hrefFor = (cat: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (cat !== "all") p.set("category", cat);
    const s = p.toString();
    return s ? `/courses?${s}` : "/courses";
  };

  return (
    <PageShell>
      <section className="bg-tint py-14">
        <Container>
          <h1 className="mb-2 text-4xl font-extrabold sm:text-5xl">All courses</h1>
          <p className="mb-6 text-muted">Every course below is included with Euron One. Free courses are open to everyone.</p>
          <form className="flex max-w-xl gap-2" action="/courses">
            {category !== "all" && <input type="hidden" name="category" value={category} />}
            <input name="q" defaultValue={q} placeholder="Search courses…" className={inputClass} aria-label="Search courses" />
            <button className={buttonClass("primary")}>Search</button>
          </form>
        </Container>
      </section>
      <Container className="py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              href={hrefFor(c.id)}
              className={`rounded-full border-[1.5px] px-4 py-2 font-semibold transition ${
                category === c.id ? "border-ink bg-ink text-white" : "border-line bg-white hover:border-primary"
              }`}
            >
              {c.label}
            </Link>
          ))}
        </div>
        {courses.length === 0 ? (
          <p className="py-16 text-center text-muted">No courses match “{q}”. Try a different search.</p>
        ) : (
          <>
            <p className="mb-4 text-sm text-muted">{courses.length} course{courses.length === 1 ? "" : "s"}</p>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {courses.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
            </div>
          </>
        )}
      </Container>
    </PageShell>
  );
}
