import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let classes;
    if (user.role === "ADMIN") {
      classes = await db.class.findMany({
        where: search ? { name: { contains: search } } : {},
        include: {
          teachers: { include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } },
          _count: { select: { students: true, modules: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (user.role === "TEACHER") {
      classes = await db.class.findMany({
        where: {
          ...(search ? { name: { contains: search } } : {}),
          teachers: { some: { teacher: { userId: user.id } } },
        },
        include: {
          teachers: { include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } },
          _count: { select: { students: true, modules: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      classes = await db.class.findMany({
        where: {
          ...(search ? { name: { contains: search } } : {}),
          isPublished: true,
          students: { some: { student: { userId: user.id } } },
        },
        include: {
          teachers: { include: { teacher: { include: { user: { select: { firstName: true, lastName: true } } } } } },
          _count: { select: { students: true, modules: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ classes });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(["ADMIN", "TEACHER"]);
    const data = await req.json();
    const cls = await db.class.create({
      data: {
        name: data.name, code: data.code, description: data.description,
        category: data.category, semester: data.semester, academicYear: data.academicYear,
        maxStudents: data.maxStudents, isPublished: data.isPublished,
        ...(data.teacherId ? { teachers: { create: { teacherId: data.teacherId } } } : {}),
      },
    });
    return NextResponse.json({ class: cls }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
