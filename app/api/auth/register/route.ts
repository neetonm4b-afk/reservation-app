import { NextResponse } from "next/server";
import { registerUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();
    const result = await registerUser(email, password, name);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "登録に失敗しました";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
