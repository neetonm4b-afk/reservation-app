"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";

type Booking = {
  id: string;
  bookingDate: string;
  bookingTime: string;
  status: string;
  amount: number;
  service: { name: string; durationMinutes: number };
};

const STATUS_LABEL: Record<string, string> = {
  pending: "支払い待ち", confirmed: "予約確定", completed: "完了",
  cancelled: "キャンセル", no_show: "来店なし",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then(r => r.json())
      .then(d => { setBookings(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const upcoming = bookings.filter(b => ["pending", "confirmed"].includes(b.status));
  const past = bookings.filter(b => ["completed", "cancelled"].includes(b.status));

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-50)" }}>
      {/* Header */}
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/" className="site-logo">📅 ReserveFlow</Link>
          <div className="header-nav">
            <span style={{ fontSize: "0.875rem", color: "var(--color-gray-600)" }}>
              {session?.user?.name} さん
            </span>
            <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-ghost"
              style={{ minHeight: 36, padding: "6px 14px", fontSize: "0.875rem" }}>
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>マイページ</h1>
          <Link href="/booking" className="btn btn-primary">
            ＋ 新規予約
          </Link>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom: 32 }}>
          <div className="stat-card">
            <div className="stat-label">今後の予約</div>
            <div className="stat-value">{upcoming.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">過去の予約</div>
            <div className="stat-value">{past.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">合計利用金額</div>
            <div className="stat-value" style={{ fontSize: "1.5rem" }}>
              {formatPrice(bookings.filter(b => b.status === "completed").reduce((s, b) => s + b.amount, 0))}
            </div>
          </div>
        </div>

        {/* Upcoming bookings */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 16 }}>今後の予約</h2>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><div className="spinner" /></div>
          ) : upcoming.length === 0 ? (
            <div className="card card-body" style={{ textAlign: "center", padding: 40 }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>📅</div>
              <p style={{ color: "var(--color-gray-500)", marginBottom: 16 }}>予約がありません</p>
              <Link href="/booking" className="btn btn-primary">予約する</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {upcoming.map(b => (
                <div key={b.id} className="card card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{b.service.name}</div>
                    <div style={{ fontSize: "0.875rem", color: "var(--color-gray-500)", marginTop: 4 }}>
                      {formatDate(b.bookingDate)} {b.bookingTime} · {b.service.durationMinutes}分
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className={`badge badge-${b.status}`}>{STATUS_LABEL[b.status]}</span>
                    <span style={{ fontWeight: 700 }}>{formatPrice(b.amount)}</span>
                    <Link href={`/bookings/${b.id}`} className="btn btn-ghost" style={{ minHeight: 32, padding: "4px 12px", fontSize: "0.8125rem" }}>
                      詳細
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past bookings */}
        {past.length > 0 && (
          <div>
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 16 }}>過去の予約</h2>
            <div className="card" style={{ overflow: "hidden" }}>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>サービス</th>
                      <th>日時</th>
                      <th>金額</th>
                      <th>ステータス</th>
                    </tr>
                  </thead>
                  <tbody>
                    {past.map(b => (
                      <tr key={b.id}>
                        <td style={{ fontWeight: 500 }}>{b.service.name}</td>
                        <td style={{ color: "var(--color-gray-600)" }}>
                          {formatDate(b.bookingDate)} {b.bookingTime}
                        </td>
                        <td style={{ fontWeight: 700 }}>{formatPrice(b.amount)}</td>
                        <td><span className={`badge badge-${b.status}`}>{STATUS_LABEL[b.status]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
