import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const q = req.nextUrl.searchParams.get("q") || "";
    if (!q || q.length < 2) return NextResponse.json({ results: [] });

    const results: any[] = [];
    
    // Search users (admin only)
    if (user.role === "ADMIN") {
      const users = await db.user.findMany({});
      results.push(...users.filter((u: any) => 
        u.firstName?.toLowerCase().includes(q.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(q.toLowerCase()) ||
        u.email?.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 5).map((u: any) => ({ ...u, type: "user" })));
    }

    // Search classes
    const classes = await db.class.findMany({});
    results.push(...classes.filter((c: any) =>
      c.name?.toLowerCase().includes(q.toLowerCase()) ||
      c.code?.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 5).map((c: any) => ({ ...c, type: "class" })));

    // Search modules
    const modules = await db.module.findMany({});
    results.push(...modules.filter((m: any) =>
      m.title?.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 5).map((m: any) => ({ ...m, type: "module" })));

    return NextResponse.json({ results: results.slice(0, 15) });
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
