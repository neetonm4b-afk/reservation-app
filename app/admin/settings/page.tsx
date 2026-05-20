"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

/* ── Types ── */
type DayKey = "monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday";
type DayHours = { open: string; close: string; closed: boolean };
type BusinessHours = Record<DayKey, DayHours>;
type CancelPolicy = { daysBefore: number; feePercentage: number }[];
type BookingSettings = {
  advanceBookingDays: number;
  sameDayBookingEnabled: boolean;
  minBookingInterval: number;
  slotDuration: number;
  maxConcurrentBookings: number;
};

const DAY_LABELS: Record<DayKey, string> = {
  monday:"月曜日", tuesday:"火曜日", wednesday:"水曜日",
  thursday:"木曜日", friday:"金曜日", saturday:"土曜日", sunday:"日曜日",
};
const DAYS: DayKey[] = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];

const DEFAULT_HOURS: BusinessHours = {
  monday:    { open:"10:00", close:"19:00", closed:false },
  tuesday:   { open:"10:00", close:"19:00", closed:false },
  wednesday: { open:"10:00", close:"19:00", closed:false },
  thursday:  { open:"10:00", close:"19:00", closed:false },
  friday:    { open:"10:00", close:"19:00", closed:false },
  saturday:  { open:"10:00", close:"19:00", closed:false },
  sunday:    { open:"10:00", close:"18:00", closed:false },
};
const DEFAULT_BOOKING: BookingSettings = {
  advanceBookingDays: 90, sameDayBookingEnabled: true,
  minBookingInterval: 15, slotDuration: 60, maxConcurrentBookings: 1,
};

const NAV = [
  { href:"/admin/dashboard", icon:"🏠", label:"ダッシュボード" },
  { href:"/admin/bookings",  icon:"📅", label:"予約管理" },
  { href:"/admin/services",  icon:"✂️", label:"サービス管理" },
  { href:"/admin/settings",  icon:"⚙️", label:"設定" },
];

type Toast = { id:number; type:"success"|"error"; msg:string };

export default function SettingsPage() {
  const [loading, setLoading]   = useState(true);
  const [toasts,  setToasts]    = useState<Toast[]>([]);
  const [tid,     setTid]       = useState(0);

  /* Hours */
  const [hours,    setHours]    = useState<BusinessHours>(DEFAULT_HOURS);
  const [savingH,  setSavingH]  = useState(false);

  /* Holidays */
  const [holidays,  setHolidays]  = useState<DayKey[]>([]);
  const [savingHol, setSavingHol] = useState(false);

  /* Cancel policy */
  const [policy,   setPolicy]   = useState<CancelPolicy>([
    { daysBefore:3, feePercentage:0 },
    { daysBefore:1, feePercentage:50 },
    { daysBefore:0, feePercentage:100 },
  ]);
  const [savingP,  setSavingP]  = useState(false);

  /* Booking settings */
  const [booking,  setBooking]  = useState<BookingSettings>(DEFAULT_BOOKING);
  const [savingB,  setSavingB]  = useState(false);

  /* Toast helper */
  const toast = useCallback((type:"success"|"error", msg:string) => {
    const id = tid + 1; setTid(id);
    setToasts(p => [...p, { id, type, msg }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, [tid]);

  /* Load */
  useEffect(() => {
    (async () => {
      const res  = await fetch("/api/admin/settings");
      const data = await res.json();
      if (!data.success) return;
      const s = data.data;
      try { setHours(JSON.parse(s.businessHours)); } catch {}
      try { const h = JSON.parse(s.holidays); setHolidays(Array.isArray(h) ? h : []); } catch {}
      try { setPolicy(JSON.parse(s.cancellationPolicy).policy ?? []); } catch {}
      try { setBooking({ ...DEFAULT_BOOKING, ...JSON.parse(s.bookingSettings) }); } catch {}
      setLoading(false);
    })();
  }, []);

  /* Save helpers */
  const saveHours = async () => {
    setSavingH(true);
    const res = await fetch("/api/admin/settings", { method:"PUT", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ businessHours: hours }) });
    const d = await res.json();
    toast(d.success ? "success" : "error", d.success ? "営業時間を保存しました" : d.error);
    setSavingH(false);
  };

  const saveHolidays = async () => {
    setSavingHol(true);
    const res = await fetch("/api/admin/settings", { method:"PUT", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ holidays }) });
    const d = await res.json();
    toast(d.success ? "success" : "error", d.success ? "定休日を保存しました" : d.error);
    setSavingHol(false);
  };

  const savePolicy = async () => {
    setSavingP(true);
    const res = await fetch("/api/admin/settings", { method:"PUT", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ cancellationPolicy: { policy } }) });
    const d = await res.json();
    toast(d.success ? "success" : "error", d.success ? "キャンセルポリシーを保存しました" : d.error);
    setSavingP(false);
  };

  const saveBooking = async () => {
    setSavingB(true);
    const res = await fetch("/api/admin/settings", { method:"PUT", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ bookingSettings: booking }) });
    const d = await res.json();
    toast(d.success ? "success" : "error", d.success ? "予約設定を保存しました" : d.error);
    setSavingB(false);
  };

  /* ── Render ── */
  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link href="/admin/dashboard" className="sidebar-logo"><span>📅</span> ReserveFlow</Link>
        <div className="sidebar-section-title">メニュー</div>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className={`sidebar-item ${n.href==="/admin/settings"?"active":""}`}>
            <span>{n.icon}</span> {n.label}
          </Link>
        ))}
        <div style={{flex:1}}/>
        <button onClick={() => signOut({ callbackUrl:"/" })} className="sidebar-item" style={{marginBottom:16}}>
          <span>🚪</span> ログアウト
        </button>
      </aside>

      <main className="admin-content">
        <div style={{marginBottom:28}}>
          <h1 style={{fontSize:"1.5rem",fontWeight:700}}>設定</h1>
          <p style={{fontSize:"0.875rem",color:"var(--color-gray-500)"}}>店舗の営業情報・予約ポリシーを管理します</p>
        </div>

        {loading ? (
          <div style={{display:"flex",justifyContent:"center",padding:80}}><div className="spinner"/></div>
        ) : (
          <div style={{display:"grid",gap:24}}>

            {/* ── 1. 営業時間 ── */}
            <section className="card">
              <div className="card-header" style={{display:"flex",alignItems:"center",gap:8}}>
                🕐 営業時間
              </div>
              <div className="card-body">
                <div style={{display:"grid",gap:10}}>
                  {DAYS.map(day => (
                    <div key={day} style={{display:"grid",gridTemplateColumns:"100px 1fr",alignItems:"center",gap:16,padding:"10px 14px",background:"var(--color-gray-50)",borderRadius:"var(--radius-lg)"}}>
                      <label style={{fontWeight:500,fontSize:"0.9rem"}}>{DAY_LABELS[day]}</label>
                      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
                        <label style={{display:"flex",alignItems:"center",gap:6,fontSize:"0.85rem",cursor:"pointer"}}>
                          <input type="checkbox" checked={hours[day].closed}
                            onChange={e => setHours(h=>({...h,[day]:{...h[day],closed:e.target.checked}}))}
                            style={{width:16,height:16,cursor:"pointer"}}/>
                          定休日
                        </label>
                        {!hours[day].closed && (<>
                          <input type="time" className="form-input" value={hours[day].open}
                            onChange={e => setHours(h=>({...h,[day]:{...h[day],open:e.target.value}}))}
                            style={{width:120,height:36}}/>
                          <span style={{color:"var(--color-gray-400)"}}>〜</span>
                          <input type="time" className="form-input" value={hours[day].close}
                            onChange={e => setHours(h=>({...h,[day]:{...h[day],close:e.target.value}}))}
                            style={{width:120,height:36}}/>
                        </>)}
                        {hours[day].closed && (
                          <span style={{color:"var(--color-error)",fontSize:"0.85rem",fontWeight:600}}>定休日</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
                  <button id="save-hours" onClick={saveHours} disabled={savingH} className="btn btn-primary"
                    style={{minHeight:40,padding:"0 28px",fontSize:"0.9rem"}}>
                    {savingH ? "保存中…" : "💾 営業時間を保存"}
                  </button>
                </div>
              </div>
            </section>

            {/* ── 2. 定休日 ── */}
            <section className="card">
              <div className="card-header" style={{display:"flex",alignItems:"center",gap:8}}>
                🚫 定休日（曜日）
              </div>
              <div className="card-body">
                <p style={{fontSize:"0.875rem",color:"var(--color-gray-500)",marginBottom:14}}>
                  毎週固定の定休日曜日を選択してください
                </p>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {DAYS.map(day => {
                    const checked = holidays.includes(day);
                    return (
                      <button key={day}
                        onClick={() => setHolidays(h => checked ? h.filter(d=>d!==day) : [...h, day])}
                        style={{
                          padding:"8px 18px", borderRadius:"var(--radius-full)", fontSize:"0.875rem",
                          fontWeight:checked?700:400, cursor:"pointer", border:"2px solid",
                          borderColor: checked?"var(--color-error)":"var(--color-gray-200)",
                          background:  checked?"var(--color-error-light)":"#fff",
                          color:       checked?"#DC2626":"var(--color-gray-600)",
                          transition:"all 0.15s ease",
                        }}>
                        {DAY_LABELS[day]}
                      </button>
                    );
                  })}
                </div>
                {holidays.length > 0 && (
                  <p style={{fontSize:"0.8rem",color:"var(--color-error)",marginTop:10}}>
                    定休日: {holidays.map(d=>DAY_LABELS[d]).join("・")}
                  </p>
                )}
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
                  <button id="save-holidays" onClick={saveHolidays} disabled={savingHol} className="btn btn-primary"
                    style={{minHeight:40,padding:"0 28px",fontSize:"0.9rem"}}>
                    {savingHol ? "保存中…" : "💾 定休日を保存"}
                  </button>
                </div>
              </div>
            </section>

            {/* ── 3. キャンセルポリシー ── */}
            <section className="card">
              <div className="card-header" style={{display:"flex",alignItems:"center",gap:8}}>
                ❌ キャンセルポリシー
              </div>
              <div className="card-body">
                <p style={{fontSize:"0.875rem",color:"var(--color-gray-500)",marginBottom:16}}>
                  予約日までの残り日数に応じたキャンセル手数料を設定します
                </p>
                <div style={{display:"grid",gap:10}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 48px",gap:12,padding:"8px 0"}}>
                    <span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-gray-500)",textTransform:"uppercase"}}>キャンセル可能期限（日前）</span>
                    <span style={{fontSize:"0.75rem",fontWeight:700,color:"var(--color-gray-500)",textTransform:"uppercase"}}>返金率（%）</span>
    <span/>
                  </div>
                  {policy.map((row, i) => (
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 48px",gap:12,alignItems:"center",padding:"12px 14px",background:"var(--color-gray-50)",borderRadius:"var(--radius-lg)"}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <input type="number" min={0} max={365} className="form-input"
                          value={row.daysBefore} style={{height:38}}
                          onChange={e => setPolicy(p => p.map((r,j) => j===i?{...r,daysBefore:Number(e.target.value)}:r))}/>
                        <span style={{fontSize:"0.85rem",color:"var(--color-gray-500)",whiteSpace:"nowrap"}}>日前まで</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <input type="number" min={0} max={100} className="form-input"
                          value={row.feePercentage} style={{height:38}}
                          onChange={e => setPolicy(p => p.map((r,j) => j===i?{...r,feePercentage:Number(e.target.value)}:r))}/>
                        <span style={{fontSize:"0.85rem",color:"var(--color-gray-500)"}}>%返金</span>
                      </div>
                      <button onClick={() => setPolicy(p => p.filter((_,j)=>j!==i))}
                        style={{width:36,height:36,borderRadius:"var(--radius-md)",border:"1px solid var(--color-error)",background:"var(--color-error-light)",color:"#DC2626",cursor:"pointer",fontSize:"1rem"}}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => setPolicy(p => [...p, { daysBefore:0, feePercentage:0 }])}
                  className="btn btn-ghost" style={{marginTop:12,minHeight:36,fontSize:"0.85rem"}}>
                  ＋ 行を追加
                </button>
                <div style={{marginTop:14,padding:"12px 16px",background:"var(--color-primary-light)",borderRadius:"var(--radius-lg)"}}>
                  <p style={{fontSize:"0.8rem",color:"#1D4ED8"}}>
                    💡 例: 3日前までキャンセル可 → 返金率 100%、前日 → 50%、当日 → 0%（全額手数料）
                  </p>
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}>
                  <button id="save-policy" onClick={savePolicy} disabled={savingP} className="btn btn-primary"
                    style={{minHeight:40,padding:"0 28px",fontSize:"0.9rem"}}>
                    {savingP ? "保存中…" : "💾 ポリシーを保存"}
                  </button>
                </div>
              </div>
            </section>

            {/* ── 4. 予約設定 ── */}
            <section className="card">
              <div className="card-header" style={{display:"flex",alignItems:"center",gap:8}}>
                📅 予約設定
              </div>
              <div className="card-body">
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

                  <div className="form-group">
                    <label className="form-label">予約可能な最大日数</label>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <input type="number" min={1} max={365} className="form-input"
                        value={booking.advanceBookingDays} style={{height:40}}
                        onChange={e => setBooking(b=>({...b,advanceBookingDays:Number(e.target.value)}))}/>
                      <span style={{fontSize:"0.85rem",color:"var(--color-gray-500)",whiteSpace:"nowrap"}}>日前まで</span>
                    </div>
                    <p className="form-help">今日から何日先まで予約を受け付けるか</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">当日予約</label>
                    <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",marginTop:6}}>
                      <div
                        onClick={() => setBooking(b=>({...b,sameDayBookingEnabled:!b.sameDayBookingEnabled}))}
                        style={{
                          width:44, height:24, borderRadius:12, cursor:"pointer",
                          background: booking.sameDayBookingEnabled ? "var(--color-primary)" : "var(--color-gray-300)",
                          position:"relative", transition:"background 0.2s",
                        }}>
                        <div style={{
                          position:"absolute", top:3,
                          left: booking.sameDayBookingEnabled ? 23 : 3,
                          width:18, height:18, borderRadius:"50%", background:"#fff",
                          transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)",
                        }}/>
                      </div>
                      <span style={{fontSize:"0.9rem"}}>
                        {booking.sameDayBookingEnabled ? "有効" : "無効"}
                      </span>
                    </label>
                    <p className="form-help">当日の予約を受け付けるかどうか</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">予約間隔（分）</label>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <input type="number" min={5} max={120} step={5} className="form-input"
                        value={booking.minBookingInterval} style={{height:40}}
                        onChange={e => setBooking(b=>({...b,minBookingInterval:Number(e.target.value)}))}/>
                      <span style={{fontSize:"0.85rem",color:"var(--color-gray-500)"}}>分</span>
                    </div>
                    <p className="form-help">予約枠の最小間隔</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">スロット時間（分）</label>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <input type="number" min={15} max={480} step={15} className="form-input"
                        value={booking.slotDuration} style={{height:40}}
                        onChange={e => setBooking(b=>({...b,slotDuration:Number(e.target.value)}))}/>
                      <span style={{fontSize:"0.85rem",color:"var(--color-gray-500)"}}>分</span>
                    </div>
                    <p className="form-help">1予約枠あたりの標準時間</p>
                  </div>

                  <div className="form-group">
                    <label className="form-label">同時予約受付数</label>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <input type="number" min={1} max={50} className="form-input"
                        value={booking.maxConcurrentBookings} style={{height:40}}
                        onChange={e => setBooking(b=>({...b,maxConcurrentBookings:Number(e.target.value)}))}/>
                      <span style={{fontSize:"0.85rem",color:"var(--color-gray-500)"}}>件</span>
                    </div>
                    <p className="form-help">同一時間帯に受け付ける最大予約数</p>
                  </div>

                </div>
                <div style={{display:"flex",justifyContent:"flex-end",marginTop:20}}>
                  <button id="save-booking-settings" onClick={saveBooking} disabled={savingB} className="btn btn-primary"
                    style={{minHeight:40,padding:"0 28px",fontSize:"0.9rem"}}>
                    {savingB ? "保存中…" : "💾 予約設定を保存"}
                  </button>
                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Toasts */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type==="success" ? "✅" : "❌"}</span>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
