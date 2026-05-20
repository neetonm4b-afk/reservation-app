import bcrypt from "bcryptjs";
import { prisma } from "./db";

// ─── Password utilities ─────────────────────────────────────────────────────

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string): void {
  if (password.length < 8)
    throw new Error("パスワードは8文字以上で入力してください");
  if (!/[A-Z]/.test(password))
    throw new Error("パスワードには大文字を含めてください");
  if (!/[a-z]/.test(password))
    throw new Error("パスワードには小文字を含めてください");
  if (!/[0-9]/.test(password))
    throw new Error("パスワードには数字を含めてください");
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    throw new Error("正しいメールアドレスを入力してください");
}

// ─── User registration ──────────────────────────────────────────────────────

export async function registerUser(
  email: string,
  password: string,
  name: string
) {
  validateEmail(email);
  validatePassword(password);

  if (!name || name.trim().length < 1)
    throw new Error("お名前を入力してください");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("このメールアドレスは既に登録されています");

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name.trim(),
      emailVerified: true, // 開発環境ではメール確認をスキップ
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: user.id,
      actorType: "user",
      action: "user_registered",
      resourceType: "user",
      resourceId: user.id,
      newValues: JSON.stringify({ email, name }),
      status: "success",
    },
  });

  return { userId: user.id, message: "登録が完了しました" };
}

// ─── User retrieval ─────────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

// ─── Audit log ──────────────────────────────────────────────────────────────

export async function auditLog(data: {
  actorId?: string;
  actorType?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  oldValues?: object;
  newValues?: object;
  ipAddress?: string;
  status?: string;
  errorMessage?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        actorType: data.actorType ?? "system",
        action: data.action,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        oldValues: data.oldValues ? JSON.stringify(data.oldValues) : null,
        newValues: data.newValues ? JSON.stringify(data.newValues) : null,
        ipAddress: data.ipAddress,
        status: data.status ?? "success",
        errorMessage: data.errorMessage,
      },
    });
  } catch {
    // ログ失敗は握り潰す（メイン処理を妨げない）
    console.error("AuditLog failed:", data);
  }
}
