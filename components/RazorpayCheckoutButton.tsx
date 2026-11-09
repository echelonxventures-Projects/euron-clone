"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCheckoutOrder, reportCheckoutFailure, verifyCheckoutPayment } from "@/app/actions/payments";
import { buttonClass } from "./ui";

type RazorpayResponse = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };
type RazorpayInstance = { open: () => void; on: (event: "payment.failed", cb: (r: { error: { description?: string } }) => void) => void };
declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

export default function RazorpayCheckoutButton({ billing, next, label }: { billing: "monthly" | "yearly"; next?: string; label: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "verifying">("idle");
  const [error, setError] = useState<string | null>(null);

  const done = () => router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard?subscribed=1");

  async function pay() {
    setError(null);
    setStatus("loading");
    const order = await createCheckoutOrder(billing);

    if (order.mode === "error") {
      setError(order.error);
      return setStatus("idle");
    }
    if (order.mode === "mock") return done();

    if (!window.Razorpay) {
      setError("Payment window failed to load. Check your connection or disable ad-blockers and retry.");
      return setStatus("idle");
    }

    const rzp = new window.Razorpay({
      key: order.keyId,
      order_id: order.orderId,
      amount: order.amount,
      currency: order.currency,
      name: "Euron",
      description: `Euron One — ${billing}`,
      prefill: order.prefill,
      theme: { color: "#0e99ad" },
      handler: async (response: RazorpayResponse) => {
        setStatus("verifying");
        const result = await verifyCheckoutPayment(response);
        if (result.ok) return done();
        setError(result.error);
        setStatus("idle");
      },
      modal: { ondismiss: () => setStatus("idle") },
    });
    rzp.on("payment.failed", (r) => {
      setError(r.error.description ?? "Payment failed. Please try another method.");
      reportCheckoutFailure(order.orderId);
    });
    rzp.open();
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <button onClick={pay} disabled={status !== "idle"} className={buttonClass("primary", "lg", "w-full disabled:opacity-60")}>
        {status === "loading" ? "Starting payment…" : status === "verifying" ? "Confirming payment…" : label}
      </button>
      {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}
    </>
  );
}
