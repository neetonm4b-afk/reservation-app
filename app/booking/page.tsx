"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";

type Service = { id: string; name: string; description: string | null; price: number; durationMinutes: number; category: string | null; colorTag: string | null };
type Slot = { startTime: string; endTime: string; available: boolean };

const STEP_LABELS = ["サービス選択", "日時選択", "予約確認", "お支払い", "完了"];

export default function BookingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [error, setError] = useState("");

  // Calendar state
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then(d => setServices(d.data ?? []));
  }, []);

  const loadSlots = useCallback(async (svcId: string, date: string) => {
    setSlotsLoading(true);
    const res = await fetch(`/api/bookings/available-slots?serviceId=${svcId}&date=${date}`);
    const data = await res.json();
    setSlots(data.data?.slots ?? []);
    setSlotsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) loadSlots(selectedService.id, selectedDate);
  }, [selectedService, selectedDate, loadSlots]);

  // Calendar helpers
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const monthName = new Date(calYear, calMonth, 1).toLocaleDateString("ja-JP", { year: "numeric", month: "long" });

  const handleBooking = async () => {
    if (!selectedService || !selectedSlot || !session?.user?.id) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          bookingDate: selectedDate,
          bookingTime: selectedSlot.startTime,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBookingId(data.data.bookingId);

      // テストモード：決済をスキップして直接確定
      const confirmRes = await fetch(`/api/bookings/${data.data.bookingId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!confirmRes.ok) throw new Error("確定に失敗しました");
      setStep(5);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-50)" }}>
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/dashboard" className="site-logo">← ダッシュボード</Link>
          <h1 style={{ fontSize: "1rem", fontWeight: 700 }}>新規予約</h1>
          <div style={{ width: 120 }} />
        </div>
      </header>

      <main className="container" style={{ maxWidth: 700, paddingTop: 32, paddingBottom: 64 }}>
        {/* Steps */}
        <div className="steps" style={{ marginBottom: 32 }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={`step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
              <div className="step-circle">{step > i + 1 ? "✓" : i + 1}</div>
              <div className="step-label">{label}</div>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        {/* Step 1: Service */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 20 }}>サービスを選択してください</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {services.map(s => (
                <button key={s.id} onClick={() => { setSelectedService(s); setStep(2); }}
                  style={{
                    all: "unset", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "20px 24px", background: "#fff", border: `2px solid ${selectedService?.id === s.id ? "var(--color-primary)" : "var(--color-gray-200)"}`,
                    borderRadius: "var(--radius-xl)", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--color-primary)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = selectedService?.id === s.id ? "var(--color-primary)" : "var(--color-gray-200)")}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.name}</div>
                    {s.description && <div style={{ fontSize: "0.875rem", color: "var(--color-gray-500)" }}>{s.description}</div>}
                    <div style={{ fontSize: "0.875rem", color: "var(--color-gray-500)", marginTop: 4 }}>⏱ {s.durationMinutes}分</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "1.25rem", color: "var(--color-primary)" }}>{formatPrice(s.price)}</div>
                </button>
              ))}
              {services.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "var(--color-gray-500)" }}>
                  <div className="spinner" style={{ margin: "0 auto" }} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && selectedService && (
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 20 }}>日時を選択してください</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Calendar */}
              <div className="calendar">
                <div className="calendar-header">
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                    className="btn btn-ghost" style={{ minHeight: 32, padding: "4px 10px" }}>‹</button>
                  <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>{monthName}</span>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                    className="btn btn-ghost" style={{ minHeight: 32, padding: "4px 10px" }}>›</button>
                </div>
                <div className="calendar-grid">
                  {["日", "月", "火", "水", "木", "金", "土"].map(d => (
                    <div key={d} className="calendar-day-header">{d}</div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isPast = new Date(dateStr) < new Date(today.toISOString().slice(0, 10));
                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === today.toISOString().slice(0, 10);
                    return (
                      <button key={day} disabled={isPast}
                        className={`calendar-day ${isSelected ? "selected" : ""} ${isToday && !isSelected ? "today" : ""}`}
                        onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <div style={{ fontWeight: 700, marginBottom: 12, fontSize: "0.875rem" }}>
                  {selectedDate ? formatDate(selectedDate) : "日付を選択してください"}
                </div>
                {!selectedDate ? (
                  <div style={{ color: "var(--color-gray-400)", fontSize: "0.875rem", textAlign: "center", marginTop: 32 }}>
                    カレンダーから日付を選択
                  </div>
                ) : slotsLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}><div className="spinner" /></div>
                ) : slots.length === 0 ? (
                  <div style={{ color: "var(--color-gray-500)", fontSize: "0.875rem", textAlign: "center", marginTop: 32 }}>
                    この日は予約できません
                  </div>
                ) : (
                  <div className="time-slots" style={{ maxHeight: 300, overflowY: "auto" }}>
                    {slots.filter(s => s.available).map(s => (
                      <button key={s.startTime} onClick={() => setSelectedSlot(s)}
                        className={`time-slot ${selectedSlot?.startTime === s.startTime ? "selected" : ""}`}
                        style={{ all: "unset", width: "100%", boxSizing: "border-box" }}
                        data-start={s.startTime}>
                        <div className="time-slot" style={{ cursor: "pointer", border: `1.5px solid ${selectedSlot?.startTime === s.startTime ? "var(--color-primary)" : "var(--color-gray-200)"}`, background: selectedSlot?.startTime === s.startTime ? "var(--color-primary)" : "#fff", color: selectedSlot?.startTime === s.startTime ? "#fff" : "var(--color-gray-800)" }}>
                          <span className="time-slot-time">{s.startTime} 〜 {s.endTime}</span>
                          <span className="time-slot-capacity">空きあり</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button onClick={() => setStep(1)} className="btn btn-ghost">← 戻る</button>
              <button onClick={() => setStep(3)} className="btn btn-primary"
                disabled={!selectedDate || !selectedSlot} style={{ flex: 1 }}>
                確認へ進む →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedService && selectedSlot && (
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 20 }}>予約内容の確認</h2>
            <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 20 }}>
              {[
                { label: "サービス", value: selectedService.name },
                { label: "日付", value: formatDate(selectedDate) },
                { label: "時間", value: `${selectedSlot.startTime} 〜 ${selectedSlot.endTime} (${selectedService.durationMinutes}分)` },
                { label: "料金", value: formatPrice(selectedService.price), bold: true },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-gray-500)", fontSize: "0.875rem" }}>{row.label}</span>
                  <span style={{ fontWeight: row.bold ? 700 : 500 }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" htmlFor="notes">メモ（任意）</label>
              <textarea id="notes" className="form-textarea" rows={3} placeholder="ご要望があればご記入ください"
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(2)} className="btn btn-ghost">← 戻る</button>
              <button onClick={() => setStep(4)} className="btn btn-primary" style={{ flex: 1 }}>
                お支払いへ進む →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment (test mode) */}
        {step === 4 && selectedService && selectedSlot && (
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 20 }}>お支払い</h2>
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              🧪 <strong>テストモード：</strong>実際の決済は発生しません。「予約を確定する」ボタンで完了します。
            </div>
            <div className="card card-body" style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "var(--color-gray-500)" }}>{selectedService.name}</span>
                <span>{formatPrice(selectedService.price)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid var(--color-gray-200)", paddingTop: 12 }}>
                <span>合計</span>
                <span style={{ color: "var(--color-primary)" }}>{formatPrice(selectedService.price)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setStep(3)} className="btn btn-ghost">← 戻る</button>
              <button onClick={handleBooking} className="btn btn-primary" disabled={loading} style={{ flex: 1 }}>
                {loading ? "処理中..." : `${formatPrice(selectedService.price)} を支払って予約確定`}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 5 && (
          <div className="card card-body" style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 8 }}>予約が確定しました！</h2>
            <p style={{ color: "var(--color-gray-500)", marginBottom: 8 }}>
              確認メールをお送りしました。当日お待ちしております。
            </p>
            {bookingId && (
              <p style={{ fontSize: "0.875rem", color: "var(--color-gray-400)", marginBottom: 32 }}>
                予約ID: {bookingId.slice(0, 8).toUpperCase()}
              </p>
            )}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/dashboard" className="btn btn-primary">ダッシュボードへ</Link>
              {bookingId && <Link href={`/bookings/${bookingId}`} className="btn btn-ghost">予約詳細を見る</Link>}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
