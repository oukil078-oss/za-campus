import { NextRequest, NextResponse } from "next/server";
import { db, ID } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(["STUDENT"]);
    const { id } = await params;
    const { answers } = await req.json();
    const student = user.student;
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

    const fq = await db.finalQuiz.findUnique({ where: { id } });
    if (!fq) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const questions = await db.finalQuizQuestion.findMany({ where: { finalQuizId: id }, orderBy: { orderIndex: "asc" } });

    let totalScore = 0, totalPoints = 0;
    const attemptId = ID.unique();
    await db.finalQuizAttempt.create({
      data: { id: attemptId, finalQuizId: id, studentId: student.id, startedAt: new Date().toISOString(),
        attemptNumber: String((await db.finalQuizAttempt.findMany({ where: { finalQuizId: id, studentId: student.id } })).length + 1) }
    });

    for (const q of questions) {
      const sa = answers[q.id] || "", correct = sa === q.correctAnswer;
      const pts = correct ? parseFloat(q.points) : 0;
      totalScore += pts; totalPoints += parseFloat(q.points);
      await db.finalQuizAnswer.create({ data: { attemptId: attemptId, questionId: q.id, selectedAnswer: sa, isCorrect: correct ? "true" : "false", pointsEarned: String(pts) } });
    }

    const pct = Math.round((totalScore / totalPoints) * 100), score20 = Math.round((totalScore / totalPoints) * 20), passed = score20 >= 12;
    await db.finalQuizAttempt.update({
      where: { id: attemptId },
      data: { submittedAt: new Date().toISOString(), score: String(score20), totalPoints: "20", percentage: String(pct), isPassed: passed ? "true" : "false" }
    });

    await db.grade.create({ data: { studentId: student.id, classId: fq.classId, type: "FINAL_QUIZ", score: String(score20), maxScore: "20", percentage: String(pct), isPassed: passed ? "true" : "false" } });

    if (passed) {
      const cls: any = await db.class.findUnique({ where: { id: fq.classId } });
      const certNum = "CERT-" + (cls?.code || "XX") + "-" + student.id.slice(0, 8).toUpperCase();
      const existing = await db.certificate.findFirst({ where: { studentId: user.id, classId: fq.classId } });
      if (!existing) {
        await db.certificate.create({ data: { studentId: user.id, classId: fq.classId, finalAttemptId: attemptId, certificateNumber: certNum, score: String(score20), maxScore: "20", status: "ISSUED", issueDate: new Date().toISOString() } });
      }
      await db.notification.create({ data: { userId: user.id, title: "Certificate Earned!", message: "Passed with " + score20 + "/20!", type: "CERTIFICATE_EARNED" } });
    }

    return NextResponse.json({ attempt: { score: score20, totalPoints: 20, percentage: pct, isPassed: passed }, passed });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
