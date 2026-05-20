import { NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auditLog } from "@/lib/auth";
import { notifyBookingConfirmed } from "@/lib/notifications";

// POST /api/bookings/[id]/confirm
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ success: false, error: "ログインが必要です" }, { status: 401 });

    const { id: bookingId } = await params;
    const body = await req.json().catch(() => ({}));
    const { paymentIntentId } = body;

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: session.user.id },
      include: { service: true, user: true },
    });
    if (!booking)
      return NextResponse.json({ success: false, error: "予約が見つかりません" }, { status: 404 });

    // 冪等性チェック
    if (booking.status === "confirmed") {
      return NextResponse.json({
        success: true,
        data: { bookingId, message: "Already confirmed" },
      });
    }

    // Stripe決済確認（Stripe設定済みの場合のみ）
    const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
    const isStripeConfigured =
      stripeKey.startsWith("sk_live_") ||
      (stripeKey.startsWith("sk_test_") && !stripeKey.includes("placeholder") && !stripeKey.includes("your-"));

    if (isStripeConfigured && paymentIntentId) {
      const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (intent.status !== "succeeded") {
        return NextResponse.json(
          { success: false, error: "決済が完了していません" },
          { status: 402 }
        );
      }
    }

    // 予約を確定
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "confirmed",
        paymentStatus: "succeeded",
        updatedAt: new Date(),
      },
    });

    // 支払いレコード更新
    if (paymentIntentId) {
      const payment = await prisma.payment.findFirst({
        where: { bookingId },
      });
      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "succeeded", processedAt: new Date() },
        });
      }
    }

    await auditLog({
      actorId: session.user.id,
      actorType: "user",
      action: "booking_confirmed",
      resourceType: "booking",
      resourceId: bookingId,
      newValues: { status: "confirmed" },
      status: "success",
    });

    // 確定メール送信（非同期、失敗しても予約確定は成功扱い）
    notifyBookingConfirmed({
      userId: booking.userId,
      bookingId: booking.id,
      userName: booking.user.name,
      userEmail: booking.user.email,
      serviceName: booking.service.name,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      amount: booking.amount,
    }).catch((err) => console.error("通知送信エラー:", err));

    return NextResponse.json({
      success: true,
      data: { bookingId, message: "予約が確定しました" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "確定に失敗しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
