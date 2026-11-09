import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import AdminCourseForm from "@/components/AdminCourseForm";
import { Container } from "@/components/ui";
import { deleteCourse, togglePublish } from "@/app/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { CATEGORY_LABEL } from "@/lib/data";
import { getAdminOverview, listCourses } from "@/lib/queries";

export const metadata: Metadata = { title: "Admin — Euron" };

const fmt = (d: Date) => d.toLocaleDateString("en-IN", { dateStyle: "medium" });

export default async function AdminPage() {
  await requireAdmin();
  const [overview, courses] = await Promise.all([getAdminOverview(), listCourses({ includeUnpublished: true })]);

  return (
    <PageShell>
      <Container className="py-12">
        <h1 className="mb-6 text-4xl font-extrabold">Admin</h1>
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Users", overview.totals.users],
            ["Active subscriptions", overview.totals.activeSubs],
            ["Enrollments", overview.totals.enrollments],
            ["Newsletter", overview.totals.newsletter],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl border border-line bg-tint px-5 py-4">
              <small className="text-muted">{k}</small>
              <p className="font-display text-3xl font-extrabold text-ink">{v}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <section>
            <h2 className="mb-4 text-2xl font-bold">Courses ({courses.length})</h2>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="bg-tint text-muted">
                  <tr><th className="px-4 py-3">Course</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Status</th><th className="px-4 py-3" /></tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c.id} className="border-t border-line">
                      <td className="px-4 py-3">
                        <Link href={`/courses/${c.slug}`} className="font-semibold text-ink hover:text-primary-700">{c.icon} {c.title}</Link>
                        {c.isFree && <span className="ml-2 text-xs font-bold text-amber-600">FREE</span>}
                      </td>
                      <td className="px-4 py-3">{CATEGORY_LABEL[c.category]}</td>
                      <td className="px-4 py-3">
                        <form action={togglePublish.bind(null, c.id)}>
                          <button className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${c.published ? "bg-primary-50 text-primary-700" : "bg-slate-100 text-slate-500"}`}>
                            {c.published ? "Published" : "Draft"}
                          </button>
                        </form>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <form action={deleteCourse.bind(null, c.id)}>
                          <button className="text-sm font-semibold text-red-600 hover:underline">Delete</button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <aside className="h-fit rounded-[22px] border border-line p-6">
            <h2 className="mb-4 text-xl font-bold">New course</h2>
            <AdminCourseForm />
          </aside>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-3">
          <section>
            <h2 className="mb-3 text-xl font-bold">Recent users</h2>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {overview.recentUsers.map((u) => (
                <li key={u.id} className="px-4 py-3 text-sm">
                  <b>{u.name}</b> {u.role === "admin" && <span className="text-xs font-bold text-primary-700">ADMIN</span>}
                  <div className="text-muted">{u.email} · {fmt(u.createdAt)}</div>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold">Sales leads</h2>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {overview.recentLeads.length === 0 && <li className="px-4 py-3 text-sm text-muted">No leads yet.</li>}
              {overview.recentLeads.map((l) => (
                <li key={l.id} className="px-4 py-3 text-sm">
                  <b>{l.name}</b> · {l.organization}
                  <div className="text-muted">{l.email} · {fmt(l.createdAt)}</div>
                  {l.message && <p className="mt-1">{l.message}</p>}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-bold">Newsletter</h2>
            <ul className="divide-y divide-line rounded-2xl border border-line">
              {overview.newsletter.length === 0 && <li className="px-4 py-3 text-sm text-muted">No subscribers yet.</li>}
              {overview.newsletter.map((n) => (
                <li key={n.id} className="px-4 py-3 text-sm">{n.email}<div className="text-muted">{fmt(n.createdAt)}</div></li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </PageShell>
  );
}
