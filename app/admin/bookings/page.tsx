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

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [total, setTotal] = useState(0);

  const loadBookings = async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter) params.set("status", statusFilter);
    if (dateFilter) params.set("date", dateFilter);
    const res = await fetch(`/api/admin/bookings?${params}`);
    const data = await res.json();
    setBookings(data.data?.bookings ?? []);
    setTotal(data.data?.pagination?.total ?? 0);
    setLoading(false);
  };

  useEffect(() => { loadBookings(); }, [statusFilter, dateFilter]);

  const handleStatusChange = async (bookingId: string, status: string) => {
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    loadBookings();
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link href="/admin/dashboard" className="sidebar-logo"><span>📅</span> ReserveFlow</Link>
        <div className="sidebar-section-title">メニュー</div>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className={`sidebar-item ${n.href === "/admin/bookings" ? "active" : ""}`}>
            <span>{n.icon}</span> {n.label}
          </Link>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => signOut({ callbackUrl: "/" })} className="sidebar-item" style={{ marginBottom: 16 }}>
          <span>🚪</span> ログアウト
        </button>
      </aside>

      <main className="admin-content">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>予約管理</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)" }}>全 {total} 件</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <select className="form-select" style={{ width: 180, height: 40, padding: "0 12px" }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">すべてのステータス</option>
            {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <input type="date" className="form-input" style={{ width: 180, height: 40 }}
            value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
          {(statusFilter || dateFilter) && (
            <button onClick={() => { setStatusFilter(""); setDateFilter(""); }} className="btn btn-ghost"
              style={{ minHeight: 40, padding: "0 16px", fontSize: "0.875rem" }}>
              リセット
            </button>
          )}
        </div>

        <div className="card">
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>顧客</th>
                    <th>サービス</th>
                    <th>日時</th>
                    <th>金額</th>
                    <th>ステータス</th>
                    <th>変更</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div style={{ fontWeight: 500 }}>{b.user.name}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-gray-400)" }}>{b.user.email}</div>
                      </td>
                      <td>{b.service.name}</td>
                      <td style={{ fontSize: "0.875rem" }}>{b.bookingDate}<br />{b.bookingTime}</td>
                      <td style={{ fontWeight: 700 }}>{formatPrice(b.amount)}</td>
                      <td><span className={`badge badge-${b.status}`}>{STATUS_LABEL[b.status]}</span></td>
                      <td>
                        <select style={{ fontSize: "0.75rem", padding: "4px 8px", border: "1px solid var(--color-gray-200)", borderRadius: 4, cursor: "pointer" }}
                          value={b.status} onChange={e => handleStatusChange(b.id, e.target.value)}>
                          {Object.entries(STATUS_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                      </td>
                      <td>
                        <Link href={`/admin/bookings/${b.id}`} className="btn btn-ghost"
                          style={{ minHeight: 28, padding: "2px 10px", fontSize: "0.75rem" }}>
                          詳細
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--color-gray-400)" }}>
                      予約が見つかりません
                    </td></tr>
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
