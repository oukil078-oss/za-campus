import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const quiz = await db.quiz.findUnique({ where: { id } });
    if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const [questions, mod] = await Promise.all([
      db.quizQuestion.findMany({ where: { quizId: id }, orderBy: { orderIndex: "asc" } }),
      db.module.findUnique({ where: { id: quiz.moduleId } }),
    ]);
    const student = user.student;
    const attempts = student ? await db.quizAttempt.findMany({ where: { quizId: id, studentId: student.id }, orderBy: { startedAt: "desc" }, take: 5 }) : [];
    return NextResponse.json({ quiz: { ...quiz, questions, module: mod || { title: "", classId: "" } }, attempts });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
