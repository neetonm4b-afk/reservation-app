import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Suppress the workspace root detection warning
    root: __dirname,
  },
  serverExternalPackages: [
    "@prisma/adapter-better-sqlite3",
    "better-sqlite3",
    "@prisma/client",
    "bcryptjs",
  ],
};

export default nextConfig;
