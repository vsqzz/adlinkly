import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminSecret } from "@/lib/authz";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

const approveSchema = z.object({
  payoutId: z.string().min(3),
  adminSecret: z.string().optional()
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = approveSchema.safeParse(body);
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

  const payout = await prisma.payout.update({
    where: { id: parsed.data.payoutId },
    data: { status: "APPROVED", reviewedAt: new Date() },
    include: { account: true }
  });

  return NextResponse.json({ payout });
}
