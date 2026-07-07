import { createHash } from "crypto";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { getUnlockCampaign } from "@/lib/ads";
import { creatorShareCents } from "@/lib/money";
import { platformConfig } from "@/lib/platform";

export function hashIp(ip: string | null) {
  if (!ip) return null;
  const secret = process.env.IP_HASH_SECRET || process.env.ADLINKLY_SIGNING_SECRET || "development";
  return createHash("sha256").update(`${secret}:${ip}`).digest("hex");
}

export async function selectCampaign() {
  if (!hasDatabaseUrl()) return null;

  const campaign = await prisma.sponsorCampaign.findFirst({
    where: { active: true, placement: "unlock_primary" },
    orderBy: { createdAt: "desc" }
  });

  return campaign;
}

export async function recordAdImpression(input: {
  campaignId?: string | null;
  slug?: string | null;
  visitorId?: string | null;
}) {
  if (!hasDatabaseUrl()) return null;

  const campaign =
    (input.campaignId ? await prisma.sponsorCampaign.findUnique({ where: { id: input.campaignId } }) : null) ||
    (await selectCampaign());

  if (!campaign) return null;

  const link = input.slug ? await prisma.link.findUnique({ where: { slug: input.slug } }) : null;
  return prisma.adImpression.create({
    data: {
      campaignId: campaign.id,
      linkId: link?.id,
      visitorId: input.visitorId,
      revenueCents: 0
    }
  });
}

export async function recordSponsorClick(input: {
  campaignId?: string | null;
  slug?: string | null;
  visitorId?: string | null;
}) {
  if (!hasDatabaseUrl()) return { destination: getUnlockCampaign().url };

  const campaign =
    (input.campaignId ? await prisma.sponsorCampaign.findUnique({ where: { id: input.campaignId } }) : null) ||
    (await selectCampaign());

  if (!campaign) return { destination: getUnlockCampaign().url };

  const link = input.slug ? await prisma.link.findUnique({ where: { slug: input.slug } }) : null;
  const revenueCents = campaign.payoutType === "CPC" ? platformConfig.defaultCpcCents : 0;
  const creatorRevenue = link ? creatorShareCents(revenueCents, campaign.creatorShareBps) : 0;

  await prisma.$transaction(async (tx) => {
    await tx.adImpression.create({
      data: {
        campaignId: campaign.id,
        linkId: link?.id,
        visitorId: input.visitorId,
        clicked: true,
        qualified: true,
        revenueCents
      }
    });

    await tx.sponsorCampaign.update({
      where: { id: campaign.id },
      data: { spentCents: { increment: revenueCents } }
    });

    if (link && creatorRevenue > 0) {
      await tx.ledgerEntry.create({
        data: {
          userId: link.creatorId,
          type: "AD_REVENUE",
          amountCents: creatorRevenue,
          note: `Sponsor click: ${campaign.title}`
        }
      });
    }
  });

  return { destination: campaign.targetUrl };
}

export async function recordQualifiedUnlock(input: {
  slug: string;
  visitorId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  country?: string | null;
  riskScore: number;
  premium?: boolean;
}) {
  if (!hasDatabaseUrl()) return null;

  const link = await prisma.link.findUnique({ where: { slug: input.slug } });
  if (!link) return null;

  const revenueCents = platformConfig.defaultCpmCents / 1000;
  const roundedRevenue = Math.max(1, Math.floor(revenueCents));

  return prisma.$transaction(async (tx) => {
    const click = await tx.click.create({
      data: {
        linkId: link.id,
        visitorId: input.visitorId,
        ipHash: hashIp(input.ip ?? null),
        userAgent: input.userAgent,
        country: input.country,
        riskScore: input.riskScore,
        qualified: input.riskScore < 25,
        premium: Boolean(input.premium),
        revenueCents: input.riskScore < 25 ? roundedRevenue : 0
      }
    });

    if (click.qualified && click.revenueCents > 0) {
      await tx.ledgerEntry.create({
        data: {
          userId: link.creatorId,
          type: input.premium ? "PREMIUM_POOL" : "AD_REVENUE",
          amountCents: click.revenueCents,
          note: `Qualified unlock: ${link.slug}`
        }
      });
    }

    return click;
  });
}
