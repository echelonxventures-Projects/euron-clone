import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { CheckList, Container, buttonClass } from "@/components/ui";
import RazorpayCheckoutButton from "@/components/RazorpayCheckoutButton";
import { mockPaymentsAllowed } from "@/lib/razorpay";
import { requireUser } from "@/lib/auth";
import { PLANS } from "@/lib/data";
import Link from "next/link";

export const metadata: Metadata = { title: "Checkout — Euron" };

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ billing?: string; next?: string }> }) {
  const { billing: b, next } = await searchParams;
  const billing = b === "yearly" ? "yearly" : "monthly";
  const qs = new URLSearchParams({ billing, ...(next ? { next } : {}) }).toString();
  await requireUser(`/checkout?${qs}`);

  const plan = PLANS.find((p) => p.featured)!;
  const price = typeof plan.price === "string" ? 0 : plan.price[billing];

  return (
    <PageShell>
      <Container narrow className="py-14">
        <h1 className="mb-2 text-4xl font-extrabold">Checkout</h1>
        <p className="mb-8 text-muted">You&apos;re subscribing to {plan.name}.</p>
        <div className="grid gap-6 md:grid-cols-[1fr_300px]">
          <div className="rounded-[22px] border border-line p-6">
            <div className="mb-4 inline-flex rounded-full bg-tint p-1">
              {(["monthly", "yearly"] as const).map((opt) => (
                <Link
                  key={opt}
                  href={`/checkout?${new URLSearchParams({ billing: opt, ...(next ? { next } : {}) })}`}
                  className={`rounded-full px-5 py-2 font-semibold capitalize ${billing === opt ? "bg-white text-ink shadow" : "text-muted"}`}
                >
                  {opt}
                </Link>
              ))}
            </div>
            <CheckList items={plan.features} />
          </div>
          <div className="h-fit rounded-[22px] border border-line p-6 shadow-card">
            <p className="text-sm text-muted">Total due today</p>
            <p className="mb-1 font-display text-4xl font-extrabold text-ink">₹{price.toLocaleString("en-IN")}</p>
            <p className="mb-6 text-sm text-muted">Billed {billing}. Cancel anytime.</p>
            <RazorpayCheckoutButton billing={billing} next={next} label={`Pay ₹${price.toLocaleString("en-IN")}`} />
            <p className="mt-3 text-xs text-muted">
              {mockPaymentsAllowed()
                ? "Dev mode: Razorpay keys not set, so payment is simulated."
                : "Secured by Razorpay · UPI, cards, netbanking & wallets"}
            </p>
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
