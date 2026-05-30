import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, createToken, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    
    const user = await db.user.findFirst({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    if (user.isBanned === "true") return NextResponse.json({ error: "Account is banned" }, { status: 403 });
    
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date().toISOString() } });
    const token = await createToken({ userId: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);
    
    return NextResponse.json({ user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } });
  } catch (e: any) { 
    console.error("Login error:", e.message, e.stack); 
    return NextResponse.json({ error: "Login failed: " + (e.message || "Unknown") }, { status: 500 }); 
  }
}
