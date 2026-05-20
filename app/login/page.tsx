"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("メールアドレスまたはパスワードが正しくありません");
    } else {
      router.push("/dashboard");
    }
    setLoading(false);
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/dashboard" });

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-gray-50)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--color-primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
            📅 ReserveFlow
          </Link>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginTop: 16, marginBottom: 4 }}>ログイン</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)" }}>アカウントにログインしてください</p>
        </div>

        <div className="card card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {error && <div className="alert alert-error">{error}</div>}

          <button id="btn-google-login" onClick={handleGoogle} className="btn btn-google btn-full" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 0 0 0 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
            Googleでログイン
          </button>
          
          <button id="btn-line-login" onClick={() => signIn("line", { callbackUrl: "/dashboard" })} className="btn btn-full" type="button" style={{ backgroundColor: "#00B900", color: "#fff", borderColor: "#00B900" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 8, fill: "currentColor" }}>
              <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738-6.616 0-12 4.369-12 9.738 0 4.814 4.269 8.846 10.036 9.608.391.084.922.258 1.057.592.122.303.079.769.038 1.082l-.168 1.02c-.05.303-.24 1.186 1.04.647 1.28-.54 6.91-4.069 9.428-6.967 1.739-1.907 2.569-3.96 2.569-5.982z"/>
            </svg>
            LINEでログイン
          </button>

          <div className="divider">または</div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">メールアドレス</label>
              <input id="email" type="email" className="form-input" placeholder="example@email.com" value={email}
                onChange={e => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="password">パスワード</label>
              <input id="password" type="password" className="form-input" placeholder="••••••••" value={password}
                onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
              <div style={{ textAlign: "right" }}>
                <Link href="#" className="text-sm text-primary" style={{ textDecoration: "none" }}>パスワードを忘れた方</Link>
              </div>
            </div>
            <button id="btn-login-submit" type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <p className="text-center text-sm text-muted" style={{ marginTop: 8 }}>
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="text-primary" style={{ fontWeight: 500 }}>会員登録</Link>
          </p>
          <p className="text-center text-sm text-muted">
            管理者の方は{" "}
            <Link href="/admin/login" className="text-primary" style={{ fontWeight: 500 }}>管理者ログイン</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
