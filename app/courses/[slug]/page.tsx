import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell";
import { CheckList, Container, LEVEL_TAG, Tag, buttonClass } from "@/components/ui";
import { enroll } from "@/app/actions/learning";
import { getSession } from "@/lib/auth";
import { CATEGORY_LABEL } from "@/lib/data";
import { getActiveSubscription, getCourseBySlug, getEnrollment } from "@/lib/queries";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourseBySlug((await params).slug);
  return { title: course ? `${course.title} — Euron` : "Course not found", description: course?.description };
}

export default async function CoursePage({ params }: Props) {
  const course = await getCourseBySlug((await params).slug);
  if (!course) notFound();

  const session = await getSession();
  const [enrollment, sub] = session
    ? await Promise.all([getEnrollment(session.userId, course.id), getActiveSubscription(session.userId)])
    : [undefined, undefined];

  const hasAccess = course.isFree || !!sub;
  const cta = enrollment ? "Continue learning" : !session ? "Log in to enroll" : hasAccess ? "Enroll now" : "Subscribe to enroll";

  return (
    <PageShell>
      <section className="text-white" style={{ background: course.gradient }}>
        <Container className="grid items-center gap-8 py-16 md:grid-cols-[1fr_auto]">
          <div>
            <Link href="/courses" className="text-sm font-semibold text-white/80 hover:text-white">← All courses</Link>
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag className="bg-white/90 text-ink">{CATEGORY_LABEL[course.category]}</Tag>
              <Tag className={LEVEL_TAG[course.level]}>{course.level}</Tag>
              {course.isFree && <Tag className="bg-amber-400 text-ink">Free</Tag>}
            </div>
            <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-lg text-white/90">{course.description}</p>
          </div>
          <div className="text-[6rem] leading-none drop-shadow-lg">{course.icon}</div>
        </Container>
      </section>

      <Container className="grid gap-10 py-14 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-4 text-2xl font-bold">What you&apos;ll get</h2>
          <CheckList
            items={[
              `${course.modules} modules · ${course.hours} hours of content`,
              "Hands-on assignments with AI feedback",
              "Live doubt-clearing sessions with mentors",
              "Verifiable certificate on completion",
            ]}
          />
          <h2 className="mb-4 mt-10 text-2xl font-bold">Syllabus</h2>
          <ol className="grid gap-2">
            {Array.from({ length: Math.min(course.modules, 8) }, (_, i) => (
              <li key={i} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
                <span className="grid size-7 place-items-center rounded-full bg-tint text-sm font-bold text-primary-700">{i + 1}</span>
                Module {i + 1}
                {!hasAccess && i > 0 && <span className="ml-auto text-sm text-muted">🔒</span>}
              </li>
            ))}
            {course.modules > 8 && <li className="px-4 text-sm text-muted">+ {course.modules - 8} more modules</li>}
          </ol>
        </div>

        <aside className="h-fit rounded-[22px] border border-line p-6 shadow-card lg:sticky lg:top-24">
          <p className="text-sm text-muted">{course.isFree ? "Free for everyone" : "Included with Euron One"}</p>
          <p className="mb-5 font-display text-3xl font-extrabold text-ink">{course.isFree ? "₹0" : "From ₹999/mo"}</p>
          {enrollment ? (
            <>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-tint">
                <span className="block h-full bg-linear-to-r from-primary to-accent" style={{ width: `${enrollment.progress}%` }} />
              </div>
              <p className="mb-4 text-sm text-muted">{enrollment.progress}% complete</p>
              <Link href="/dashboard" className={buttonClass("primary", "lg", "w-full")}>{cta}</Link>
            </>
          ) : (
            <form action={enroll.bind(null, course.id)}>
              <button className={buttonClass("primary", "lg", "w-full")}>{cta}</button>
            </form>
          )}
        </aside>
      </Container>
    </PageShell>
  );
}
