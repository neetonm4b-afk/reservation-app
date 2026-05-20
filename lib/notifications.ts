/**
 * Notification Service (Resend)
 * RESEND_API_KEY が設定されていれば実際にメールを送信する。
 * 未設定の場合はコンソールログのみ（開発フォールバック）。
 */
import { Resend } from "resend";
import { prisma } from "@/lib/db";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS =
  process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export type NotificationType =
  | "booking_confirmation"
  | "booking_reminder"
  | "booking_cancelled"
  | "booking_changed"
  | "promotion";

interface SendNotificationOptions {
  userId: string;
  bookingId?: string;
  type: NotificationType;
  recipient: string;
  subject: string;
  body: string;
  html?: string;
}

export async function sendNotification(opts: SendNotificationOptions) {
  // ① DB に記録
  const notification = await prisma.notification.create({
    data: {
      userId: opts.userId,
      bookingId: opts.bookingId ?? null,
      type: opts.type,
      channel: "email",
      subject: opts.subject,
      body: opts.body,
      recipient: opts.recipient,
      status: "pending",
    },
  });

  const apiKey = process.env.RESEND_API_KEY ?? "";
  const isResendConfigured = apiKey.length > 10;

  if (isResendConfigured) {
    try {
      await resend.emails.send({
        from: FROM_ADDRESS,
        to: opts.recipient,
        subject: opts.subject,
        html: opts.html ?? `<pre style="font-family:sans-serif;white-space:pre-wrap">${opts.body}</pre>`,
      });

      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: "sent", sentAt: new Date() },
      });

      console.log(`📧 [RESEND] Sent to ${opts.recipient} — "${opts.subject}"`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      await prisma.notification.update({
        where: { id: notification.id },
        data: { status: "failed", errorMessage: msg, retryCount: 1 },
      });
      console.error(`❌ [RESEND] Failed to send: ${msg}`);
    }
  } else {
    // 開発フォールバック：コンソールのみ
    await prisma.notification.update({
      where: { id: notification.id },
      data: { status: "sent", sentAt: new Date() },
    });
    console.log(`\n📧 [MOCK EMAIL] ─────────────────────────────`);
    console.log(`  To      : ${opts.recipient}`);
    console.log(`  Subject : ${opts.subject}`);
    console.log(`  Body    :\n${opts.body}`);
    console.log(`────────────────────────────────────────────\n`);
  }

  return notification;
}

// ─── テンプレート関数 ─────────────────────────────────────────────

export async function notifyBookingConfirmed(opts: {
  userId: string;
  bookingId: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  amount: number;
}) {
  const subject = `【予約確定】${opts.serviceName} - ${opts.bookingDate}`;
  const body = `${opts.userName} 様

この度はご予約いただきありがとうございます。
以下の内容で予約を承りました。

━━━━━━━━━━━━━━━━━━━━━━
サービス : ${opts.serviceName}
日時     : ${opts.bookingDate} ${opts.bookingTime}
金額     : ¥${opts.amount.toLocaleString()}
予約ID   : ${opts.bookingId.slice(0, 8).toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━

当日はお気をつけてお越しください。
ご不明な点はお気軽にお問い合わせください。

ReserveFlow サンプル店
`;

  const html = `
<!DOCTYPE html>
<html lang="ja">
<body style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
  <h2 style="color:#6366f1;margin-bottom:8px">📅 予約が確定しました</h2>
  <p>${opts.userName} 様、ご予約ありがとうございます。</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f8f8fb;border-radius:8px;overflow:hidden">
    <tr><td style="padding:12px 16px;color:#666;font-size:14px">サービス</td><td style="padding:12px 16px;font-weight:700">${opts.serviceName}</td></tr>
    <tr style="background:#fff"><td style="padding:12px 16px;color:#666;font-size:14px">日時</td><td style="padding:12px 16px">${opts.bookingDate} ${opts.bookingTime}</td></tr>
    <tr><td style="padding:12px 16px;color:#666;font-size:14px">金額</td><td style="padding:12px 16px;font-weight:700;color:#6366f1">¥${opts.amount.toLocaleString()}</td></tr>
    <tr style="background:#fff"><td style="padding:12px 16px;color:#666;font-size:14px">予約ID</td><td style="padding:12px 16px;font-family:monospace">${opts.bookingId.slice(0, 8).toUpperCase()}</td></tr>
  </table>
  <p style="color:#555;font-size:14px">当日はお気をつけてお越しください。</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="color:#999;font-size:12px">ReserveFlow サンプル店</p>
</body>
</html>`;

  return sendNotification({
    userId: opts.userId,
    bookingId: opts.bookingId,
    type: "booking_confirmation",
    recipient: opts.userEmail,
    subject,
    body,
    html,
  });
}

export async function notifyBookingCancelled(opts: {
  userId: string;
  bookingId: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
  refundAmount: number;
  cancellationFee: number;
}) {
  const subject = `【キャンセル完了】${opts.serviceName} - ${opts.bookingDate}`;
  const body = `${opts.userName} 様

以下の予約をキャンセルしました。

━━━━━━━━━━━━━━━━━━━━━━
サービス         : ${opts.serviceName}
日時             : ${opts.bookingDate} ${opts.bookingTime}
キャンセル料     : ¥${opts.cancellationFee.toLocaleString()}
返金予定額       : ¥${opts.refundAmount.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━

またのご利用をお待ちしております。

ReserveFlow サンプル店
`;

  const html = `
<!DOCTYPE html>
<html lang="ja">
<body style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
  <h2 style="color:#ef4444;margin-bottom:8px">キャンセル完了のお知らせ</h2>
  <p>${opts.userName} 様</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f8f8fb;border-radius:8px;overflow:hidden">
    <tr><td style="padding:12px 16px;color:#666;font-size:14px">サービス</td><td style="padding:12px 16px;font-weight:700">${opts.serviceName}</td></tr>
    <tr style="background:#fff"><td style="padding:12px 16px;color:#666;font-size:14px">日時</td><td style="padding:12px 16px">${opts.bookingDate} ${opts.bookingTime}</td></tr>
    <tr><td style="padding:12px 16px;color:#666;font-size:14px">キャンセル料</td><td style="padding:12px 16px;color:#ef4444;font-weight:700">¥${opts.cancellationFee.toLocaleString()}</td></tr>
    <tr style="background:#fff"><td style="padding:12px 16px;color:#666;font-size:14px">返金予定額</td><td style="padding:12px 16px;font-weight:700">¥${opts.refundAmount.toLocaleString()}</td></tr>
  </table>
  <p style="color:#555;font-size:14px">またのご利用をお待ちしております。</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="color:#999;font-size:12px">ReserveFlow サンプル店</p>
</body>
</html>`;

  return sendNotification({
    userId: opts.userId,
    bookingId: opts.bookingId,
    type: "booking_cancelled",
    recipient: opts.userEmail,
    subject,
    body,
    html,
  });
}

export async function notifyBookingReminder(opts: {
  userId: string;
  bookingId: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  bookingDate: string;
  bookingTime: string;
}) {
  const subject = `【明日のご予約リマインダー】${opts.serviceName}`;
  const body = `${opts.userName} 様

明日のご予約をお知らせします。

━━━━━━━━━━━━━━━━━━━━━━
サービス : ${opts.serviceName}
日時     : ${opts.bookingDate} ${opts.bookingTime}
━━━━━━━━━━━━━━━━━━━━━━

お忘れのないようお願いいたします。

ReserveFlow サンプル店
`;

  const html = `
<!DOCTYPE html>
<html lang="ja">
<body style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a">
  <h2 style="color:#f59e0b;margin-bottom:8px">⏰ 明日のご予約リマインダー</h2>
  <p>${opts.userName} 様、明日のご予約をお知らせします。</p>
  <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f8f8fb;border-radius:8px;overflow:hidden">
    <tr><td style="padding:12px 16px;color:#666;font-size:14px">サービス</td><td style="padding:12px 16px;font-weight:700">${opts.serviceName}</td></tr>
    <tr style="background:#fff"><td style="padding:12px 16px;color:#666;font-size:14px">日時</td><td style="padding:12px 16px">${opts.bookingDate} ${opts.bookingTime}</td></tr>
  </table>
  <p style="color:#555;font-size:14px">お忘れのないようお願いいたします。</p>
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0">
  <p style="color:#999;font-size:12px">ReserveFlow サンプル店</p>
</body>
</html>`;

  return sendNotification({
    userId: opts.userId,
    bookingId: opts.bookingId,
    type: "booking_reminder",
    recipient: opts.userEmail,
    subject,
    body,
    html,
  });
}
