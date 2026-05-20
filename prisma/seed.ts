import { PrismaClient } from "../lib/generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Business settings
  const existing = await prisma.businessSetting.findFirst();
  if (!existing) {
    await prisma.businessSetting.create({
      data: {
        id: "default",
        businessName: "ReserveFlow サンプル店",
        businessPhone: "03-1234-5678",
        businessEmail: "info@reserveflow.example.com",
        businessAddress: "東京都渋谷区サンプル町1-2-3",
      },
    });
    console.log("✓ Business settings created");
  }

  // Services
  const servicesCount = await prisma.service.count();
  if (servicesCount === 0) {
    const serviceData = [
      { name: "カット", description: "シャンプー・ブロー込みのスタンダードカット", category: "hair", price: 5500, durationMinutes: 60, displayOrder: 1, colorTag: "#3B82F6" },
      { name: "カラー", description: "全体カラー。仕上がりのツヤと発色にこだわります", category: "hair", price: 8800, durationMinutes: 120, displayOrder: 2, colorTag: "#EC4899" },
      { name: "パーマ", description: "ナチュラルから強めまでご要望に合わせてスタイリング", category: "hair", price: 12100, durationMinutes: 150, displayOrder: 3, colorTag: "#8B5CF6" },
      { name: "ヘッドスパ", description: "頭皮をしっかりほぐすリラクゼーションコース", category: "spa", price: 3300, durationMinutes: 45, displayOrder: 4, colorTag: "#10B981" },
      { name: "トリートメント", description: "傷んだ髪を集中補修するサロン専売トリートメント", category: "hair", price: 4400, durationMinutes: 30, displayOrder: 5, colorTag: "#F59E0B" },
    ];
    for (const s of serviceData) {
      await prisma.service.create({ data: s });
    }
    console.log(`✓ ${serviceData.length} services created`);
  }

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminExists) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "Admin1234!", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "管理者",
        emailVerified: true,
      },
    });
    console.log(`✓ Admin user created: ${adminEmail}`);
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
