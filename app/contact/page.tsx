import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import LeadForm from "@/components/LeadForm";
import { CheckList, Container } from "@/components/ui";

export const metadata: Metadata = { title: "Teams & Colleges — Euron" };

export default function ContactPage() {
  return (
    <PageShell>
      <Container className="grid gap-12 py-14 lg:grid-cols-2">
        <div>
          <span className="mb-3 inline-block text-[0.82rem] font-bold uppercase tracking-[0.12em] text-primary">Teams</span>
          <h1 className="mb-3 text-4xl font-extrabold sm:text-5xl">Upskill your whole team or campus</h1>
          <p className="text-lg text-muted">Give every learner the full Euron One subscription, with tools to track progress across your organization.</p>
          <CheckList items={["Bulk licences at volume pricing", "Admin dashboard & analytics", "Custom learning paths", "Dedicated success manager"]} />
        </div>
        <div className="rounded-[22px] border border-line p-6 shadow-card sm:p-8">
          <LeadForm />
        </div>
      </Container>
    </PageShell>
  );
}
