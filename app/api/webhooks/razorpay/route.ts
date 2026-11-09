import { NextResponse } from "next/server";
import { fulfillOrder, markOrderFailed } from "@/lib/billing";
import { verifyWebhookSignature } from "@/lib/razorpay";

/**
 * Razorpay webhook — configure in Dashboard → Webhooks:
 *   URL:    https://<your-domain>/api/webhooks/razorpay
 *   Events: payment.captured, order.paid, payment.failed
 * This is the source of truth if the user closes the tab before the checkout callback runs.
 */
export async function POST(req: Request) {
  const raw = await req.text(); // signature is computed over the raw body
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature"))) {
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  type Entity = { id: string; order_id?: string };
  let event: { event: string; payload: { payment?: { entity: Entity }; order?: { entity: Entity } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const payment = event.payload.payment?.entity;
  const orderId = event.payload.order?.entity.id ?? payment?.order_id;

  switch (event.event) {
    case "payment.captured":
    case "order.paid":
      if (orderId && payment) await fulfillOrder(orderId, payment.id);
      break;
    case "payment.failed":
      if (orderId) await markOrderFailed(orderId);
      break;
  }

  // Always 200 for verified events so Razorpay doesn't retry ones we intentionally ignore.
  return NextResponse.json({ received: true });
}
