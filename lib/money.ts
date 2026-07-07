export function centsToCurrency(cents: number, currency = "EUR") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(cents / 100);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function cpmRevenueCents(cpmCents: number, impressions: number) {
  return Math.floor((cpmCents * impressions) / 1000);
}

export function creatorShareCents(revenueCents: number, creatorShareBps: number) {
  return Math.floor((revenueCents * creatorShareBps) / 10000);
}
