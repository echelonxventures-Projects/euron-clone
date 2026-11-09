"use server";

import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, payments } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { fulfillOrder, markOrderFailed, priceInPaise } from "@/lib/billing";
import { createRazorpayOrder, mockPaymentsAllowed, razorpayConfig, verifyCheckoutSignature } from "@/lib/razorpay";

export type CheckoutOrder =
  | { mode: "razorpay"; keyId: string; orderId: string; amount: number; currency: string; prefill: { name: string; email: string } }
  | { mode: "mock" }
  | { mode: "error"; error: string };

const billingSchema = z.enum(["monthly", "yearly"]);

export async function createCheckoutOrder(billingInput: string): Promise<CheckoutOrder> {
  const user = await getCurrentUser();
  if (!user) return { mode: "error", error: "Please log in to continue." };
  const billing = billingSchema.safeParse(billingInput);
  if (!billing.success) return { mode: "error", error: "Invalid billing period." };

  const amount = priceInPaise(billing.data);

  // Dev-only fallback so the app is usable without Razorpay keys.
  if (mockPaymentsAllowed()) {
    const orderId = `mock_${randomUUID()}`;
    await db.insert(payments).values({ userId: user.id, provider: "mock", orderId, billing: billing.data, amount });
    await fulfillOrder(orderId, `mock_pay_${randomUUID()}`);
    return { mode: "mock" };
  }

  const { keyId, enabled } = razorpayConfig();
  if (!enabled) return { mode: "error", error: "Payments are not configured. Please contact support." };

  try {
    const receipt = `u${user.id}_${Date.now()}`; // Razorpay receipts are max 40 chars
    const order = await createRazorpayOrder({
      amount,
      receipt,
      notes: { userId: String(user.id), billing: billing.data, plan: "euron_one" },
    });
    await db.insert(payments).values({ userId: user.id, orderId: order.id, billing: billing.data, amount, currency: order.currency });
    return { mode: "razorpay", keyId, orderId: order.id, amount, currency: order.currency, prefill: { name: user.name, email: user.email } };
  } catch (e) {
    return { mode: "error", error: e instanceof Error ? e.message : "Could not start payment." };
  }
}

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function verifyCheckoutPayment(input: unknown): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Session expired. Please log in again." };
  const parsed = verifySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid payment response." };
  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = parsed.data;

  // The order must belong to the logged-in user.
  const payment = await db.query.payments.findFirst({ where: and(eq(payments.orderId, orderId), eq(payments.userId, user.id)) });
  if (!payment) return { ok: false, error: "Order not found." };

  if (!verifyCheckoutSignature(orderId, paymentId, signature)) {
    return { ok: false, error: "Payment verification failed. If you were charged, it will be refunded automatically." };
  }

  await fulfillOrder(orderId, paymentId); // no-op if the webhook got there first
  return { ok: true };
}

export async function reportCheckoutFailure(orderId: string) {
  const user = await getCurrentUser();
  if (!user) return;
  const payment = await db.query.payments.findFirst({ where: and(eq(payments.orderId, orderId), eq(payments.userId, user.id)) });
  if (payment) await markOrderFailed(orderId);
}
