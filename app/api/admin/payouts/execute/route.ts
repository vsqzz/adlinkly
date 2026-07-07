import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminSecret } from "@/lib/authz";
import { createPayPalPayoutBatch } from "@/lib/paypal-payouts";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

const executeSchema = z.object({
  payoutIds: z.array(z.string().min(3)).min(1).max(500),
  adminSecret: z.string().optional()
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = executeSchema.safeParse(body);
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

  const payouts = await prisma.payout.findMany({
    where: { id: { in: parsed.data.payoutIds }, status: "APPROVED" },
    include: { account: true }
  });

  if (payouts.length === 0) {
    return NextResponse.json({ error: "No approved payouts found" }, { status: 400 });
  }

  const result = await createPayPalPayoutBatch(
    payouts.map((payout) => ({
      payoutId: payout.id,
      email: payout.account.externalId || "",
      amount: (payout.amountCents / 100).toFixed(2),
      currency: "EUR"
    }))
  );

  if (!result.ok) {
    return NextResponse.json(result, { status: 502 });
  }

  const batchId = result.data?.batch_header?.payout_batch_id;
  await prisma.payout.updateMany({
    where: { id: { in: payouts.map((payout) => payout.id) } },
    data: { status: "SCHEDULED", paypalBatchId: batchId }
  });

  return NextResponse.json({ result, payoutIds: payouts.map((payout) => payout.id) });
}
