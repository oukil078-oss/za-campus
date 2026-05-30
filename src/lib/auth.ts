import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "./db";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "za-campus-super-secret-key-change-in-production-2024");
const COOKIE_NAME = "za-campus-token";

export async function hashPassword(p: string): Promise<string> { return bcrypt.hash(p, 12); }
export async function verifyPassword(p: string, h: string): Promise<boolean> { return bcrypt.compare(p, h); }
export async function createToken(payload: { userId: string; email: string; role: string }): Promise<string> {
  return new SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(JWT_SECRET);
}
export async function verifyToken(token: string) { try { const { payload } = await jwtVerify(token, JWT_SECRET); return payload as { userId: string; email: string; role: string }; } catch { return null; } }
export async function getSession() { const c = await cookies(); const token = c.get(COOKIE_NAME)?.value; if (!token) return null; return verifyToken(token); }

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const user = await db.user.findUnique({ where: { id: session.userId } });
  if (!user || user.isActive === "false" || user.isBanned === "true") return null;
  const [student, teacher, admin] = await Promise.all([
    db.student.findUnique({ where: { userId: user.id } }),
    db.teacher.findUnique({ where: { userId: user.id } }),
    db.admin.findUnique({ where: { userId: user.id } }),
  ]);
  return {
    id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName,
    avatarUrl: user.avatarUrl, role: user.role, isActive: user.isActive === "true",
    isBanned: user.isBanned === "true", createdAt: user.createdAt,
    student: student ? { id: student.id, studentNumber: student.studentNumber } : null,
    teacher: teacher ? { id: teacher.id, employeeId: teacher.employeeId, department: teacher.department } : null,
    admin: admin ? { id: admin.id, adminLevel: admin.adminLevel } : null,
  };
}
export async function setSessionCookie(token: string) { const c = await cookies(); c.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 60*60*24*7, path: "/" }); }
export async function clearSession() { const c = await cookies(); c.delete(COOKIE_NAME); }
export async function requireAuth(allowedRoles?: string[]) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (allowedRoles && !allowedRoles.includes(user.role)) throw new Error("Forbidden");
  return user;
}
