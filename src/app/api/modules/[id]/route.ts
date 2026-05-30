import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(); const { id } = await params;
    const mod = await db.module.findUnique({ where: { id } });
    if (!mod) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const [videos, files, quizzes] = await Promise.all([
      db.video.findMany({ where: { moduleId: id }, orderBy: { orderIndex: "asc" } }),
      db.file.findMany({ where: { moduleId: id }, orderBy: { orderIndex: "asc" } }),
      db.quiz.findMany({ where: { moduleId: id } }),
    ]);
    return NextResponse.json({ module: { ...mod, videos, files, quizzes } });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth(["ADMIN","TEACHER"]); const { id } = await params; await db.module.update({ where: { id }, data: await req.json() }); return NextResponse.json({ success: true }); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth(["ADMIN","TEACHER"]); const { id } = await params; await db.module.delete({ where: { id } }); return NextResponse.json({ success: true }); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
