import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

const API = "https://api.razorpay.com/v1";

export function razorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID ?? "";
  const keySecret = process.env.RAZORPAY_KEY_SECRET ?? "";
  return { keyId, keySecret, enabled: Boolean(keyId && keySecret) };
}

/** Mock checkout is only allowed in development when Razorpay keys are missing. */
export function mockPaymentsAllowed() {
  return !razorpayConfig().enabled && process.env.NODE_ENV !== "production";
}

export type RazorpayOrder = { id: string; amount: number; currency: string; receipt: string; status: string };

export async function createRazorpayOrder(input: {
  amount: number;
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<RazorpayOrder> {
  const { keyId, keySecret, enabled } = razorpayConfig();
  if (!enabled) throw new Error("Razorpay is not configured");

  const res = await fetch(`${API}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({ currency: "INR", ...input }),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("Razorpay order creation failed", res.status, body);
    throw new Error("Could not start payment. Please try again.");
  }
  return res.json();
}

function safeEqualHex(a: string, b: string) {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/** Verifies the signature returned by Razorpay Checkout: HMAC_SHA256(order_id|payment_id, key_secret). */
export function verifyCheckoutSignature(orderId: string, paymentId: string, signature: string) {
  const { keySecret } = razorpayConfig();
  if (!keySecret) return false;
  const expected = createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  return safeEqualHex(expected, signature);
}

/** Verifies X-Razorpay-Signature on webhooks: HMAC_SHA256(raw_body, webhook_secret). */
export function verifyWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqualHex(expected, signature);
}
