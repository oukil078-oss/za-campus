import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        modules: { orderBy: { orderIndex: "asc" }, include: { _count: { select: { videos: true, files: true, quizzes: true } } } },
        teachers: { include: { teacher: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } } } },
        students: { include: { student: { include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } } } } },
        _count: { select: { modules: true, students: true } },
      },
    });
    if (!cls) return NextResponse.json({ error: "Class not found" }, { status: 404 });
    return NextResponse.json({ class: cls });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(["ADMIN", "TEACHER"]);
    const { id } = await params;
    const data = await req.json();
    const cls = await prisma.class.update({ where: { id }, data });
    return NextResponse.json({ class: cls });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(["ADMIN"]);
    const { id } = await params;
    await prisma.class.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
