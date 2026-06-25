<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# 開発時の重要ルール (Project Specific Rules)

1. **ローカルサーバーのポート指定について**:
   - チャットボット（別プロジェクト）と競合するため、このプロジェクト（reservation_management）のローカル開発サーバーは必ず **ポート3001** (`http://localhost:3001`) で稼働させること。
   - `package.json` のスクリプトは既に `"dev": "next dev -p 3001"` に設定済み。絶対に3000に戻さないこと。
   - 認証（NextAuth）のコールバックや環境変数 `NEXTAUTH_URL` / `AUTH_URL` も `http://localhost:3001` を基準として扱うこと。

2. **認証まわり (NextAuth / Google)**:
   - デプロイ先（Vercel等）の環境変数には本番用URLが設定されているか要確認。ローカルでは `.env.local` の `3001` 設定を使う。
