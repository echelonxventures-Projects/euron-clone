import "server-only";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db, payments, subscriptions } from "@/lib/db";
import { PLANS } from "@/lib/data";

export type Billing = "monthly" | "yearly";

/** Server-side source of truth for prices, in paise. Never trust an amount from the client. */
export function priceInPaise(billing: Billing) {
  const plan = PLANS.find((p) => p.featured);
  if (!plan || typeof plan.price === "string") throw new Error("Euron One plan is misconfigured");
  return plan.price[billing] * 100;
}

function addPeriod(from: Date, billing: Billing) {
  const d = new Date(from);
  if (billing === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

/**
 * Marks an order as paid and grants/extends the subscription.
 * Idempotent: the checkout callback and the webhook can both call it safely —
 * only the first call that flips the status to "paid" extends the subscription.
 */
export async function fulfillOrder(orderId: string, paymentId: string) {
  const fulfilled = await db.transaction(async (tx) => {
    const [payment] = await tx
      .update(payments)
      .set({ status: "paid", paymentId, paidAt: new Date() })
      .where(and(eq(payments.orderId, orderId), ne(payments.status, "paid")))
      .returning();
    if (!payment) return false; // unknown order, or already fulfilled

    const existing = await tx.query.subscriptions.findFirst({ where: eq(subscriptions.userId, payment.userId) });
    const now = new Date();
    // Renewing early stacks on top of the remaining period instead of wasting it.
    const base = existing && existing.currentPeriodEnd > now ? existing.currentPeriodEnd : now;
    const currentPeriodEnd = addPeriod(base, payment.billing);

    await tx
      .insert(subscriptions)
      .values({ userId: payment.userId, billing: payment.billing, status: "active", currentPeriodEnd })
      .onConflictDoUpdate({
        target: subscriptions.userId,
        set: { billing: payment.billing, status: "active", currentPeriodEnd },
      });
    return true;
  });

  if (fulfilled) revalidatePath("/dashboard");
  return fulfilled;
}

export async function markOrderFailed(orderId: string) {
  await db
    .update(payments)
    .set({ status: "failed" })
    .where(and(eq(payments.orderId, orderId), eq(payments.status, "created")));
}
