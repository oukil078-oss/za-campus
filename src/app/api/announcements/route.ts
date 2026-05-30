import { NextRequest, NextResponse } from "next/server";
import { db, ID } from "@/lib/db";
import { requireAuth, getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const items = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 });
    return NextResponse.json({ announcements: items });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(["ADMIN"]);
    const { title, message } = await req.json();
    const allUsers = await db.user.findMany({});
    for (const u of allUsers) {
      await db.notification.create({ data: { id: ID.unique(), userId: u.id, title: title || "Announcement", message: message || "", type: "SYSTEM", isRead: "false", createdAt: new Date().toISOString() } });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
