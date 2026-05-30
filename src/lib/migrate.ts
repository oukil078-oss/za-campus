import { PrismaClient } from "@prisma/client";

let migrated = false;

export async function ensureDatabase() {
  if (migrated) return;
  const prisma = new PrismaClient();
  try {
    // Test connection
    await prisma.$queryRaw`SELECT 1`;
    migrated = true;
    console.log("Database connection verified");
  } catch (e) {
    console.error("Database connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}
