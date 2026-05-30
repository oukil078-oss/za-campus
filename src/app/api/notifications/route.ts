import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try { const user = await requireAuth(); const items = await db.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 }); const unread = items.filter((n: any) => n.isRead !== "true").length; return NextResponse.json({ notifications: items, unreadCount: unread }); } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { id, markAllRead } = await req.json();
    if (markAllRead) {
      await db.notification.updateMany({ where: { userId: user.id, isRead: "false" }, data: { isRead: "true" } });
    } else if (id) {
      await db.notification.update({ where: { id }, data: { isRead: "true" } });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
