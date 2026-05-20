import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/admin/settings
export async function GET() {
  try {
    let settings = await prisma.businessSetting.findFirst();
    if (!settings) {
      settings = await prisma.businessSetting.create({
        data: { id: "default", businessName: "ReserveFlow" },
      });
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}

// PUT /api/admin/settings
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      businessName, businessPhone, businessEmail, businessAddress, businessWebsite,
      businessHours, holidays, bookingSettings, cancellationPolicy, notificationSettings,
    } = body;

    let settings = await prisma.businessSetting.findFirst();
    const data = {
      ...(businessName !== undefined && { businessName }),
      ...(businessPhone !== undefined && { businessPhone }),
      ...(businessEmail !== undefined && { businessEmail }),
      ...(businessAddress !== undefined && { businessAddress }),
      ...(businessWebsite !== undefined && { businessWebsite }),
      ...(businessHours !== undefined && { businessHours: JSON.stringify(businessHours) }),
      ...(holidays !== undefined && { holidays: JSON.stringify(holidays) }),
      ...(bookingSettings !== undefined && { bookingSettings: JSON.stringify(bookingSettings) }),
      ...(cancellationPolicy !== undefined && { cancellationPolicy: JSON.stringify(cancellationPolicy) }),
      ...(notificationSettings !== undefined && { notificationSettings: JSON.stringify(notificationSettings) }),
      updatedAt: new Date(),
    };

    if (settings) {
      settings = await prisma.businessSetting.update({ where: { id: settings.id }, data });
    } else {
      settings = await prisma.businessSetting.create({ data: { id: "default", businessName: "ReserveFlow", ...data } });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (e: unknown) {
    return NextResponse.json({ success: false, error: String(e) }, { status: 500 });
  }
}
