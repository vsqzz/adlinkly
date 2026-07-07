import { prisma, hasDatabaseUrl } from "@/lib/prisma";
import { platformConfig } from "@/lib/platform";

export async function getCreatorBalanceCents(userId: string) {
  if (!hasDatabaseUrl()) return 0;

  const [ledger, payouts] = await Promise.all([
    prisma.ledgerEntry.aggregate({
      where: { userId },
      _sum: { amountCents: true }
    }),
    prisma.payout.aggregate({
      where: {
        account: { userId },
        status: { in: ["REQUESTED", "APPROVED", "SCHEDULED", "PAID"] }
      },
      _sum: { amountCents: true }
    })
  ]);

  return (ledger._sum.amountCents || 0) - (payouts._sum.amountCents || 0);
}

export async function requestPayout(input: {
  userId: string;
  paypalEmail: string;
  amountCents: number;
}) {
  if (!hasDatabaseUrl()) {
    throw new Error("DATABASE_URL is required for payout requests");
  }

  const balance = await getCreatorBalanceCents(input.userId);
  if (input.amountCents < platformConfig.minPayoutCents) {
    throw new Error(`Minimum payout is ${platformConfig.minPayoutCents} cents`);
  }
  if (input.amountCents > balance) {
    throw new Error("Insufficient creator balance");
  }

  const account =
    (await prisma.payoutAccount.findFirst({
      where: { userId: input.userId, provider: "PAYPAL", externalId: input.paypalEmail }
    })) ||
    (await prisma.payoutAccount.create({
      data: {
        userId: input.userId,
        provider: "PAYPAL",
        externalId: input.paypalEmail
      }
    }));

  return prisma.payout.create({
    data: {
      payoutAccountId: account.id,
      amountCents: input.amountCents,
      status: "REQUESTED"
    },
    include: { account: true }
  });
}
