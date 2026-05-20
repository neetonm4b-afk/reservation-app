import { NextResponse } from "next/server";
import { auth } from "@/lib/next-auth";
import { prisma } from "@/lib/db";

// GET /api/bookings/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id)
      return NextResponse.json({ success: false, error: "ログインが必要です" }, { status: 401 });

    const { id } = await params;
    const booking = await prisma.booking.findFirst({
      where: { id, userId: session.user.id, deletedAt: null },
      include: { service: true, staff: true, payments: true },
    });

    if (!booking)
      return NextResponse.json({ success: false, error: "予約が見つかりません" }, { status: 404 });

    return NextResponse.json({ success: true, data: booking });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
