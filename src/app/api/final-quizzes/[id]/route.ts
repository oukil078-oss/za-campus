import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const fq = await db.finalQuiz.findUnique({ where: { id } });
    if (!fq) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const questions = await db.finalQuizQuestion.findMany({ where: { finalQuizId: id }, orderBy: { orderIndex: "asc" } });
    const cls = await db.class.findUnique({ where: { id: fq.classId } });
    return NextResponse.json({ finalQuiz: { ...fq, questions, class: cls || { id: "", name: "", code: "" } } });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
