import { NextRequest, NextResponse } from "next/server";
import { db, ID } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["ADMIN", "TEACHER"]);
    const data = await req.json();
    const id = data.id || ID.unique();
    await db.module.create({ data: { id, ...data, isPublished: data.isPublished ? "true" : "false" } });
    return NextResponse.json({ module: { id, ...data } }, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
