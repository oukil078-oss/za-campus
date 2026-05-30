import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth(["ADMIN"]); const { id } = await params; const data = await req.json(); await db.user.update({ where: { id }, data }); return NextResponse.json({ success: true }); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await requireAuth(["ADMIN"]); const { id } = await params; await db.user.delete({ where: { id } }); return NextResponse.json({ success: true }); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
