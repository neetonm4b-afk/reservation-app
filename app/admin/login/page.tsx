"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false, callbackUrl: "/admin/dashboard" });
    if (res?.error) setError("メールアドレスまたはパスワードが正しくありません");
    else if (res?.url) window.location.href = res.url;
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e293b 0%, #1e40af 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fff", textDecoration: "none" }}>
            📅 ReserveFlow
          </Link>
          <p style={{ color: "rgba(255,255,255,0.7)", marginTop: 8 }}>管理者ポータル</p>
        </div>
        <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <h1 style={{ fontSize: "1.25rem", fontWeight: 700, textAlign: "center" }}>管理者ログイン</h1>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">メールアドレス</label>
              <input id="admin-email" type="email" className="form-input" value={email}
                onChange={e => setEmail(e.target.value)} required placeholder="admin@example.com" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-password">パスワード</label>
              <input id="admin-password" type="password" className="form-input" value={password}
                onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
          <p className="text-center text-sm text-muted">
            <Link href="/login" className="text-primary">顧客ログイン</Link> はこちら
          </p>
        </div>
        <div className="alert alert-info" style={{ marginTop: 16 }}>
          <div>
            <strong>デモ用認証情報</strong><br />
            <span style={{ fontFamily: "monospace" }}>admin@example.com / Admin1234!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
