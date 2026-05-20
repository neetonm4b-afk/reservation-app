"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";

type Booking = {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  amount: number;
  cancellationFee: number;
  refundAmount: number | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  customerNotes: string | null;
  createdAt: string;
  service: { name: string; durationMinutes: number; description: string | null; price: number };
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:   { label: "支払い待ち", color: "#f59e0b" },
  confirmed: { label: "予約確定",   color: "#10b981" },
  completed: { label: "完了",       color: "#6366f1" },
  cancelled: { label: "キャンセル", color: "#ef4444" },
  no_show:   { label: "来店なし",   color: "#6b7280" },
};

export default function BookingDetailPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [error, setError] = useState("");
  const [cancelResult, setCancelResult] = useState<{ cancellationFee: number; refundAmount: number } | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch(`/api/bookings/${bookingId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setBooking(d.data);
        else setError("予約が見つかりません");
        setLoading(false);
      })
      .catch(() => { setError("読み込みに失敗しました"); setLoading(false); });
  }, [bookingId, session?.user?.id]);

  const handleCancel = async () => {
    setCancelling(true);
    setError("");
    try {
      const res = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: cancelReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCancelResult(data.data);
      setShowCancelModal(false);
      // 予約情報を更新
      setBooking(prev => prev ? { ...prev, status: "cancelled", cancelledAt: new Date().toISOString(), cancellationReason: cancelReason, cancellationFee: data.data.cancellationFee, refundAmount: data.data.refundAmount } : prev);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "キャンセルに失敗しました");
    }
    setCancelling(false);
  };

  const canCancel = booking && ["pending", "confirmed"].includes(booking.status);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="spinner" />
    </div>
  );

  if (!booking) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: "3rem" }}>🔍</div>
      <p style={{ color: "var(--color-gray-500)" }}>{error || "予約が見つかりません"}</p>
      <Link href="/dashboard" className="btn btn-primary">ダッシュボードへ</Link>
    </div>
  );

  const status = STATUS_LABEL[booking.status] ?? { label: booking.status, color: "#6b7280" };
  const bookingDt = new Date(`${booking.bookingDate}T${booking.bookingTime}`);
  const isPast = bookingDt < new Date();

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-50)" }}>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/dashboard" className="site-logo">← ダッシュボード</Link>
          <h1 style={{ fontSize: "1rem", fontWeight: 700 }}>予約詳細</h1>
          <div style={{ width: 120 }} />
        </div>
      </header>

      <main className="container" style={{ maxWidth: 640, paddingTop: 32, paddingBottom: 64 }}>
        {/* キャンセル完了バナー */}
        {cancelResult && (
          <div className="alert alert-info" style={{ marginBottom: 24 }}>
            ✅ キャンセルが完了しました。返金予定額: {formatPrice(cancelResult.refundAmount)}
          </div>
        )}
        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        {/* ステータスカード */}
        <div className="card card-body" style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-gray-400)", marginBottom: 4 }}>予約ID</div>
            <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1.125rem" }}>
              {booking.id.slice(0, 8).toUpperCase()}
            </div>
          </div>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 999, fontSize: "0.875rem", fontWeight: 700,
            background: `${status.color}18`, color: status.color,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: status.color, display: "inline-block" }} />
            {status.label}
          </span>
        </div>

        {/* サービス情報 */}
        <div className="card card-body" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: 16, color: "var(--color-gray-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>予約内容</h2>
          {[
            { label: "サービス",  value: booking.service.name },
            { label: "日付",      value: formatDate(booking.bookingDate) },
            { label: "時間",      value: `${booking.bookingTime}（${booking.service.durationMinutes}分）` },
            { label: "料金",      value: formatPrice(booking.amount), bold: true },
          ].map(row => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--color-gray-100)" }}>
              <span style={{ color: "var(--color-gray-500)", fontSize: "0.875rem" }}>{row.label}</span>
              <span style={{ fontWeight: row.bold ? 700 : 500, color: row.bold ? "var(--color-primary)" : undefined }}>{row.value}</span>
            </div>
          ))}
          {booking.customerNotes && (
            <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--color-gray-50)", borderRadius: 8, fontSize: "0.875rem", color: "var(--color-gray-600)" }}>
              📝 {booking.customerNotes}
            </div>
          )}
        </div>

        {/* キャンセル情報 */}
        {booking.status === "cancelled" && (
          <div className="card card-body" style={{ marginBottom: 20, borderLeft: "4px solid #ef4444" }}>
            <h2 style={{ fontSize: "0.75rem", fontWeight: 700, marginBottom: 12, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.05em" }}>キャンセル情報</h2>
            {[
              { label: "キャンセル日時", value: booking.cancelledAt ? new Date(booking.cancelledAt).toLocaleString("ja-JP") : "-" },
              { label: "キャンセル料", value: formatPrice(booking.cancellationFee) },
              { label: "返金予定額", value: formatPrice(booking.refundAmount ?? 0) },
              ...(booking.cancellationReason ? [{ label: "理由", value: booking.cancellationReason }] : []),
            ].map(row => (
              <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--color-gray-100)" }}>
                <span style={{ color: "var(--color-gray-500)", fontSize: "0.875rem" }}>{row.label}</span>
                <span style={{ fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* アクション */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/dashboard" className="btn btn-ghost" style={{ flex: 1, textAlign: "center" }}>
            ← ダッシュボード
          </Link>
          {canCancel && !isPast && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="btn"
              style={{ flex: 1, background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", fontWeight: 700 }}
            >
              予約をキャンセル
            </button>
          )}
          {booking.status === "confirmed" && !isPast && (
            <Link href="/booking" className="btn btn-primary" style={{ flex: 1, textAlign: "center" }}>
              別の予約を追加
            </Link>
          )}
        </div>
      </main>

      {/* キャンセル確認モーダル */}
      {showCancelModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 16,
        }}>
          <div className="card card-body" style={{ maxWidth: 480, width: "100%" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }}>予約をキャンセルしますか？</h2>
            <p style={{ color: "var(--color-gray-500)", fontSize: "0.875rem", marginBottom: 20 }}>
              キャンセルポリシーに基づきキャンセル料が発生する場合があります。
            </p>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" htmlFor="cancel-reason">キャンセル理由（任意）</label>
              <textarea
                id="cancel-reason"
                className="form-textarea"
                rows={3}
                placeholder="理由があればご記入ください"
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowCancelModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>
                戻る
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="btn"
                style={{ flex: 1, background: "#ef4444", color: "#fff", fontWeight: 700 }}
              >
                {cancelling ? "処理中..." : "キャンセルする"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
