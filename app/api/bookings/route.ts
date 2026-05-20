import { NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auditLog } from "@/lib/auth";

// POST /api/bookings — 予約作成 + Stripe Payment Intent
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ success: false, error: "ログインが必要です" }, { status: 401 });

    const { serviceId, bookingDate, bookingTime, notes } = await req.json();

    if (!serviceId || !bookingDate || !bookingTime)
      return NextResponse.json(
        { success: false, error: "serviceId, bookingDate, bookingTime は必須です" },
        { status: 400 }
      );

    const service = await prisma.service.findUnique({
      where: { id: serviceId, isActive: true },
    });
    if (!service)
      return NextResponse.json({ success: false, error: "サービスが見つかりません" }, { status: 404 });

    // 重複チェック
    const duplicate = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        bookingDate,
        bookingTime,
        status: { in: ["pending", "confirmed"] },
      },
    });
    if (duplicate)
      return NextResponse.json(
        { success: false, error: "この日時は既に予約されています" },
        { status: 409 }
      );

    // Stripe Payment Intent（テストモードではスキップ）
    let clientSecret: string | null = null;
    let stripePaymentIntentId: string | null = null;

    const stripeKey = process.env.STRIPE_SECRET_KEY ?? "";
    const isStripeConfigured =
      stripeKey.startsWith("sk_live_") || stripeKey.startsWith("sk_test_") &&
      !stripeKey.includes("placeholder") &&
      !stripeKey.includes("your-");

    if (isStripeConfigured) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(service.price),
        currency: "jpy",
        metadata: {
          userId: session.user.id,
          serviceId,
          bookingDate,
          bookingTime,
        },
      });
      clientSecret = paymentIntent.client_secret;
      stripePaymentIntentId = paymentIntent.id;
    }

    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        serviceId,
        bookingDate,
        bookingTime,
        status: "pending",
        amount: service.price,
        stripePaymentIntentId,
        paymentStatus: "pending",
        customerNotes: notes,
      },
    });

    if (stripePaymentIntentId) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          userId: session.user.id,
          stripePaymentIntentId,
          amount: service.price,
          status: "pending",
        },
      });
    }

    await auditLog({
      actorId: session.user.id,
      actorType: "user",
      action: "booking_created",
      resourceType: "booking",
      resourceId: booking.id,
      newValues: { serviceId, bookingDate, bookingTime, amount: service.price },
      status: "success",
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          bookingId: booking.id,
          clientSecret,
          amount: service.price,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "予約の作成に失敗しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

// GET /api/bookings — ユーザーの予約一覧
export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ success: false, error: "ログインが必要です" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const bookings = await prisma.booking.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
        ...(status ? { status } : {}),
      },
      include: { service: true, staff: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
