import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { Container, buttonClass } from "@/components/ui";
import { cancelSubscription, unenroll, updateProgress } from "@/app/actions/learning";
import { requireUser } from "@/lib/auth";
import { getSubscription, listEnrollments, listPayments } from "@/lib/queries";

export const metadata: Metadata = { title: "Dashboard — Euron" };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ subscribed?: string }> }) {
  const user = await requireUser("/dashboard");
  const [enrolled, sub, history, { subscribed }] = await Promise.all([
    listEnrollments(user.id),
    getSubscription(user.id),
    listPayments(user.id),
    searchParams,
  ]);
  const subActive = !!sub && sub.currentPeriodEnd > new Date();
  const avg = enrolled.length ? Math.round(enrolled.reduce((s, e) => s + e.progress, 0) / enrolled.length) : 0;
  const completed = enrolled.filter((e) => e.progress === 100).length;

  return (
    <PageShell>
      <section className="bg-tint py-12">
        <Container>
          {subscribed && (
            <p className="mb-6 rounded-xl bg-primary-50 px-4 py-3 font-semibold text-primary-700">
              🎉 Your Euron One subscription is active. Every course is now unlocked.
            </p>
          )}
          <h1 className="text-3xl font-extrabold sm:text-4xl">Hi, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-muted">Here&apos;s where you left off.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Enrolled", enrolled.length],
              ["Completed", completed],
              ["Avg. progress", `${avg}%`],
              ["Plan", subActive ? `One · ${sub!.billing}` : "Free"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line bg-white px-5 py-4">
                <small className="text-muted">{k}</small>
                <p className="font-display text-2xl font-extrabold capitalize text-ink">{v}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="grid gap-10 py-12 lg:grid-cols-[1fr_340px]">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My courses</h2>
            <Link href="/courses" className="font-semibold text-primary-700 hover:underline">Browse more →</Link>
          </div>
          {enrolled.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-10 text-center">
              <p className="mb-4 text-muted">You haven&apos;t enrolled in any courses yet.</p>
              <Link href="/courses" className={buttonClass("primary")}>Find a course</Link>
            </div>
          ) : (
            <ul className="grid gap-4">
              {enrolled.map((e) => (
                <li key={e.id} className="flex flex-col gap-4 rounded-2xl border border-line p-5 sm:flex-row sm:items-center">
                  <div className="grid size-14 flex-none place-items-center rounded-2xl text-2xl" style={{ background: e.course.gradient }}>
                    {e.course.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/courses/${e.course.slug}`} className="font-bold text-ink hover:text-primary-700">{e.course.title}</Link>
                    <div className="my-2 h-2 overflow-hidden rounded-full bg-tint">
                      <span className="block h-full bg-linear-to-r from-primary to-accent transition-all" style={{ width: `${e.progress}%` }} />
                    </div>
                    <small className="text-muted">
                      {e.progress === 100 ? "Completed 🏆" : `${e.progress}% · ${Math.round((e.progress / 100) * e.course.modules)} of ${e.course.modules} modules`}
                    </small>
                  </div>
                  <div className="flex gap-2">
                    {e.progress < 100 && (
                      <form action={updateProgress.bind(null, e.id, 10)}>
                        <button className={buttonClass("primary")}>Complete module</button>
                      </form>
                    )}
                    <form action={unenroll.bind(null, e.id)}>
                      <button className={buttonClass("outline")} aria-label={`Leave ${e.course.title}`}>Leave</button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="grid h-fit gap-6">
        <div className="rounded-[22px] border border-line p-6">
          <h2 className="mb-1 text-xl font-bold">Subscription</h2>
          {sub ? (
            <>
              <p className="text-muted">
                Euron One · <span className="capitalize">{sub.billing}</span>
              </p>
              <p className="mt-3 text-sm">
                {sub.status === "active" ? "Renews" : "Access ends"} on{" "}
                <b>{sub.currentPeriodEnd.toLocaleDateString("en-IN", { dateStyle: "medium" })}</b>
              </p>
              {sub.status === "active" ? (
                <form action={cancelSubscription} className="mt-5">
                  <button className={buttonClass("outline", "md", "w-full")}>Cancel subscription</button>
                </form>
              ) : (
                <Link href="/checkout?billing=monthly" className={buttonClass("primary", "md", "mt-5 w-full")}>Resubscribe</Link>
              )}
            </>
          ) : (
            <>
              <p className="mb-5 text-muted">You&apos;re on the free plan. Unlock every course and career tool.</p>
              <Link href="/checkout?billing=yearly" className={buttonClass("primary", "md", "w-full")}>Upgrade to Euron One</Link>
            </>
          )}
        </div>
        {history.length > 0 && (
          <div className="rounded-[22px] border border-line p-6">
            <h2 className="mb-3 text-xl font-bold">Payment history</h2>
            <ul className="divide-y divide-line text-sm">
              {history.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div>
                    <b className="capitalize">One · {p.billing}</b>
                    <div className="text-muted">{(p.paidAt ?? p.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</div>
                  </div>
                  <div className="text-right">
                    <b>₹{(p.amount / 100).toLocaleString("en-IN")}</b>
                    <div className={p.status === "paid" ? "text-primary-700" : "text-red-600"}>{p.status === "paid" ? "Paid" : "Failed"}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        </aside>
      </Container>
    </PageShell>
  );
}
