import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireCreatorFromApiKey } from "@/lib/authz";
import { requestPayout } from "@/lib/payouts";

const requestSchema = z.object({
  paypalEmail: z.string().email(),
  amountCents: z.number().int().positive()
});

export async function POST(request: NextRequest) {
  const creator = await requireCreatorFromApiKey(request.headers);
  if (!creator) {
    return NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 });
  }

  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const payout = await requestPayout({
      userId: creator.id,
      paypalEmail: parsed.data.paypalEmail,
      amountCents: parsed.data.amountCents
    });
    return NextResponse.json({ payout });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Payout request failed" }, { status: 400 });
  }
}
