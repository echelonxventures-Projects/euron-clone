import Link from "next/link";
import type { Course } from "@/lib/db/schema";
import { CATEGORY_LABEL } from "@/lib/data";

export default function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      style={{ animationDelay: `${index * 40}ms` }}
      className="group flex animate-fade-up flex-col overflow-hidden rounded-[18px] border border-line bg-white transition hover:-translate-y-1 hover:shadow-card"
    >
      <div className="relative grid aspect-video place-items-center text-[2.6rem]" style={{ background: course.gradient }}>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-ink">
          {CATEGORY_LABEL[course.category]}
        </span>
        {course.isFree && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-bold text-ink">Free</span>
        )}
        <span className="transition group-hover:scale-110">{course.icon}</span>
      </div>
      <div className="flex flex-1 flex-col gap-2 px-5 pb-5 pt-4">
        <h3 className="text-[1.08rem] font-bold">{course.title}</h3>
        <p className="line-clamp-2 text-sm text-muted">{course.description}</p>
        <div className="mt-auto flex gap-4 pt-1 text-sm text-muted">
          <span>🎓 {course.level}</span>
          <span>⏱ {course.hours} hrs</span>
          <span>📚 {course.modules} modules</span>
        </div>
      </div>
    </Link>
  );
}
