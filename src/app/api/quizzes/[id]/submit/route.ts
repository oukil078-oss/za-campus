import { NextRequest, NextResponse } from "next/server";
import { db, ID, Query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(["STUDENT"]);
    const { id } = await params;
    const { answers } = await req.json();
    const student = user.student;
    if (!student) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

    const quiz = await db.quiz.findUnique({ where: { id } });
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    const questions = await db.quizQuestion.findMany({ where: { quizId: id } });

    let totalScore = 0, totalPoints = 0;
    const attemptId = ID.unique();

    await db.quizAttempt.create({
      data: { id: attemptId, quizId: id, studentId: student.id, startedAt: new Date().toISOString(),
        attemptNumber: String((await db.quizAttempt.findMany({ where: { quizId: id, studentId: student.id } })).length + 1) }
    });

    const answerResults: any[] = [];
    for (const q of questions) {
      const studentAnswer = answers[q.id] || "", correct = studentAnswer === q.correctAnswer;
      const points = correct ? parseFloat(q.points) : 0;
      totalScore += points; totalPoints += parseFloat(q.points);
      await db.quizAnswer.create({
        data: { attemptId: attemptId, questionId: q.id, selectedAnswer: studentAnswer, isCorrect: correct ? "true" : "false", pointsEarned: String(points) }
      });
      answerResults.push({ questionId: q.id, questionText: q.questionText, correctAnswer: q.correctAnswer, yourAnswer: studentAnswer, isCorrect: correct, points });
    }

    const percentage = Math.round((totalScore / totalPoints) * 100);
    const isPassed = percentage >= parseFloat(quiz.passingScore);
    await db.quizAttempt.update({
      where: { id: attemptId },
      data: { submittedAt: new Date().toISOString(), score: String(totalScore), totalPoints: String(totalPoints), percentage: String(percentage), isPassed: isPassed ? "true" : "false", timeSpent: "600" }
    });

    // Create grade
    const mod = await db.module.findUnique({ where: { id: quiz.moduleId } });
    await db.grade.create({
      data: { studentId: student.id, classId: mod?.classId || "",
        moduleId: quiz.moduleId, quizId: id, type: "MODULE_QUIZ", score: String(totalScore), maxScore: String(totalPoints), percentage: String(percentage), isPassed: isPassed ? "true" : "false" }
    });

    return NextResponse.json({ attempt: { score: totalScore, totalPoints, percentage, isPassed }, results: answerResults });
  } catch (e: any) { console.error("Submit error:", e.message); return NextResponse.json({ error: e.message }, { status: 500 }); }
}
