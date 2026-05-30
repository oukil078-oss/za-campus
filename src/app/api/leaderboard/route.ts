import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ leaderboard: [] });
    
    const entries = await db.leaderboard.findMany({ orderBy: { totalScore: "desc" }, take: 50 });
    
    const enriched = await Promise.all(entries.map(async (e: any) => {
      const student = await db.student.findUnique({ where: { id: e.studentId } });
      const studentUser = student ? await db.user.findUnique({ where: { id: student.userId } }) : null;
      const cls = await db.class.findUnique({ where: { id: e.classId } });
      return { ...e, student: { ...student, user: studentUser || {} }, class: cls, totalScore: parseFloat(e.totalScore), rank: parseInt(e.rank) };
    }));
    
    return NextResponse.json({ leaderboard: enriched.sort((a: any, b: any) => b.totalScore - a.totalScore) });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
