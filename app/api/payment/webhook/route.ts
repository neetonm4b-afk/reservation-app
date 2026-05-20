import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature") ?? "";

  let event;
  try {
    const rawBody = await req.text();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

    if (webhookSecret && !webhookSecret.includes("placeholder")) {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } else {
      // 開発環境：シグネチャ検証をスキップ
      event = JSON.parse(rawBody);
    }
  } catch {
    return NextResponse.json({ error: "Webhook signature failed" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const pi = event.data.object as { id: string };
        const booking = await prisma.booking.findFirst({
          where: { stripePaymentIntentId: pi.id },
        });
        if (booking && booking.status !== "confirmed") {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: "confirmed", paymentStatus: "succeeded" },
          });
          await prisma.payment.updateMany({
            where: { stripePaymentIntentId: pi.id },
            data: { status: "succeeded", processedAt: new Date() },
          });
        }
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as { id: string };
        await prisma.payment.updateMany({
          where: { stripePaymentIntentId: pi.id },
          data: { status: "failed" },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Webhook error";
    console.error("Webhook processing error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
