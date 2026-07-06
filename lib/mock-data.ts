export const creatorStats = [
  { label: "Revenue", value: "$1,284.74", detail: "+18.6% this month" },
  { label: "Paid clicks", value: "642,890", detail: "94 countries" },
  { label: "Premium boost", value: "$312.40", detail: "from subscriber pool" },
  { label: "Payout status", value: "Ready", detail: "$250 minimum met" }
];

export const links = [
  { slug: "preset-pack", title: "Creator preset pack", clicks: "182.4K", epc: "$0.0061", risk: "Low", status: "Live" },
  { slug: "free-assets", title: "Free asset vault", clicks: "88.1K", epc: "$0.0044", risk: "Medium", status: "Review" },
  { slug: "discord-drop", title: "Discord weekly drop", clicks: "41.7K", epc: "$0.0072", risk: "Low", status: "Live" }
];

export const payoutRows = [
  { date: "Jul 01", amount: "$318.22", method: "Stripe Connect", status: "Scheduled" },
  { date: "Jun 15", amount: "$490.18", method: "PayPal", status: "Paid" },
  { date: "Jun 01", amount: "$275.61", method: "Wise", status: "Paid" }
];

export const fraudSignals = [
  "Server-issued unlock tokens expire after 10 minutes.",
  "Countdown completion is verified on the server before redirect.",
  "Datacenter, proxy, repeated IP, and abnormal country mix signals raise review risk.",
  "Creators with fraud spikes move to delayed payouts automatically."
];
