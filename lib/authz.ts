import { createHash, timingSafeEqual } from "crypto";
import { prisma, hasDatabaseUrl } from "@/lib/prisma";

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isAdminSecret(value: string | null) {
  const expected = process.env.ADMIN_API_SECRET || process.env.ADMIN_PAYOUT_SECRET;
  if (!expected || !value) return false;
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function bearerToken(headers: Headers) {
  const header = headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

export async function requireCreatorFromApiKey(headers: Headers) {
  const token = bearerToken(headers);
  if (!token) return null;

  if (isAdminSecret(token)) {
    return { id: process.env.DEFAULT_CREATOR_ID || "demo_creator", admin: true };
  }

  if (!hasDatabaseUrl()) return null;

  const keyHash = sha256(token);
  const apiKey = await prisma.apiKey.findUnique({ where: { keyHash } });
  if (!apiKey) return null;

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }
  });

  return { id: apiKey.userId, admin: false };
}
