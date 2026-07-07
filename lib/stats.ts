import { hasDatabaseUrl, prisma } from "@/lib/prisma";
import { centsToCurrency, formatNumber } from "@/lib/money";
import { links as fallbackLinks, payoutRows } from "@/lib/mock-data";
import { sponsorCampaigns } from "@/lib/ads";

export async function getPrimaryCreator() {
  if (!hasDatabaseUrl()) return null;

  return prisma.user.findFirst({
    where: { role: { in: ["CREATOR", "ADMIN"] } },
    include: { profile: true },
    orderBy: { createdAt: "asc" }
  });
}

export async function getCreatorDashboardData(userId?: string) {
  if (!hasDatabaseUrl()) {
    return fallbackDashboard();
  }

  try {
    const creator = userId
      ? await prisma.user.findUnique({ where: { id: userId } })
      : await getPrimaryCreator();

    if (!creator) return fallbackDashboard("No creator account yet");

    const [clicks, qualifiedClicks, premiumClicks, revenue, premiumRevenue, linkRows, payouts] = await Promise.all([
      prisma.click.count({ where: { link: { creatorId: creator.id } } }),
      prisma.click.count({ where: { link: { creatorId: creator.id }, qualified: true } }),
      prisma.click.count({ where: { link: { creatorId: creator.id }, premium: true } }),
      prisma.ledgerEntry.aggregate({
        where: { userId: creator.id, type: { in: ["AD_REVENUE", "AFFILIATE", "PREMIUM_POOL"] } },
        _sum: { amountCents: true }
      }),
      prisma.ledgerEntry.aggregate({
        where: { userId: creator.id, type: "PREMIUM_POOL" },
        _sum: { amountCents: true }
      }),
      prisma.link.findMany({
        where: { creatorId: creator.id },
        include: { clicks: true },
        orderBy: { updatedAt: "desc" },
        take: 10
      }),
      prisma.payout.findMany({
        where: { account: { userId: creator.id } },
        include: { account: true },
        orderBy: { createdAt: "desc" },
        take: 5
      })
    ]);

    const totalRevenue = revenue._sum.amountCents || 0;
    const premiumBoost = premiumRevenue._sum.amountCents || 0;

    return {
      note: "Live database stats",
      stats: [
        { label: "Revenue", value: centsToCurrency(totalRevenue), detail: `${qualifiedClicks} qualified clicks` },
        { label: "Paid clicks", value: formatNumber(clicks), detail: `${premiumClicks} premium visits` },
        { label: "Premium boost", value: centsToCurrency(premiumBoost), detail: "from subscriber pool" },
        { label: "Payout status", value: totalRevenue >= 2500 ? "Ready" : "Building", detail: `${centsToCurrency(2500)} minimum` }
      ],
      links: linkRows.map((link) => {
        const revenueCents = link.clicks.reduce((sum, click) => sum + click.revenueCents, 0);
        const epc = link.clicks.length ? revenueCents / 100 / link.clicks.length : 0;
        return {
          slug: link.slug,
          title: link.title,
          clicks: formatNumber(link.clicks.length),
          epc: `$${epc.toFixed(4)}`,
          risk: link.clicks.some((click) => click.riskScore >= 25) ? "Review" : "Low",
          status: link.status
        };
      }),
      payouts: payouts.map((payout) => ({
        date: payout.createdAt.toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        amount: centsToCurrency(payout.amountCents),
        method: payout.account.provider,
        status: payout.status
      }))
    };
  } catch (error) {
    console.error("Dashboard stats failed", error);
    return fallbackDashboard("Database read failed, showing fallback");
  }
}

export async function getAdminStats() {
  if (!hasDatabaseUrl()) {
    return {
      cards: [
        ["Pending payouts", 12],
        ["Risky creators", 7],
        ["Abuse reports", 34],
        ["Ad campaigns", sponsorCampaigns.length]
      ],
      campaigns: sponsorCampaigns
    };
  }

  const [pendingPayouts, riskyCreators, abuseReports, activeCampaigns, campaigns] = await Promise.all([
    prisma.payout.count({ where: { status: { in: ["REQUESTED", "APPROVED"] } } }),
    prisma.creatorProfile.count({ where: { OR: [{ fraudScore: { gte: 50 } }, { payoutHold: true }] } }),
    prisma.supportTicket.count({ where: { status: "open" } }),
    prisma.sponsorCampaign.count({ where: { active: true } }),
    prisma.sponsorCampaign.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 8 })
  ]);

  return {
    cards: [
      ["Pending payouts", pendingPayouts],
      ["Risky creators", riskyCreators],
      ["Open tickets", abuseReports],
      ["Ad campaigns", activeCampaigns]
    ],
    campaigns: campaigns.map((campaign) => ({
      id: campaign.id,
      sponsor: campaign.sponsorName,
      title: campaign.title,
      description: campaign.description,
      cta: "Visit sponsor",
      url: campaign.targetUrl,
      placement: campaign.placement as "unlock_primary" | "unlock_secondary",
      payoutType: campaign.payoutType.toLowerCase() as "cpm" | "cpc" | "flat" | "affiliate",
      creatorShareBps: campaign.creatorShareBps
    }))
  };
}

export function fallbackDashboard(note = "Connect DATABASE_URL for live stats") {
  return {
    note,
    stats: [
      { label: "Revenue", value: "$1,284.74", detail: "+18.6% demo month" },
      { label: "Paid clicks", value: "642,890", detail: "demo traffic" },
      { label: "Premium boost", value: "$312.40", detail: "demo pool" },
      { label: "Payout status", value: "Demo", detail: "database not connected" }
    ],
    links: fallbackLinks,
    payouts: payoutRows
  };
}
