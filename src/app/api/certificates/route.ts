import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    let certs = await db.certificate.findMany({ orderBy: { issueDate: "desc" } });
    
    if (user.role === "STUDENT") {
      certs = certs.filter((c: any) => c.studentId === user.id);
    }
    
    // Enrich
    const enriched = await Promise.all(certs.map(async (c: any) => {
      const [studentUser, cls] = await Promise.all([
        db.user.findUnique({ where: { id: c.studentId } }),
        db.class.findUnique({ where: { id: c.classId } }),
      ]);
      return { ...c, student: studentUser || {}, class: cls || {}, score: parseFloat(c.score), maxScore: parseFloat(c.maxScore) };
    }));
    
    return NextResponse.json({ certificates: enriched });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
