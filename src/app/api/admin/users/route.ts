import { ensureDatabase } from "@/lib/migrate";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, hashPassword } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await requireAuth(["ADMIN"]);
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");
    const banned = searchParams.get("banned");

    const where: any = {};
    if (role) where.role = role;
    if (banned === "true") where.isBanned = true;
    if (banned === "false") where.isBanned = false;
    if (search) {
      where.OR = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, isActive: true, isBanned: true, banReason: true,
        lastLoginAt: true, createdAt: true,
        student: { select: { studentNumber: true } },
        teacher: { select: { employeeId: true, department: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "Unauthorized" ? 401 : e.message === "Forbidden" ? 403 : 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth(["ADMIN"]);
    const data = await req.json();
    const passwordHash = await hashPassword(data.password || "password123");

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || "STUDENT",
        ...(data.role === "STUDENT" ? {
          student: { create: { studentNumber: data.studentNumber || `STU-${Date.now()}` } }
        } : data.role === "TEACHER" ? {
          teacher: { create: { employeeId: data.employeeId || `EMP-${Date.now()}`, department: data.department } }
        } : data.role === "ADMIN" ? {
          admin: { create: { adminLevel: "STANDARD" } }
        } : {}),
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
