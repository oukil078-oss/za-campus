import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["ADMIN", "TEACHER"]);
    const data = await req.json();
    const mod = await prisma.module.create({ data });
    return NextResponse.json({ module: mod }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
