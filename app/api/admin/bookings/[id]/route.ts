import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT /api/admin/bookings/[id]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, staffNotes } = body;

    const old = await prisma.booking.findUnique({ where: { id } });
    if (!old)
      return NextResponse.json({ success: false, error: "予約が見つかりません" }, { status: 404 });

    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (status !== undefined) {
      const validStatuses = ["pending", "confirmed", "completed", "cancelled", "no_show"];
      if (!validStatuses.includes(status))
        return NextResponse.json({ success: false, error: "無効なステータスです" }, { status: 400 });
      updateData.status = status;
    }

    if (staffNotes !== undefined) {
      updateData.staffNotes = staffNotes;
    }

    const updated = await prisma.booking.update({ where: { id }, data: updateData });

    if (status !== undefined && status !== old.status) {
      await prisma.auditLog.create({
        data: {
          actorType: "admin",
          action: "booking_status_changed",
          resourceType: "booking",
          resourceId: id,
          oldValues: JSON.stringify({ status: old.status }),
          newValues: JSON.stringify({ status }),
          status: "success",
        },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "更新に失敗しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}


// GET /api/admin/bookings/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        service: true,
        staff: true,
        payments: true,
      },
    });

    if (!booking)
      return NextResponse.json({ success: false, error: "予約が見つかりません" }, { status: 404 });

    return NextResponse.json({ success: true, data: booking });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
