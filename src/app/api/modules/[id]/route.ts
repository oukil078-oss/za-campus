import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const mod = await prisma.module.findUnique({
      where: { id },
      include: {
        videos: { orderBy: { orderIndex: "asc" } },
        files: { orderBy: { orderIndex: "asc" } },
        quizzes: { include: { _count: { select: { questions: true } } } },
      },
    });
    if (!mod) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ module: mod });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(["ADMIN", "TEACHER"]);
    const { id } = await params;
    const data = await req.json();
    const mod = await prisma.module.update({ where: { id }, data });
    return NextResponse.json({ module: mod });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(["ADMIN", "TEACHER"]);
    const { id } = await params;
    await prisma.module.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
