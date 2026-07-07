import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { isAdminSecret } from "@/lib/authz";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { platformConfig } from "@/lib/platform";

const campaignSchema = z.object({
  adminSecret: z.string().optional(),
  sponsorName: z.string().min(2).max(100),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(240),
  targetUrl: z.string().url(),
  placement: z.string().default("unlock_primary"),
  payoutType: z.enum(["CPM", "CPC", "FLAT", "AFFILIATE"]).default("CPC"),
  budgetCents: z.number().int().positive(),
  creatorShareBps: z.number().int().min(0).max(9000).default(platformConfig.defaultCreatorShareBps)
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = campaignSchema.safeParse(body);
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

  const campaign = await prisma.sponsorCampaign.create({
    data: {
      sponsorName: parsed.data.sponsorName,
      title: parsed.data.title,
      description: parsed.data.description,
      targetUrl: parsed.data.targetUrl,
      placement: parsed.data.placement,
      payoutType: parsed.data.payoutType,
      budgetCents: parsed.data.budgetCents,
      creatorShareBps: parsed.data.creatorShareBps
    }
  });

  return NextResponse.json({ campaign });
}

export async function GET() {
  if (!hasDatabaseUrl()) {
    return NextResponse.json({ campaigns: [] });
  }

  const campaigns = await prisma.sponsorCampaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return NextResponse.json({ campaigns });
}
