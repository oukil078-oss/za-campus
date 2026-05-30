import { ensureDatabase } from "@/lib/migrate";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth(["ADMIN"]);
    const [totalStudents, totalTeachers, totalAdmins, totalClasses, totalModules, totalQuizzes, totalVideos, totalFiles, banned, certificates] = await Promise.all([
      prisma.user.count({ where: { role: "STUDENT", isBanned: false } }),
      prisma.user.count({ where: { role: "TEACHER", isBanned: false } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.class.count(),
      prisma.module.count(),
      prisma.quiz.count(),
      prisma.video.count(),
      prisma.file.count(),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.certificate.count(),
    ]);
    return NextResponse.json({
      stats: { totalUsers: totalStudents+totalTeachers+totalAdmins, totalStudents, totalTeachers, totalAdmins, totalClasses, totalModules, totalQuizzes, totalVideos, totalFiles, banned, certificates },
    });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
