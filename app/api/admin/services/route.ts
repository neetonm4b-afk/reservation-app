import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: services });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

// POST /api/admin/services
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, category, price, durationMinutes, colorTag, maxCapacity } = body;

    if (!name || !price || !durationMinutes)
      return NextResponse.json({ success: false, error: "name, price, durationMinutes は必須です" }, { status: 400 });

    const last = await prisma.service.findFirst({ orderBy: { displayOrder: "desc" } });
    const service = await prisma.service.create({
      data: {
        name,
        description: description ?? null,
        category: category ?? null,
        price: Number(price),
        durationMinutes: Number(durationMinutes),
        colorTag: colorTag ?? null,
        maxCapacity: Number(maxCapacity ?? 1),
        displayOrder: (last?.displayOrder ?? 0) + 1,
      },
    });
    return NextResponse.json({ success: true, data: service }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
