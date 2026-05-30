import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(["STUDENT"]);
    const { id } = await params;
    const { answers } = await req.json();
    const student = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });
    const fq = await prisma.finalQuiz.findUnique({ where: { id }, include: { questions: true, class: true } });
    if (!fq) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let totalScore = 0, totalPoints = 0;
    const attempt = await prisma.finalQuizAttempt.create({ data: { finalQuizId: id, studentId: student.id, startedAt: new Date(), attemptNumber: (await prisma.finalQuizAttempt.count({ where: { finalQuizId: id, studentId: student.id } })) + 1 } });

    for (const q of fq.questions) {
      const sa = answers[q.id] || "", correct = sa === q.correctAnswer, pts = correct ? q.points : 0;
      totalScore += pts; totalPoints += q.points;
      await prisma.finalQuizAnswer.create({ data: { attemptId: attempt.id, questionId: q.id, selectedAnswer: sa, isCorrect: correct, pointsEarned: pts } });
    }

    const pct = Math.round((totalScore / totalPoints) * 100), score20 = Math.round((totalScore / totalPoints) * 20), passed = score20 >= 12;
    await prisma.finalQuizAttempt.update({ where: { id: attempt.id }, data: { submittedAt: new Date(), score: score20, totalPoints: 20, percentage: pct, isPassed: passed } });
    await prisma.grade.create({ data: { studentId: student.id, classId: fq.classId, type: "FINAL_QUIZ", score: score20, maxScore: 20, percentage: pct, isPassed: passed } });

    if (passed) {
      const certNum = "CERT-"+fq.class.code+"-"+student.id.slice(0,8).toUpperCase();
      const existing = await prisma.certificate.findFirst({ where: { studentId: user.id, classId: fq.classId } });
      if (!existing) await prisma.certificate.create({ data: { studentId: user.id, classId: fq.classId, finalAttemptId: attempt.id, certificateNumber: certNum, score: score20, maxScore: 20, status: "ISSUED" } });
      await prisma.notification.create({ data: { userId: user.id, title: "Certificate Earned!", message: 'Passed "'+fq.class.name+'" with '+score20+'/20!', type: "CERTIFICATE_EARNED", link: "/student/certificates" } });
    }

    return NextResponse.json({ attempt: { score: score20, totalPoints: 20, percentage: pct, isPassed: passed }, passed });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
