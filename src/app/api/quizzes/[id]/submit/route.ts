import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(["STUDENT"]);
    const { id } = await params;
    const { answers } = await req.json();

    const student = await prisma.student.findUnique({ where: { userId: user.id } });
    if (!student) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true, module: { select: { classId: true } } },
    });
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    let totalScore = 0;
    let totalPoints = 0;
    const answerResults: any[] = [];

    // Create attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: id, studentId: student.id, startedAt: new Date(),
        attemptNumber: (await prisma.quizAttempt.count({ where: { quizId: id, studentId: student.id } })) + 1,
      },
    });

    for (const q of quiz.questions) {
      const studentAnswer = answers[q.id] || "";
      const correct = studentAnswer === q.correctAnswer;
      const points = correct ? q.points : 0;
      totalScore += points;
      totalPoints += q.points;

      await prisma.quizAnswer.create({
        data: {
          attemptId: attempt.id, questionId: q.id,
          selectedAnswer: studentAnswer, isCorrect: correct, pointsEarned: points,
        },
      });

      answerResults.push({
        questionId: q.id, questionText: q.questionText,
        correctAnswer: q.correctAnswer, yourAnswer: studentAnswer,
        isCorrect: correct, points,
      });
    }

    const percentage = Math.round((totalScore / totalPoints) * 100);
    const isPassed = percentage >= quiz.passingScore;

    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: { submittedAt: new Date(), score: totalScore, totalPoints, percentage, isPassed, timeSpent: 600 },
    });

    // Create grade
    await prisma.grade.create({
      data: {
        studentId: student.id, classId: quiz.module.classId, moduleId: quiz.moduleId,
        quizId: id, type: "MODULE_QUIZ", score: totalScore, maxScore: totalPoints,
        percentage, isPassed,
      },
    });

    // Update leaderboard
    const grades = await prisma.grade.findMany({ where: { studentId: student.id, classId: quiz.module.classId } });
    const avgPercent = grades.reduce((s, g) => s + g.percentage, 0) / grades.length;
    await prisma.leaderboard.upsert({
      where: { classId_studentId_period: { classId: quiz.module.classId, studentId: student.id, period: "ALL_TIME" } },
      update: { totalScore: avgPercent },
      create: { classId: quiz.module.classId, studentId: student.id, totalScore: avgPercent, period: "ALL_TIME" },
    });

    // Notification
    await prisma.notification.create({
      data: {
        userId: user.id, title: "Quiz Graded",
        message: `You scored ${totalScore}/${totalPoints} (${percentage}%) on "${quiz.title}". ${isPassed ? "Passed!" : "Keep trying!"}`,
        type: "QUIZ_GRADED",
      },
    });

    return NextResponse.json({ attempt: { score: totalScore, totalPoints, percentage, isPassed }, results: answerResults });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
