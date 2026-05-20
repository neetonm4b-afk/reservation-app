"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "登録に失敗しました");
      // 登録後に自動ログイン
      await signIn("credentials", { email, password, redirect: false });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    }
    setLoading(false);
  };

  const rules = [
    { label: "8文字以上", ok: password.length >= 8 },
    { label: "大文字を含む", ok: /[A-Z]/.test(password) },
    { label: "小文字を含む", ok: /[a-z]/.test(password) },
    { label: "数字を含む", ok: /[0-9]/.test(password) },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-50)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", textDecoration: "none" }}>
            📅 ReserveFlow
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: 16, marginBottom: 4 }}>会員登録</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)" }}>無料アカウントを作成してください</p>
        </div>

        <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && <div className="alert alert-error">{error}</div>}

          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn btn-google btn-full" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
            Googleで登録
          </button>

          <div className="divider">または</div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="name">お名前 <span className="required">*</span></label>
              <input id="name" type="text" className="form-input" placeholder="山田 太郎" value={name}
                onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">メールアドレス <span className="required">*</span></label>
              <input id="reg-email" type="email" className="form-input" placeholder="example@email.com" value={email}
                onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">パスワード <span className="required">*</span></label>
              <input id="reg-password" type="password" className="form-input" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required autoComplete="new-password" />
              {password && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                  {rules.map(r => (
                    <span key={r.label} style={{
                      fontSize: "0.75rem", padding: "2px 8px", borderRadius: "999px",
                      background: r.ok ? "var(--color-success-light)" : "var(--color-gray-100)",
                      color: r.ok ? "var(--color-success)" : "var(--color-gray-400)",
                    }}>
                      {r.ok ? "✓" : "○"} {r.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button id="btn-register-submit" type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "登録中..." : "アカウントを作成"}
            </button>
          </form>

          <p className="text-center text-sm text-muted" style={{ marginTop: 8 }}>
            登録することで
            <Link href="#" className="text-primary" style={{ textDecoration: "none" }}> 利用規約</Link> と
            <Link href="#" className="text-primary" style={{ textDecoration: "none" }}> プライバシーポリシー</Link> に同意したことになります
          </p>
          <p className="text-center text-sm text-muted">
            既にアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-primary" style={{ fontWeight: 500 }}>ログイン</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
