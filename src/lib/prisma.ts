// Appwrite adapter (replaces Prisma)
import { db } from "./db";
export { db };
export const prisma = db;
