export const platformConfig = {
  minPayoutCents: Number(process.env.MIN_PAYOUT_CENTS || 2500),
  defaultCurrency: process.env.DEFAULT_CURRENCY || "EUR",
  defaultCpmCents: Number(process.env.DEFAULT_CPM_CENTS || 120),
  defaultCpcCents: Number(process.env.DEFAULT_CPC_CENTS || 8),
  defaultCreatorShareBps: Number(process.env.DEFAULT_CREATOR_SHARE_BPS || 5000)
};
