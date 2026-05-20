"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { formatPrice } from "@/lib/utils";

type Booking = {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  amount: number;
  user: { name: string; email: string };
  service: { name: string };
};

const STATUS_LABEL: Record<string, string> = {
  pending: "支払い待ち", confirmed: "予約確定", completed: "完了",
  cancelled: "キャンセル", no_show: "来店なし",
};

const NAV = [
  { href: "/admin/dashboard", icon: "🏠", label: "ダッシュボード" },
  { href: "/admin/bookings", icon: "📅", label: "予約管理" },
  { href: "/admin/services", icon: "✂️", label: "サービス管理" },
  { href: "/admin/settings", icon: "⚙️", label: "設定" },
];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    fetch("/api/admin/bookings?limit=10")
      .then(r => r.json())
      .then(d => { setBookings(d.data?.bookings ?? []); setLoading(false); });
  }, []);

  const todayBookings = bookings.filter(b => b.bookingDate === today);
  const totalRevenue = bookings.filter(b => b.status === "completed").reduce((s, b) => s + b.amount, 0);
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const pending = bookings.filter(b => b.status === "pending").length;

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link href="/admin/dashboard" className="sidebar-logo">
          <span>📅</span> ReserveFlow
        </Link>
        <div className="sidebar-section-title">メニュー</div>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className="sidebar-item">
            <span>{n.icon}</span> {n.label}
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => signOut({ callbackUrl: "/" })} className="sidebar-item" style={{ marginBottom: 16 }}>
          <span>🚪</span> ログアウト
        </button>
      </aside>

      {/* Main */}
      <main className="admin-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>ダッシュボード</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)" }}>
              {new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
            </p>
          </div>
          <Link href="/admin/bookings" className="btn btn-primary" style={{ minHeight: 40, padding: "8px 20px" }}>
            予約一覧
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: 32 }}>
          {[
            { label: "本日の予約", value: todayBookings.length, icon: "📅" },
            { label: "確定済み予約", value: confirmed, icon: "✅" },
            { label: "支払い待ち", value: pending, icon: "⏳" },
            { label: "総売上（最新10件）", value: formatPrice(totalRevenue), icon: "💰", small: true },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div className="stat-label">{s.label}</div>
                <span style={{ fontSize: "1.5rem" }}>{s.icon}</span>
              </div>
              <div className={s.small ? "" : "stat-value"} style={s.small ? { fontSize: "1.5rem", fontWeight: 700, marginTop: 4 } : {}}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Recent bookings */}
        <div className="card">
          <div className="card-header" style={{ display: "flex", justifyContent: "space-between" }}>
            <span>最新の予約</span>
            <Link href="/admin/bookings" className="btn btn-text" style={{ fontSize: "0.875rem" }}>すべて見る →</Link>
          </div>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div className="spinner" /></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>顧客名</th>
                    <th>サービス</th>
                    <th>日時</th>
                    <th>金額</th>
                    <th>ステータス</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.user.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>{b.user.email}</div>
                      </td>
                      <td>{b.service.name}</td>
                      <td style={{ fontSize: "0.875rem" }}>
                        {b.bookingDate} {b.bookingTime}
                      </td>
                      <td style={{ fontWeight: 700 }}>{formatPrice(b.amount)}</td>
                      <td><span className={`badge badge-${b.status}`}>{STATUS_LABEL[b.status]}</span></td>
                      <td>
                        <Link href={`/admin/bookings/${b.id}`} className="btn btn-ghost"
                          style={{ minHeight: 28, padding: "2px 10px", fontSize: "0.75rem" }}>
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: "center", padding: 32, color: "var(--color-gray-400)" }}>予約データがありません</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
