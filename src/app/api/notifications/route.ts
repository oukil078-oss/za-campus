import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    const notifications = await prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 50 });
    const unreadCount = await prisma.notification.count({ where: { userId: user.id, isRead: false } });
    return NextResponse.json({ notifications, unreadCount });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { id, markAllRead } = await req.json();
    if (markAllRead) await prisma.notification.updateMany({ where: { userId: user.id, isRead: false }, data: { isRead: true } });
    else if (id) await prisma.notification.update({ where: { id }, data: { isRead: true } });
    return NextResponse.json({ success: true });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
