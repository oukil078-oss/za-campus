import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    const { id } = await params;
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { orderIndex: "asc" }, select: { id: true, questionText: true, questionType: true, options: true, points: true, orderIndex: true } },
        module: { select: { title: true, classId: true } },
      },
    });
    if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    // Get previous attempts
    const student = await prisma.student.findUnique({ where: { userId: user.id } });
    const attempts = student ? await prisma.quizAttempt.findMany({
      where: { quizId: id, studentId: student.id },
      orderBy: { startedAt: "desc" },
      take: 5,
    }) : [];

    return NextResponse.json({ quiz, attempts });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
