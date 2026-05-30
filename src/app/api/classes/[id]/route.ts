import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth();
    const { id } = await params;
    const cls: any = await db.class.findUnique({ where: { id } });
    if (!cls) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const [modules, classTeachers, classStudents, finalQuizzes] = await Promise.all([
      db.module.findMany({ where: { classId: id }, orderBy: { orderIndex: "asc" } }),
      db.classTeacher.findMany({ where: { classId: id } }),
      db.classStudent.findMany({ where: { classId: id } }),
      db.finalQuiz.findMany({ where: { classId: id } }),
    ]);

    const enrichedModules = await Promise.all(modules.map(async (mod: any) => {
      const [videos, files, quizzes] = await Promise.all([
        db.video.findMany({ where: { moduleId: mod.id }, orderBy: { orderIndex: "asc" } }),
        db.file.findMany({ where: { moduleId: mod.id }, orderBy: { orderIndex: "asc" } }),
        db.quiz.findMany({ where: { moduleId: mod.id } }),
      ]);
      const enrichedQuizzes = await Promise.all(quizzes.map(async (q: any) => ({ ...q, _count: { questions: (await db.quizQuestion.findMany({ where: { quizId: q.id } })).length } })));
      return { ...mod, videos, files, quizzes: enrichedQuizzes };
    }));

    const enrichedStudents = await Promise.all(classStudents.map(async (cs: any) => {
      const student: any = await db.student.findUnique({ where: { id: cs.studentId } });
      const user = student ? await db.user.findUnique({ where: { id: student.userId } }) : null;
      return { student: { ...student, user: user || {} } };
    }));

    const enrichedFinalQuizzes = await Promise.all(finalQuizzes.map(async (fq: any) => ({ ...fq, _count: { questions: (await db.finalQuizQuestion.findMany({ where: { finalQuizId: fq.id } })).length } })));

    return NextResponse.json({ class: { ...cls, modules: enrichedModules, students: enrichedStudents, finalQuizzes: enrichedFinalQuizzes, _count: { students: classStudents.length, modules: modules.length } } });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth(["ADMIN", "TEACHER"]); const { id } = await params; await db.class.update({ where: { id }, data: await req.json() }); return NextResponse.json({ success: true }); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth(["ADMIN"]); const { id } = await params; await db.class.delete({ where: { id } }); return NextResponse.json({ success: true }); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
