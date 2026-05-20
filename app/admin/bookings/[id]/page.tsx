"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { formatPrice } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────────────── */
type BookingDetail = {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  amount: number;
  cancellationReason: string | null;
  cancelledAt: string | null;
  customerNotes: string | null;
  staffNotes: string | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string | null;
  };
  service: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    category: string | null;
  };
  staff: {
    id: string;
    name: string;
  } | null;
};

/* ── Constants ──────────────────────────────────────────────────────────────── */
const STATUS_LABEL: Record<string, string> = {
  pending:   "支払い待ち",
  confirmed: "予約確定",
  completed: "完了",
  cancelled: "キャンセル",
  no_show:   "来店なし",
};

const STATUS_ICON: Record<string, string> = {
  pending:   "⏳",
  confirmed: "✅",
  completed: "🏁",
  cancelled: "❌",
  no_show:   "🚫",
};

const PAYMENT_LABEL: Record<string, string> = {
  pending:   "未払い",
  succeeded: "支払い完了",
  failed:    "支払い失敗",
  refunded:  "返金済み",
};

const NAV = [
  { href: "/admin/dashboard", icon: "🏠", label: "ダッシュボード" },
  { href: "/admin/bookings",  icon: "📅", label: "予約管理" },
  { href: "/admin/services",  icon: "✂️", label: "サービス管理" },
  { href: "/admin/settings",  icon: "⚙️", label: "設定" },
];

/* ── Toast helper ───────────────────────────────────────────────────────────── */
type Toast = { id: number; type: "success" | "error" | "info"; message: string };

/* ── Page Component ─────────────────────────────────────────────────────────── */
export default function BookingDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const id      = params.id as string;

  const [booking,      setBooking]      = useState<BookingDetail | null>(null);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [toggling,     setToggling]     = useState(false);
  const [staffNotes,   setStaffNotes]   = useState("");
  const [toasts,       setToasts]       = useState<Toast[]>([]);
  const [toastCounter, setToastCounter] = useState(0);

  /* Toast */
  const addToast = useCallback((type: Toast["type"], message: string) => {
    const newId = toastCounter + 1;
    setToastCounter(newId);
    setToasts(prev => [...prev, { id: newId, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== newId)), 3500);
  }, [toastCounter]);

  /* Fetch booking */
  const loadBooking = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`/api/admin/bookings/${id}`);
      const data = await res.json();
      if (data.success) {
        setBooking(data.data);
        setStaffNotes(data.data.staffNotes ?? "");
      } else {
        addToast("error", data.error ?? "予約の取得に失敗しました");
      }
    } catch {
      addToast("error", "通信エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [id, addToast]);

  useEffect(() => { loadBooking(); }, [loadBooking]);

  /* Toggle confirmed ↔ cancelled */
  const handleToggleStatus = async () => {
    if (!booking) return;
    const nextStatus = booking.status === "confirmed" ? "cancelled" : "confirmed";
    setToggling(true);
    try {
      const res  = await fetch(`/api/admin/bookings/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBooking(prev => prev ? { ...prev, status: nextStatus } : prev);
        addToast("success", `ステータスを「${STATUS_LABEL[nextStatus]}」に変更しました`);
      } else {
        addToast("error", data.error ?? "ステータス変更に失敗しました");
      }
    } catch {
      addToast("error", "通信エラーが発生しました");
    } finally {
      setToggling(false);
    }
  };

  /* Save staff notes */
  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`/api/admin/bookings/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ staffNotes }),
      });
      const data = await res.json();
      if (data.success) {
        addToast("success", "管理者メモを保存しました");
      } else {
        addToast("error", data.error ?? "保存に失敗しました");
      }
    } catch {
      addToast("error", "通信エラーが発生しました");
    } finally {
      setSaving(false);
    }
  };

  /* ── Skeleton while loading ──────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar activeHref="/admin/bookings" />
        <main className="admin-content">
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div className="skeleton" style={{ width: 80, height: 36, borderRadius: "var(--radius-lg)" }} />
            <div className="skeleton" style={{ width: 220, height: 32 }} />
          </div>
          <div style={{ display: "grid", gap: 20 }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="card">
                <div className="card-body">
                  <div className="skeleton" style={{ width: "60%", height: 20, marginBottom: 12 }} />
                  <div className="skeleton" style={{ width: "40%", height: 16 }} />
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="admin-layout">
        <Sidebar activeHref="/admin/bookings" />
        <main className="admin-content">
          <div className="alert alert-error" style={{ marginTop: 40 }}>
            <span>❌</span>
            <span>予約が見つかりませんでした。</span>
          </div>
          <button onClick={() => router.back()} className="btn btn-ghost" style={{ marginTop: 16 }}>
            ← 戻る
          </button>
        </main>
      </div>
    );
  }

  const isCancelled = booking.status === "cancelled";
  const isConfirmed = booking.status === "confirmed";
  const canToggle   = booking.status === "confirmed" || booking.status === "cancelled";

  /* ── Render ─────────────────────────────────────────────────────────────── */
  return (
    <div className="admin-layout">
      <Sidebar activeHref="/admin/bookings" />

      <main className="admin-content">
        {/* Page header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <button
            id="back-button"
            onClick={() => router.back()}
            className="btn btn-ghost"
            style={{ minHeight: 36, padding: "0 14px", fontSize: "0.875rem", gap: 6 }}
          >
            ← 戻る
          </button>
          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.2 }}>予約詳細</h1>
            <p style={{ fontSize: "0.75rem", color: "var(--color-gray-400)", marginTop: 2 }}>
              ID: <code style={{ fontSize: "0.7rem", background: "var(--color-gray-100)", padding: "1px 6px", borderRadius: 4 }}>{booking.id}</code>
            </p>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span className={`badge badge-${booking.status}`} style={{ height: 28, padding: "0 14px", fontSize: "0.8rem" }}>
              {STATUS_ICON[booking.status]} {STATUS_LABEL[booking.status]}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>
          {/* ── Left column ───────────────────────────────────────────────── */}
          <div style={{ display: "grid", gap: 20 }}>

            {/* Customer info */}
            <section className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>👤</span> 顧客情報
              </div>
              <div className="card-body">
                <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px 16px", fontSize: "0.9rem" }}>
                  <dt style={dtStyle}>顧客名</dt>
                  <dd style={{ fontWeight: 600 }}>{booking.user.name}</dd>

                  <dt style={dtStyle}>メールアドレス</dt>
                  <dd>
                    <a href={`mailto:${booking.user.email}`} style={{ color: "var(--color-primary)", textDecoration: "none" }}>
                      {booking.user.email}
                    </a>
                  </dd>

                  <dt style={dtStyle}>電話番号</dt>
                  <dd>{booking.user.phoneNumber ?? <span style={{ color: "var(--color-gray-400)" }}>未登録</span>}</dd>

                  <dt style={dtStyle}>ユーザーID</dt>
                  <dd style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>{booking.user.id}</dd>
                </dl>
              </div>
            </section>

            {/* Service info */}
            <section className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>✂️</span> サービス情報
              </div>
              <div className="card-body">
                <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px 16px", fontSize: "0.9rem" }}>
                  <dt style={dtStyle}>サービス名</dt>
                  <dd style={{ fontWeight: 600 }}>{booking.service.name}</dd>

                  {booking.service.category && (
                    <>
                      <dt style={dtStyle}>カテゴリー</dt>
                      <dd>{booking.service.category}</dd>
                    </>
                  )}

                  <dt style={dtStyle}>料金</dt>
                  <dd style={{ fontWeight: 700, color: "var(--color-primary)", fontSize: "1.05rem" }}>
                    {formatPrice(booking.amount)}
                  </dd>

                  <dt style={dtStyle}>予約日時</dt>
                  <dd>
                    <span style={{ fontWeight: 600 }}>{booking.bookingDate}</span>
                    <span style={{ marginLeft: 8, color: "var(--color-gray-600)" }}>{booking.bookingTime}</span>
                  </dd>

                  <dt style={dtStyle}>所要時間</dt>
                  <dd>{booking.service.durationMinutes} 分</dd>

                  {booking.staff && (
                    <>
                      <dt style={dtStyle}>担当スタッフ</dt>
                      <dd>{booking.staff.name}</dd>
                    </>
                  )}

                  <dt style={dtStyle}>お支払い状況</dt>
                  <dd>
                    <span className={`badge badge-${booking.paymentStatus === "succeeded" ? "confirmed" : booking.paymentStatus === "failed" ? "cancelled" : "pending"}`}>
                      {PAYMENT_LABEL[booking.paymentStatus] ?? booking.paymentStatus}
                    </span>
                  </dd>
                </dl>

                {booking.customerNotes && (
                  <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--color-gray-50)", borderRadius: "var(--radius-lg)", borderLeft: "3px solid var(--color-gray-300)" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-gray-500)", marginBottom: 4 }}>顧客メモ</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-gray-700)" }}>{booking.customerNotes}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Cancellation reason (only when cancelled) */}
            {isCancelled && (
              <section className="card" style={{ border: "1px solid #FECACA" }}>
                <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--color-error-light)", color: "#DC2626" }}>
                  <span>❌</span> キャンセル情報
                </div>
                <div className="card-body">
                  <dl style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "10px 16px", fontSize: "0.9rem" }}>
                    <dt style={dtStyle}>キャンセル日時</dt>
                    <dd>
                      {booking.cancelledAt
                        ? new Date(booking.cancelledAt).toLocaleString("ja-JP")
                        : <span style={{ color: "var(--color-gray-400)" }}>—</span>}
                    </dd>

                    <dt style={dtStyle}>キャンセル理由</dt>
                    <dd>
                      {booking.cancellationReason
                        ? <span style={{ color: "var(--color-error)" }}>{booking.cancellationReason}</span>
                        : <span style={{ color: "var(--color-gray-400)" }}>理由未記載</span>}
                    </dd>
                  </dl>
                </div>
              </section>
            )}

            {/* Admin notes */}
            <section className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>📝</span> 管理者メモ
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <textarea
                  id="staff-notes"
                  className="form-textarea"
                  rows={5}
                  placeholder="管理者メモを入力してください（顧客には表示されません）"
                  value={staffNotes}
                  onChange={e => setStaffNotes(e.target.value)}
                  style={{ resize: "vertical" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    id="save-notes-button"
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ minHeight: 40, padding: "0 24px", fontSize: "0.875rem" }}
                  >
                    {saving ? "保存中…" : "💾 保存"}
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* ── Right column ──────────────────────────────────────────────── */}
          <div style={{ display: "grid", gap: 20 }}>

            {/* Status card */}
            <section className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>🔄</span> ステータス管理
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Current status display */}
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "20px 16px",
                  borderRadius: "var(--radius-lg)",
                  background: getStatusBg(booking.status),
                }}>
                  <span style={{ fontSize: "2rem" }}>{STATUS_ICON[booking.status]}</span>
                  <span style={{ fontWeight: 700, fontSize: "1.1rem", color: getStatusColor(booking.status) }}>
                    {STATUS_LABEL[booking.status]}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--color-gray-400)" }}>現在のステータス</span>
                </div>

                {/* Toggle button */}
                {canToggle && (
                  <button
                    id="toggle-status-button"
                    onClick={handleToggleStatus}
                    disabled={toggling}
                    className={isConfirmed ? "btn btn-danger" : "btn btn-primary"}
                    style={{ width: "100%", minHeight: 44, fontSize: "0.9rem" }}
                  >
                    {toggling
                      ? "変更中…"
                      : isConfirmed
                        ? "❌ キャンセルに変更"
                        : "✅ 予約確定に変更"}
                  </button>
                )}

                {!canToggle && (
                  <p style={{ fontSize: "0.75rem", color: "var(--color-gray-400)", textAlign: "center" }}>
                    このステータスは変更できません
                  </p>
                )}
              </div>
            </section>

            {/* Booking meta */}
            <section className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>ℹ️</span> 予約情報
              </div>
              <div className="card-body">
                <dl style={{ display: "grid", gap: "10px", fontSize: "0.85rem" }}>
                  <div>
                    <dt style={{ ...dtStyle, marginBottom: 2 }}>作成日時</dt>
                    <dd style={{ color: "var(--color-gray-700)" }}>
                      {new Date(booking.createdAt).toLocaleString("ja-JP")}
                    </dd>
                  </div>
                  <div>
                    <dt style={{ ...dtStyle, marginBottom: 2 }}>最終更新</dt>
                    <dd style={{ color: "var(--color-gray-700)" }}>
                      {new Date(booking.updatedAt).toLocaleString("ja-JP")}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            {/* Quick links */}
            <section className="card">
              <div className="card-header" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span>🔗</span> クイックリンク
              </div>
              <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  href="/admin/bookings"
                  className="btn btn-ghost"
                  style={{ width: "100%", minHeight: 40, fontSize: "0.875rem", justifyContent: "flex-start", paddingLeft: 14 }}
                >
                  📅 予約一覧に戻る
                </Link>
                <Link
                  href="/admin/dashboard"
                  className="btn btn-ghost"
                  style={{ width: "100%", minHeight: 40, fontSize: "0.875rem", justifyContent: "flex-start", paddingLeft: 14 }}
                >
                  🏠 ダッシュボード
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Toast container */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────────────── */
function Sidebar({ activeHref }: { activeHref: string }) {
  return (
    <aside className="admin-sidebar">
      <Link href="/admin/dashboard" className="sidebar-logo">
        <span>📅</span> ReserveFlow
      </Link>
      <div className="sidebar-section-title">メニュー</div>
      {NAV.map(n => (
        <Link key={n.href} href={n.href} className={`sidebar-item ${n.href === activeHref ? "active" : ""}`}>
          <span>{n.icon}</span> {n.label}
        </Link>
      ))}
      <div style={{ flex: 1 }} />
      <button onClick={() => signOut({ callbackUrl: "/" })} className="sidebar-item" style={{ marginBottom: 16 }}>
        <span>🚪</span> ログアウト
      </button>
    </aside>
  );
}

/* ── Style helpers ──────────────────────────────────────────────────────────── */
const dtStyle: React.CSSProperties = {
  color: "var(--color-gray-500)",
  fontSize: "0.8rem",
  fontWeight: 500,
  alignSelf: "center",
};

function getStatusBg(status: string): string {
  const map: Record<string, string> = {
    pending:   "var(--color-warning-light)",
    confirmed: "var(--color-primary-light)",
    completed: "var(--color-success-light)",
    cancelled: "var(--color-error-light)",
    no_show:   "var(--color-gray-100)",
  };
  return map[status] ?? "var(--color-gray-100)";
}

function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    pending:   "#B45309",
    confirmed: "#1D4ED8",
    completed: "#166534",
    cancelled: "#DC2626",
    no_show:   "var(--color-gray-600)",
  };
  return map[status] ?? "var(--color-gray-800)";
}
