import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
export async function POST(req: NextRequest) { try { await requireAuth(["ADMIN","TEACHER"]); const d = await req.json(); const v = await prisma.video.create({data:d}); return NextResponse.json({video:v},{status:201}); } catch(e:any) { return NextResponse.json({error:e.message},{status:500}); } }
