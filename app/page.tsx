"use client";
import Link from "next/link";
import { useState } from "react";

const features = [
  { icon: "🕐", title: "24時間予約受付", desc: "深夜でも自動で予約を受け付けます。機会損失をゼロに。" },
  { icon: "💳", title: "オンライン決済", desc: "Stripe決済で安全・スムーズな支払いを実現します。" },
  { icon: "📧", title: "自動メール通知", desc: "予約確認・リマインダーメールを自動送信します。" },
  { icon: "📊", title: "売上レポート", desc: "日別・月別・サービス別の売上をリアルタイム確認。" },
  { icon: "👥", title: "顧客管理", desc: "顧客情報・予約履歴を一元管理します。" },
  { icon: "⚙️", title: "柔軟な設定", desc: "営業時間・休業日・キャンセルポリシーを自由に設定。" },
];

const faqs = [
  { q: "導入にどのくらい時間がかかりますか？", a: "最短で翌日から利用開始できます。セットアップはシンプルで、技術知識は不要です。" },
  { q: "初期費用はかかりますか？", a: "初期費用は不要です。月額のみのシンプルな料金体系です。" },
  { q: "セキュリティは大丈夫ですか？", a: "Stripe決済・HTTPS通信・データ暗号化・定期バックアップで安全に運用できます。" },
  { q: "スマートフォンでも使えますか？", a: "はい。スマートフォン・タブレット・PCすべてに対応したレスポンシブデザインです。" },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ fontFamily: "var(--font-sans)" }}>
      {/* Header */}
      <header className="site-header">
        <div className="container site-header-inner">
          <Link href="/" className="site-logo">
            <span>📅</span> ReserveFlow
          </Link>
          <nav className="header-nav">
            <Link href="#features" className="btn btn-text" style={{ display: "none" }}>機能</Link>
            <Link href="/login" className="btn btn-ghost" style={{ minHeight: 36, padding: "8px 16px", fontSize: "0.875rem" }}>
              ログイン
            </Link>
            <Link href="/register" className="btn btn-primary" style={{ minHeight: 36, padding: "8px 16px", fontSize: "0.875rem" }}>
              無料で始める
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        padding: "80px 0 100px",
        textAlign: "center",
        color: "#fff",
      }}>
        <div className="container">
          <div style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.15)",
            padding: "6px 16px",
            borderRadius: "999px",
            fontSize: "0.875rem",
            marginBottom: "24px",
          }}>
            🎉 店舗向け予約管理システム
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, lineHeight: 1.2, marginBottom: "20px" }}>
            予約管理を<br />もっとシンプルに
          </h1>
          <p style={{ fontSize: "1.125rem", opacity: 0.9, maxWidth: 540, margin: "0 auto 40px", lineHeight: 1.7 }}>
            24時間自動予約受付・オンライン決済・顧客管理まで。
            あなたの店舗の業務効率化をトータルサポート。
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary" style={{
              background: "#fff", color: "#2563EB", minHeight: 52, padding: "14px 32px", fontSize: "1rem"
            }}>
              無料で始める →
            </Link>
            <Link href="/login" className="btn btn-ghost" style={{
              border: "2px solid rgba(255,255,255,0.5)", color: "#fff", background: "transparent",
              minHeight: 52, padding: "14px 32px", fontSize: "1rem"
            }}>
              デモを見る
            </Link>
          </div>
          <p style={{ marginTop: 16, fontSize: "0.875rem", opacity: 0.7 }}>
            クレジットカード不要 · 14日間無料トライアル
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#fff", borderBottom: "1px solid var(--color-gray-200)", padding: "32px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32, textAlign: "center" }}>
            {[
              { value: "1,000+", label: "導入店舗数" },
              { value: "50,000+", label: "月間予約数" },
              { value: "4.8/5", label: "顧客満足度" },
              { value: "99.9%", label: "稼働率" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-primary)" }}>{s.value}</div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-gray-500)", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: "80px 0", background: "var(--color-gray-50)" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>主な機能</h2>
          <p style={{ textAlign: "center", color: "var(--color-gray-500)", marginBottom: 48 }}>
            店舗運営に必要な機能をすべて揃えました
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {features.map((f) => (
              <div key={f.title} className="card" style={{ padding: 24, transition: "all 0.2s" }}>
                <div style={{ fontSize: "2rem", marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, marginBottom: 48 }}>ご利用の流れ</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
            {[
              { step: "01", title: "アカウント登録", desc: "メールアドレスまたはSNSで簡単登録。無料トライアル開始。" },
              { step: "02", title: "店舗設定", desc: "営業時間・サービス・キャンセルポリシーを設定します。" },
              { step: "03", title: "予約受付開始", desc: "顧客がオンラインで24時間いつでも予約できるようになります。" },
              { step: "04", title: "一元管理", desc: "ダッシュボードで予約・売上・顧客を一括管理。" },
            ].map((s) => (
              <div key={s.step} style={{ textAlign: "center" }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563EB, #7C3AED)",
                  color: "#fff", fontWeight: 700, fontSize: "1.125rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px",
                }}>
                  {s.step}
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-gray-500)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: "80px 0", background: "var(--color-gray-50)" }}>
        <div className="container">
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, marginBottom: 12 }}>シンプルな料金体系</h2>
          <p style={{ textAlign: "center", color: "var(--color-gray-500)", marginBottom: 48 }}>隠れた費用は一切ありません</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, maxWidth: 900, margin: "0 auto" }}>
            {[
              { name: "スターター", price: "¥0", period: "/月", features: ["予約受付 50件/月", "基本レポート", "メール通知"], highlight: false },
              { name: "プロ", price: "¥100", period: "/月", features: ["予約受付 無制限", "詳細レポート", "優先サポート", "カスタムメール"], highlight: true },
              { name: "エンタープライズ", price: "¥300", period: "/月", features: ["複数店舗対応", "API連携", "専任サポート", "カスタム機能"], highlight: false },
            ].map((p) => (
              <div key={p.name} className="card" style={{
                padding: 32, textAlign: "center",
                border: p.highlight ? "2px solid var(--color-primary)" : undefined,
                position: "relative",
              }}>
                {p.highlight && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "var(--color-primary)", color: "#fff", padding: "4px 16px",
                    borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700,
                  }}>人気プラン</div>
                )}
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{p.name}</h3>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--color-primary)" }}>
                  {p.price}<span style={{ fontSize: "1rem", color: "var(--color-gray-500)" }}>{p.period}</span>
                </div>
                <ul style={{ listStyle: "none", margin: "24px 0", textAlign: "left", display: "flex", flexDirection: "column", gap: 10 }}>
                  {p.features.map((f) => (
                    <li key={f} style={{ fontSize: "0.875rem", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "var(--color-success)" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`btn ${p.highlight ? "btn-primary" : "btn-ghost"} btn-full`}>
                  始める
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, marginBottom: 48 }}>よくある質問</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} className="card" style={{ overflow: "hidden" }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", padding: "16px 20px", textAlign: "left", background: "none",
                    border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between",
                    alignItems: "center", fontWeight: 500, fontSize: "1rem",
                  }}
                >
                  {faq.q}
                  <span style={{ transition: "transform 0.2s", transform: openFaq === i ? "rotate(180deg)" : "none" }}>▼</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 20px 16px", fontSize: "0.875rem", color: "var(--color-gray-600)", lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: "80px 0",
        background: "linear-gradient(135deg, #2563EB 0%, #7C3AED 100%)",
        textAlign: "center", color: "#fff",
      }}>
        <div className="container">
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 16 }}>今すぐ無料で始めましょう</h2>
          <p style={{ opacity: 0.9, marginBottom: 40 }}>14日間の無料トライアルですべての機能を試せます</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary" style={{
              background: "#fff", color: "#2563EB", minHeight: 52, padding: "14px 32px"
            }}>
              無料で会員登録
            </Link>
            <Link href="/login" className="btn btn-ghost" style={{
              border: "2px solid rgba(255,255,255,0.4)", color: "#fff", background: "transparent",
              minHeight: 52, padding: "14px 32px"
            }}>
              管理者デモを試す
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "var(--color-gray-900)", color: "var(--color-gray-400)", padding: "40px 0" }}>
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#fff", marginBottom: 8 }}>📅 ReserveFlow</div>
              <p style={{ fontSize: "0.875rem", maxWidth: 280, lineHeight: 1.6 }}>
                店舗向けオンライン予約・決済プラットフォーム
              </p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[
                { title: "サービス", links: ["機能紹介", "料金", "ブログ"] },
                { title: "サポート", links: ["FAQ", "お問い合わせ", "利用規約"] },
              ].map((col) => (
                <div key={col.title}>
                  <div style={{ fontWeight: 700, color: "#fff", marginBottom: 12, fontSize: "0.875rem" }}>{col.title}</div>
                  {col.links.map((l) => (
                    <div key={l} style={{ fontSize: "0.875rem", marginBottom: 8 }}>
                      <Link href="#" style={{ color: "var(--color-gray-400)", textDecoration: "none" }}>{l}</Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--color-gray-700)", paddingTop: 24, fontSize: "0.875rem", textAlign: "center" }}>
            © 2026 ReserveFlow. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
