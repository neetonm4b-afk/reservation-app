import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  timeToMinutes,
  minutesToTime,
  getDayName,
  isHoliday,
} from "@/lib/utils";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const serviceId = searchParams.get("serviceId");
    const date = searchParams.get("date"); // YYYY-MM-DD

    if (!serviceId || !date)
      return NextResponse.json(
        { success: false, error: "serviceId と date は必須です" },
        { status: 400 }
      );

    const service = await prisma.service.findUnique({
      where: { id: serviceId, isActive: true },
    });
    if (!service)
      return NextResponse.json(
        { success: false, error: "サービスが見つかりません" },
        { status: 404 }
      );

    const settings = await prisma.businessSetting.findFirst();
    if (!settings)
      return NextResponse.json({ success: true, data: { slots: [] } });

    const businessHours = JSON.parse(settings.businessHours) as Record<
      string,
      { open: string; close: string; closed: boolean }
    >;
    const holidays = JSON.parse(settings.holidays) as { date: string }[];
    const bookingSettings = JSON.parse(settings.bookingSettings) as {
      slotDuration: number;
      maxConcurrentBookings: number;
    };

    const dayName = getDayName(new Date(date + "T00:00:00"));
    const daySchedule = businessHours[dayName];

    if (!daySchedule || daySchedule.closed) {
      return NextResponse.json({ success: true, data: { slots: [] } });
    }

    if (isHoliday(date, holidays)) {
      return NextResponse.json({ success: true, data: { slots: [] } });
    }

    const openMinutes = timeToMinutes(daySchedule.open);
    const closeMinutes = timeToMinutes(daySchedule.close);
    const duration = service.durationMinutes;

    // その日の確定済み予約を取得
    const existingBookings = await prisma.booking.findMany({
      where: {
        bookingDate: date,
        serviceId,
        status: { in: ["pending", "confirmed"] },
      },
    });

    const slots: {
      startTime: string;
      endTime: string;
      available: boolean;
      capacityRemaining: number;
    }[] = [];

    for (
      let start = openMinutes;
      start + duration <= closeMinutes;
      start += 15
    ) {
      const startTime = minutesToTime(start);
      const endTime = minutesToTime(start + duration);

      const overlapping = existingBookings.filter((b) => {
        const bStart = timeToMinutes(b.bookingTime);
        const bEnd = bStart + service.durationMinutes;
        return bStart < start + duration && bEnd > start;
      });

      const capacity = bookingSettings.maxConcurrentBookings;
      const remaining = capacity - overlapping.length;

      slots.push({
        startTime,
        endTime,
        available: remaining > 0,
        capacityRemaining: Math.max(0, remaining),
      });
    }

    return NextResponse.json({ success: true, data: { slots } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "エラーが発生しました";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
