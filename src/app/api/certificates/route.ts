import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    let where: any = {};
    if (user.role === "STUDENT") where = { studentId: user.id };
    else if (user.role === "TEACHER") {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (teacher) { const ids = (await prisma.classTeacher.findMany({ where: { teacherId: teacher.id } })).map(c => c.classId); where = { classId: { in: ids } }; }
    }
    const certificates = await prisma.certificate.findMany({
      where, include: { student: { select: { firstName: true, lastName: true, email: true } }, class: { select: { name: true, code: true } } }, orderBy: { issueDate: "desc" },
    });
    return NextResponse.json({ certificates });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
