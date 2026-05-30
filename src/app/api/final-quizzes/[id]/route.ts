import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const fq = await prisma.finalQuiz.findUnique({ where: { id }, include: { questions: { orderBy: { orderIndex: "asc" } }, class: { select: { id: true, name: true, code: true } } } });
    if (!fq) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ finalQuiz: fq });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
