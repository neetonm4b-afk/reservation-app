import { NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { prisma } from "@/lib/db";
import { auditLog } from "@/lib/auth";
import { notifyBookingCancelled } from "@/lib/notifications";

// POST /api/bookings/[id]/cancel
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // セッション認証（bodyのuserIdは使わない）
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ success: false, error: "ログインが必要です" }, { status: 401 });

    const { id: bookingId } = await params;
    const { reason } = await req.json().catch(() => ({}));

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId: session.user.id },
      include: { service: true, user: true },
    });

    if (!booking)
      return NextResponse.json({ success: false, error: "予約が見つかりません" }, { status: 404 });

    if (!["pending", "confirmed"].includes(booking.status))
      return NextResponse.json(
        { success: false, error: "この予約はキャンセルできません" },
        { status: 400 }
      );

    // キャンセルポリシー計算
    const settings = await prisma.businessSetting.findFirst();
    const policy = settings
      ? JSON.parse(settings.cancellationPolicy)
      : { policy: [] };

    const bookingDatetime = new Date(`${booking.bookingDate}T${booking.bookingTime}`);
    const hoursDiff =
      (bookingDatetime.getTime() - Date.now()) / (1000 * 60 * 60);

    const applicable = (
      policy.policy as { daysBefore: number; feePercentage: number }[]
    )
      .filter((p) => hoursDiff >= p.daysBefore * 24)
      .sort((a, b) => b.daysBefore - a.daysBefore)[0];

    const feePercent = applicable?.feePercentage ?? 100;
    const cancellationFee = (booking.amount * feePercent) / 100;
    const refundAmount = booking.amount - cancellationFee;

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "cancelled",
        cancellationReason: reason ?? null,
        cancellationFee,
        refundAmount,
        cancelledAt: new Date(),
      },
    });

    await auditLog({
      actorId: session.user.id,
      actorType: "user",
      action: "booking_cancelled",
      resourceType: "booking",
      resourceId: bookingId,
      newValues: { status: "cancelled", cancellationFee, refundAmount },
      status: "success",
    });

    // キャンセルメール送信（非同期）
    notifyBookingCancelled({
      userId: booking.userId,
      bookingId: booking.id,
      userName: booking.user.name,
      userEmail: booking.user.email,
      serviceName: booking.service.name,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      cancellationFee,
      refundAmount,
    }).catch((err) => console.error("通知送信エラー:", err));

    return NextResponse.json({
      success: true,
      data: { cancellationFee, refundAmount },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "キャンセルに失敗しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
