import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/bookings
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { deletedAt: null };
    if (status) where.status = status;
    if (date) where.bookingDate = date;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } }, service: true, staff: true },
        orderBy: [{ bookingDate: "desc" }, { bookingTime: "asc" }],
        skip,
        take: limit,
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
