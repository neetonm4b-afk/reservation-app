"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { formatPrice } from "@/lib/utils";

type Service = {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number;
  durationMinutes: number;
  colorTag: string | null;
  maxCapacity: number;
  isActive: boolean;
  displayOrder: number;
};

type FormData = {
  name: string;
  description: string;
  category: string;
  price: string;
  durationMinutes: string;
  colorTag: string;
  maxCapacity: string;
};

const EMPTY_FORM: FormData = {
  name: "", description: "", category: "", price: "",
  durationMinutes: "", colorTag: "#6366f1", maxCapacity: "1",
};

const NAV = [
  { href: "/admin/dashboard", icon: "🏠", label: "ダッシュボード" },
  { href: "/admin/bookings",  icon: "📅", label: "予約管理" },
  { href: "/admin/services",  icon: "✂️", label: "サービス管理" },
  { href: "/admin/settings",  icon: "⚙️", label: "設定" },
];

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444",
  "#f97316", "#eab308", "#22c55e", "#06b6d4",
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Service | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/services");
    const data = await res.json();
    setServices(data.data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  };

  const openEdit = (s: Service) => {
    setEditTarget(s);
    setForm({
      name: s.name,
      description: s.description ?? "",
      category: s.category ?? "",
      price: String(s.price),
      durationMinutes: String(s.durationMinutes),
      colorTag: s.colorTag ?? "#6366f1",
      maxCapacity: String(s.maxCapacity),
    });
    setError("");
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.durationMinutes) {
      setError("サービス名・料金・所要時間は必須です");
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description || null,
      category: form.category || null,
      price: Number(form.price),
      durationMinutes: Number(form.durationMinutes),
      colorTag: form.colorTag || null,
      maxCapacity: Number(form.maxCapacity) || 1,
    };

    const res = editTarget
      ? await fetch(`/api/admin/services/${editTarget.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/services", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

    const data = await res.json();
    if (!data.success) { setError(data.error ?? "エラーが発生しました"); setSaving(false); return; }
    setSaving(false);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  };

  const handleToggleActive = async (s: Service) => {
    await fetch(`/api/admin/services/${s.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    load();
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link href="/admin/dashboard" className="sidebar-logo"><span>📅</span> ReserveFlow</Link>
        <div className="sidebar-section-title">メニュー</div>
        {NAV.map(n => (
          <Link key={n.href} href={n.href} className={`sidebar-item ${n.href === "/admin/services" ? "active" : ""}`}>
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
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>サービス管理</h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)" }}>
              提供サービスの追加・編集・削除
            </p>
          </div>
          <button onClick={openCreate} className="btn btn-primary" style={{ minHeight: 40, padding: "8px 20px" }}>
            ＋ サービスを追加
          </button>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 80 }}><div className="spinner" /></div>
        ) : (
          <div style={{ display: "grid", gap: 16 }}>
            {services.length === 0 && (
              <div className="card card-body" style={{ textAlign: "center", padding: 60, color: "var(--color-gray-400)" }}>
                サービスがありません。「サービスを追加」から登録してください。
              </div>
            )}
            {services.map(s => (
              <div key={s.id} className="card" style={{ opacity: s.isActive ? 1 : 0.6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px" }}>
                  {/* カラータグ */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                    background: s.colorTag ?? "#6366f1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.25rem",
                  }}>✂️</div>

                  {/* 情報 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: "1rem" }}>{s.name}</span>
                      {s.category && (
                        <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 999,
                          background: "var(--color-gray-100)", color: "var(--color-gray-500)" }}>
                          {s.category}
                        </span>
                      )}
                      {!s.isActive && (
                        <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 999,
                          background: "#fef2f2", color: "#ef4444" }}>非公開</span>
                      )}
                    </div>
                    {s.description && (
                      <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)", marginTop: 2,
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 400 }}>
                        {s.description}
                      </p>
                    )}
                    <div style={{ display: "flex", gap: 20, marginTop: 6, fontSize: "0.875rem" }}>
                      <span style={{ fontWeight: 700, color: "var(--color-primary)" }}>{formatPrice(s.price)}</span>
                      <span style={{ color: "var(--color-gray-500)" }}>⏱ {s.durationMinutes}分</span>
                      <span style={{ color: "var(--color-gray-500)" }}>👥 最大{s.maxCapacity}名</span>
                    </div>
                  </div>

                  {/* アクション */}
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => handleToggleActive(s)} className="btn btn-ghost"
                      style={{ minHeight: 34, padding: "4px 12px", fontSize: "0.75rem" }}>
                      {s.isActive ? "非公開にする" : "公開する"}
                    </button>
                    <button onClick={() => openEdit(s)} className="btn btn-secondary"
                      style={{ minHeight: 34, padding: "4px 14px", fontSize: "0.875rem" }}>
                      編集
                    </button>
                    <button onClick={() => setDeleteId(s.id)} className="btn btn-ghost"
                      style={{ minHeight: 34, padding: "4px 12px", fontSize: "0.875rem", color: "#ef4444" }}>
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 編集・新規モーダル */}
      {modalOpen && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16,
        }} onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="card" style={{ width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}>
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>{editTarget ? "サービスを編集" : "サービスを追加"}</span>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "var(--color-gray-400)" }}>✕</button>
            </div>
            <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label className="form-label">サービス名 <span style={{ color: "#ef4444" }}>*</span></label>
                <input className="form-input" placeholder="例: カット＆スタイリング" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">説明</label>
                <textarea className="form-input" rows={3} placeholder="サービスの詳細説明"
                  value={form.description} style={{ resize: "vertical" }}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">カテゴリ</label>
                <input className="form-input" placeholder="例: カット、カラー、トリートメント"
                  value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">料金 (円) <span style={{ color: "#ef4444" }}>*</span></label>
                  <input className="form-input" type="number" min={0} placeholder="5500"
                    value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">所要時間 (分) <span style={{ color: "#ef4444" }}>*</span></label>
                  <input className="form-input" type="number" min={15} step={15} placeholder="60"
                    value={form.durationMinutes} onChange={e => setForm(f => ({ ...f, durationMinutes: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">最大人数</label>
                  <input className="form-input" type="number" min={1} placeholder="1"
                    value={form.maxCapacity} onChange={e => setForm(f => ({ ...f, maxCapacity: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">カラー</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                    {COLORS.map(c => (
                      <button key={c} onClick={() => setForm(f => ({ ...f, colorTag: c }))}
                        style={{
                          width: 28, height: 28, borderRadius: "50%", background: c, border: "none", cursor: "pointer",
                          outline: form.colorTag === c ? `3px solid ${c}` : "3px solid transparent",
                          outlineOffset: 2,
                        }} />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8 }}>
                <button onClick={() => setModalOpen(false)} className="btn btn-ghost"
                  style={{ minHeight: 40, padding: "8px 20px" }}>キャンセル</button>
                <button onClick={handleSave} className="btn btn-primary" disabled={saving}
                  style={{ minHeight: 40, padding: "8px 24px" }}>
                  {saving ? "保存中..." : editTarget ? "変更を保存" : "サービスを追加"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認モーダル */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16,
        }}>
          <div className="card card-body" style={{ width: "100%", maxWidth: 400, textAlign: "center", gap: 16, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "2.5rem" }}>🗑️</div>
            <div>
              <p style={{ fontWeight: 700, marginBottom: 4 }}>このサービスを削除しますか？</p>
              <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)" }}>削除後は予約ページに表示されなくなります</p>
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-ghost" style={{ minHeight: 40, padding: "8px 24px" }}>キャンセル</button>
              <button onClick={() => handleDelete(deleteId)} className="btn"
                style={{ minHeight: 40, padding: "8px 24px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
