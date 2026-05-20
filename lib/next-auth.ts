import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import LineProvider from "next-auth/providers/line";
import { getUserByEmail, verifyPassword, auditLog } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const authConfig: NextAuthConfig = {
  // NOTE: PrismaAdapter is omitted for Prisma v7 type compatibility.
  // Sessions are managed via JWT. Social login accounts are stored manually.
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    LineProvider({
      clientId: process.env.LINE_CHANNEL_ID,
      clientSecret: process.env.LINE_CHANNEL_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await getUserByEmail(credentials.email as string);
        if (!user || !user.passwordHash) return null;
        if (user.status === "suspended") return null;

        const isValid = await verifyPassword(
          credentials.password as string,
          user.passwordHash
        );
        if (!isValid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        await auditLog({
          actorId: user.id,
          actorType: "user",
          action: "login_success",
          status: "success",
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.avatarUrl ?? null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === "credentials") {
          // 通常ログイン: user.id は既にPrismaのID
          token.userId = user.id;
        } else if (user.email) {
          // OAuthログイン: emailからPrismaのIDを引く
          const dbUser = await getUserByEmail(user.email);
          token.userId = dbUser?.id ?? user.id;
        }
      }
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.userId as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      // For OAuth providers, upsert user record
      if (account?.provider !== "credentials" && user.email) {
        try {
          const existing = await getUserByEmail(user.email);
          if (existing) {
            await prisma.user.update({
              where: { id: existing.id },
              data: { emailVerified: true, lastLoginAt: new Date() },
            });
          } else {
            await prisma.user.create({
              data: {
                email: user.email,
                name: user.name ?? "ユーザー",
                avatarUrl: user.image ?? null,
                emailVerified: true,
              },
            });
          }
        } catch {
          // continue
        }
      }
      return true;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
