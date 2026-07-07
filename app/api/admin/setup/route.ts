import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminSecret, sha256 } from "@/lib/authz";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

const setupSchema = z.object({
  adminSecret: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(2).max(80).default("Adlinkly Creator"),
  handle: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_-]+$/)
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = setupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const headerSecret = request.headers.get("x-admin-secret");
  if (!isAdminSecret(headerSecret) && !isAdminSecret(parsed.data.adminSecret || null)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!hasDatabaseUrl()) {
    return NextResponse.json({ error: "DATABASE_URL is required" }, { status: 400 });
  }

  const apiToken = `adl_${randomBytes(24).toString("hex")}`;
  const user = await prisma.user.upsert({
    where: { email: parsed.data.email },
    update: { role: "CREATOR", name: parsed.data.name },
    create: {
      email: parsed.data.email,
      name: parsed.data.name,
      role: "CREATOR",
      referralCode: parsed.data.handle.toLowerCase()
    }
  });

  await prisma.creatorProfile.upsert({
    where: { userId: user.id },
    update: { handle: parsed.data.handle },
    create: { userId: user.id, handle: parsed.data.handle }
  });

  await prisma.apiKey.create({
    data: {
      userId: user.id,
      name: "Default creator API key",
      keyHash: sha256(apiToken)
    }
  });

  return NextResponse.json({
    userId: user.id,
    apiToken,
    warning: "Save this API token now. It is only returned once."
  });
}
