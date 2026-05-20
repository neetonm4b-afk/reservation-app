import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "予約管理システム | 店舗向けオンライン予約・決済プラットフォーム",
  description: "24時間自動予約受付、オンライン決済、顧客管理まで。店舗の業務効率化に特化した予約管理システムです。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
