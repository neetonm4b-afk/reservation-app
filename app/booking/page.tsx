"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "pk_test_your-stripe-public-key");

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
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

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

      if (data.data.clientSecret) {
        setClientSecret(data.data.clientSecret);
        setStep(4);
      } else {
        const confirmRes = await fetch(`/api/bookings/${data.data.bookingId}/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!confirmRes.ok) throw new Error("確定に失敗しました");
        setStep(5);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-white)" }}>
      <header className="site-header" style={{ background: "var(--color-white)", borderBottom: "1px solid var(--color-gray-light)", position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}>
        <div className="container site-header-inner" style={{ padding: "var(--spacing-4)", display: "flex", alignItems: "center", gap: "var(--spacing-6)" }}>
          <div style={{ width: 24, height: 24, fontSize: "1.5rem" }}>🏥</div>
          <h1 style={{ fontSize: "var(--font-size-base)", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>予約</h1>
        </div>
      </header>

      <main className="container" style={{ maxWidth: 700, paddingTop: 100, paddingBottom: 64 }}>
        <div className="steps" style={{ marginBottom: 32 }}>
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={`step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`} style={{ textAlign: "center" }}>
              <div className="step-circle" style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, border: "2px solid var(--color-gray-light)", margin: "0 auto var(--spacing-2)" }}>
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <div className="step-label">{label}</div>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-family-primary)", marginBottom: "var(--spacing-8)" }}>
              ご希望のサービスをお選びください
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)" }}>
              {services.map(s => (
                <button key={s.id} onClick={() => { setSelectedService(s); setStep(2); }}
                  style={{
                    all: "unset", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "var(--spacing-6)", background: selectedService?.id === s.id ? "rgba(255, 184, 140, 0.05)" : "var(--color-white)", 
                    border: `2px solid ${selectedService?.id === s.id ? "var(--color-primary-orange)" : "var(--color-gray-light)"}`,
                    borderRadius: "var(--radius-lg)", transition: "all 300ms ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary-orange)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 184, 140, 0.2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = selectedService?.id === s.id ? "var(--color-primary-orange)" : "var(--color-gray-light)"; e.currentTarget.style.boxShadow = "none"; }}>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--color-text-primary)", fontFamily: "var(--font-family-primary)", fontSize: "var(--font-size-base)" }}>{s.name}</div>
                    {s.description && <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-gray-dark)", fontFamily: "var(--font-family-primary)" }}>{s.description}</div>}
                    <div style={{ fontSize: "var(--font-size-sm)", color: "var(--color-gray-dark)", marginTop: 4, fontFamily: "var(--font-family-primary)" }}>⏱ {s.durationMinutes}分</div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "var(--font-size-lg)", color: "var(--color-primary-orange)", fontFamily: "var(--font-family-primary)" }}>{formatPrice(s.price)}</div>
                </button>
              ))}
              {services.length === 0 && (
                <div style={{ textAlign: "center", padding: 40, color: "var(--color-gray-light)" }}>
                  <div className="spinner" style={{ margin: "0 auto" }} />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && selectedService && (
          <div>
            <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-family-primary)", marginBottom: "var(--spacing-8)" }}>
              日時をお選びください
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--spacing-6)" }}>
              <div className="calendar">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--spacing-4)" }}>
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                    className="btn-ghost" style={{ minHeight: 32, padding: "4px 10px" }}>‹</button>
                  <span style={{ fontWeight: 700, fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", fontFamily: "var(--font-family-primary)" }}>{monthName}</span>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                    className="btn-ghost" style={{ minHeight: 32, padding: "4px 10px" }}>›</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "var(--spacing-2)" }}>
                  {["日", "月", "火", "水", "木", "金", "土"].map(d => (
                    <div key={d} style={{ textAlign: "center", fontWeight: 600, fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", fontFamily: "var(--font-family-primary)" }}>{d}</div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const isPast = new Date(dateStr) < new Date(today.toISOString().slice(0, 10));
                    const isSelected = selectedDate === dateStr;
                    return (
                      <button key={day} disabled={isPast}
                        onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
                        style={{
                          all: "unset", cursor: isPast ? "not-allowed" : "pointer",
                          padding: "var(--spacing-2)", textAlign: "center", borderRadius: "var(--radius-md)",
                          backgroundColor: isSelected ? "var(--color-primary-orange)" : "var(--color-white)",
                          color: isSelected ? "var(--color-white)" : isPast ? "var(--color-gray-light)" : "var(--color-text-primary)",
                          border: `1px solid ${isSelected ? "var(--color-primary-orange)" : "var(--color-gray-light)"}`,
                          fontWeight: 600, fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family-primary)",
                          transition: "all 300ms ease", opacity: isPast ? 0.5 : 1,
                        }}
                        onMouseEnter={e => { if (!isPast) e.currentTarget.style.backgroundColor = "var(--color-background-secondary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = isSelected ? "var(--color-primary-orange)" : "var(--color-white)"; }}>
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, marginBottom: "var(--spacing-3)", fontSize: "var(--font-size-sm)", color: "var(--color-text-primary)", fontFamily: "var(--font-family-primary)" }}>
                  {selectedDate ? formatDate(selectedDate) : "日付を選択してください"}
                </div>
                {!selectedDate ? (
                  <div style={{ color: "var(--color-gray-light)", fontSize: "var(--font-size-sm)", textAlign: "center", marginTop: 32, fontFamily: "var(--font-family-primary)" }}>
                    カレンダーから日付を選択
                  </div>
                ) : slotsLoading ? (
                  <div style={{ display: "flex", justifyContent: "center", marginTop: 32 }}><div className="spinner" /></div>
                ) : slots.length === 0 ? (
                  <div style={{ color: "var(--color-gray-dark)", fontSize: "var(--font-size-sm)", textAlign: "center", marginTop: 32, fontFamily: "var(--font-family-primary)" }}>
                    この日は予約できません
                  </div>
                ) : (
                  <div style={{ maxHeight: 300, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--spacing-2)" }}>
                    {slots.filter(s => s.available).map(s => (
                      <button key={s.startTime} onClick={() => setSelectedSlot(s)}
                        style={{
                          all: "unset", cursor: "pointer",
                          padding: "var(--spacing-3)", textAlign: "center", fontWeight: 600, fontSize: "var(--font-size-base)",
                          border: `1px solid ${selectedSlot?.startTime === s.startTime ? "var(--color-primary-orange)" : "var(--color-gray-light)"}`,
                          backgroundColor: selectedSlot?.startTime === s.startTime ? "var(--color-primary-orange)" : "var(--color-white)",
                          color: selectedSlot?.startTime === s.startTime ? "var(--color-white)" : "var(--color-text-primary)",
                          borderRadius: "var(--radius-md)", transition: "all 300ms ease", fontFamily: "var(--font-family-primary)",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = selectedSlot?.startTime === s.startTime ? "var(--color-primary-orange)" : "var(--color-background-secondary)"; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = selectedSlot?.startTime === s.startTime ? "var(--color-primary-orange)" : "var(--color-white)"; }}>
                        {s.startTime} 〜 {s.endTime}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "var(--spacing-3)", marginTop: "var(--spacing-8)" }}>
              <button onClick={() => setStep(1)} className="btn-ghost">← 戻る</button>
              <button onClick={() => setStep(3)} className="btn-primary"
                disabled={!selectedDate || !selectedSlot} style={{ flex: 1 }}>
                確認へ進む →
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedService && selectedSlot && (
          <div>
            <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-family-primary)", marginBottom: "var(--spacing-8)" }}>
              予約内容の確認
            </h2>
            <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)", backgroundColor: "var(--color-background-secondary)", marginBottom: "var(--spacing-8)" }}>
              {[
                { label: "サービス", value: selectedService.name },
                { label: "日付", value: formatDate(selectedDate) },
                { label: "時間", value: `${selectedSlot.startTime} 〜 ${selectedSlot.endTime} (${selectedService.durationMinutes}分)` },
                { label: "料金", value: formatPrice(selectedService.price), bold: true },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", paddingBottom: "var(--spacing-3)", borderBottom: "1px solid var(--color-gray-light)" }}>
                  <span style={{ color: "var(--color-text-primary)", fontWeight: 600, fontSize: "var(--font-size-sm)", fontFamily: "var(--font-family-primary)" }}>{row.label}</span>
                  <span style={{ color: "var(--color-text-primary)", fontWeight: row.bold ? 700 : 500, fontSize: "var(--font-size-base)", fontFamily: "var(--font-family-primary)" }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "var(--spacing-8)" }}>
              <label style={{ display: "block", fontSize: "var(--font-size-base)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "var(--spacing-2)", fontFamily: "var(--font-family-primary)" }}>
                メモ（任意）
              </label>
              <textarea style={{
                width: "100%", padding: "var(--spacing-3)", fontSize: "var(--font-size-base)", fontFamily: "var(--font-family-primary)",
                color: "var(--color-text-primary)", background: "var(--color-white)", border: "1px solid var(--color-gray-light)",
                borderRadius: "var(--radius-md)", minHeight: 100, resize: "vertical"
              }} placeholder="ご要望があればご記入ください" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: "var(--spacing-3)" }}>
              <button onClick={() => setStep(2)} className="btn-ghost" disabled={loading}>← 戻る</button>
              <button onClick={handleBooking} className="btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? "処理中..." : "お支払いへ進む →"}
              </button>
            </div>
          </div>
        )}

        {step === 4 && selectedService && selectedSlot && clientSecret && (
          <div>
            <h2 style={{ fontSize: "var(--font-size-xl)", fontWeight: 700, color: "var(--color-text-primary)", fontFamily: "var(--font-family-primary)", marginBottom: "var(--spacing-8)" }}>
              クレジットカード決済
            </h2>
            <div className="card card-body" style={{ marginBottom: "var(--spacing-8)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--spacing-2)", fontSize: "var(--font-size-base)", fontFamily: "var(--font-family-primary)" }}>
                <span style={{ color: "var(--color-text-primary)" }}>{selectedService.name}</span>
                <span style={{ color: "var(--color-text-primary)" }}>{formatPrice(selectedService.price)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid var(--color-gray-light)", paddingTop: "var(--spacing-3)", fontSize: "var(--font-size-base)", fontFamily: "var(--font-family-primary)" }}>
                <span style={{ color: "var(--color-text-primary)" }}>合計</span>
                <span style={{ color: "var(--color-primary-orange)" }}>{formatPrice(selectedService.price)}</span>
              </div>
            </div>
            <div className="card card-body" style={{ padding: "var(--spacing-8)" }}>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm bookingId={bookingId} amount={selectedService.price} onSuccess={() => setStep(5)} />
              </Elements>
            </div>
            <div style={{ textAlign: "center", marginTop: "var(--spacing-6)" }}>
              <button onClick={() => setStep(3)} className="btn-ghost" style={{ fontSize: "var(--font-size-sm)" }}>
                ← 戻って内容を修正する
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-primary-green) 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "-100vw", marginRight: "-100vw", marginBottom: "-64px", paddingTop: "100px" }}>
            <div className="card card-body" style={{ textAlign: "center", padding: "var(--spacing-12)", maxWidth: 500, backgroundColor: "var(--color-white)", margin: "var(--spacing-8)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--spacing-6)" }}>✓</div>
              <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "var(--spacing-3)", fontFamily: "var(--font-family-primary)" }}>
                予約が確定しました！
              </h2>
              <p style={{ color: "var(--color-text-primary)", marginBottom: "var(--spacing-2)", fontFamily: "var(--font-family-primary)" }}>
                確認メールをお送りしました。当日お待ちしております。
              </p>
              {bookingId && (
                <p style={{ fontSize: "var(--font-size-sm)", color: "var(--color-gray-dark)", marginBottom: "var(--spacing-8)", fontFamily: "var(--font-family-primary)" }}>
                  予約ID: {bookingId.slice(0, 8).toUpperCase()}
                </p>
              )}
              <div style={{ display: "flex", gap: "var(--spacing-3)", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/dashboard" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>ダッシュボードへ</Link>
                {bookingId && <Link href={`/bookings/${bookingId}`} className="btn-ghost" style={{ textDecoration: "none", display: "inline-block" }}>予約詳細を見る</Link>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
