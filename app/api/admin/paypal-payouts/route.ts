import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createPayPalPayoutBatch } from "@/lib/paypal-payouts";

const payoutSchema = z.object({
  adminSecret: z.string().min(12),
  payouts: z
    .array(
      z.object({
        payoutId: z.string().min(3),
        email: z.string().email(),
        amount: z.string().regex(/^\d+(\.\d{2})$/),
        currency: z.string().length(3).default("EUR"),
        note: z.string().max(250).optional()
      })
    )
    .min(1)
    .max(500)
});

export async function POST(request: NextRequest) {
  const parsed = payoutSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.adminSecret !== process.env.ADMIN_PAYOUT_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await createPayPalPayoutBatch(parsed.data.payouts);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
