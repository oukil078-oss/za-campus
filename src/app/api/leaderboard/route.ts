import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ leaderboard: [] });
    let where: any = {};
    if (user.role === "STUDENT") {
      const student = await prisma.student.findUnique({ where: { userId: user.id } });
      if (student) { const ids = (await prisma.classStudent.findMany({ where: { studentId: student.id } })).map(c => c.classId); where = { classId: { in: ids } }; }
    }
    if (user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (teacher) { const ids = (await prisma.classTeacher.findMany({ where: { teacherId: teacher.id } })).map(c => c.classId); where = { classId: { in: ids } }; }
    }
    const entries = await prisma.leaderboard.findMany({ where, orderBy: { totalScore: "desc" }, take: 50 });
    const enriched = await Promise.all(entries.map(async (e) => {
      const student = await prisma.student.findUnique({ where: { id: e.studentId }, include: { user: { select: { firstName: true, lastName: true, email: true } } } });
      const cls = await prisma.class.findUnique({ where: { id: e.classId }, select: { name: true, code: true } });
      return { ...e, student: student ? { ...student, user: student.user } : null, class: cls };
    }));
    return NextResponse.json({ leaderboard: enriched });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
