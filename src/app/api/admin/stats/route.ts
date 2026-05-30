import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    await requireAuth(["ADMIN"]);
    const [allUsers, allClasses, allModules, allQuizzes, allVideos, allFiles, allCerts] = await Promise.all([
      db.user.findMany({}), db.class.findMany({}), db.module.findMany({}), db.quiz.findMany({ where: {} }), db.video.findMany({ where: {} }), db.file.findMany({ where: {} }), db.certificate.findMany({}),
    ]);
    const stats = {
      totalStudents: allUsers.filter((u: any) => u.role === "STUDENT" && u.isBanned !== "true").length,
      totalTeachers: allUsers.filter((u: any) => u.role === "TEACHER" && u.isBanned !== "true").length,
      totalAdmins: allUsers.filter((u: any) => u.role === "ADMIN").length,
      totalUsers: allUsers.filter((u: any) => u.isBanned !== "true").length,
      totalClasses: allClasses.length, totalModules: allModules.length, totalQuizzes: allQuizzes.length,
      totalVideos: allVideos.length, totalFiles: allFiles.length,
      banned: allUsers.filter((u: any) => u.isBanned === "true").length,
      certificates: allCerts.length,
    };
    return NextResponse.json({ stats, recentUsers: allUsers.slice(-5) });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
