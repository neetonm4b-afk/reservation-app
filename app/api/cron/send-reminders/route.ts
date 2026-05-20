/**
 * GET /api/cron/send-reminders
 *
 * Vercel Cron Job: 毎日 10:00 UTC に実行し、翌日に予約が入っている
 * confirmed かつ未リマインダー送信の予約にメールを送信する。
 *
 * Authorization: Bearer ${CRON_SECRET}
 */
import { prisma } from "@/lib/db";
import { notifyBookingReminder } from "@/lib/notifications";
import { NextResponse } from "next/server";

// App Router でのタイムアウト設定（config export は廃止済み）
export const maxDuration = 60;

export async function GET(request: Request) {
  // ── 認証チェック ───────────────────────────────────────────────────
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET ?? "";

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  // ── 翌日の日付文字列 (YYYY-MM-DD) を生成 ──────────────────────────
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10); // "YYYY-MM-DD"

  try {
    // ── 対象予約を取得 ──────────────────────────────────────────────
    const bookings = await prisma.booking.findMany({
      where: {
        status: "confirmed",
        reminderSent: false,          // camelCase（schema準拠）
        bookingDate: tomorrowStr,     // 翌日の予約のみ
        deletedAt: null,
      },
      include: {
        user: true,
        service: true,
      },
    });

    console.log(`[send-reminders] 対象予約数: ${bookings.length} (date: ${tomorrowStr})`);

    // ── リマインダー送信ループ ───────────────────────────────────────
    let sentCount = 0;
    const errors: { id: string; error: string }[] = [];

    for (const booking of bookings) {
      try {
        await notifyBookingReminder({
          userId:      booking.userId,      // camelCase（schema準拠）
          bookingId:   booking.id,          // PK は id
          userName:    booking.user.name ?? "",
          userEmail:   booking.user.email,
          serviceName: booking.service.name,
          bookingDate: booking.bookingDate,
          bookingTime: booking.bookingTime,
        });

        // 送信済みフラグを更新
        await prisma.booking.update({
          where: { id: booking.id },        // PK は id
          data: {
            reminderSent:   true,
            reminderSentAt: new Date(),
          },
        });

        sentCount++;
        console.log(`  ✓ Reminder sent → bookingId: ${booking.id} (${booking.user.email})`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        errors.push({ id: booking.id, error: msg });
        console.error(`  ✗ Failed → bookingId: ${booking.id}: ${msg}`);
      }
    }

    return NextResponse.json({
      success: true,
      date:    tomorrowStr,
      total:   bookings.length,
      sent:    sentCount,
      failed:  errors.length,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[send-reminders] Cron error:", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
