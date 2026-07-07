export type SponsorCampaign = {
  id: string;
  sponsor: string;
  title: string;
  description: string;
  cta: string;
  url: string;
  placement: "unlock_primary" | "unlock_secondary";
  payoutType: "cpm" | "cpc" | "flat" | "affiliate";
  creatorShareBps: number;
};

export const sponsorCampaigns: SponsorCampaign[] = [
  {
    id: "camp_nexus_hosting",
    sponsor: "Nexus Hosting",
    title: "Launch your next Discord bot",
    description: "Fast bot hosting for creators, communities, and automation projects.",
    cta: "Visit sponsor",
    url: "https://adlinkly.net",
    placement: "unlock_primary",
    payoutType: "cpc",
    creatorShareBps: 5000
  },
  {
    id: "camp_creator_tools",
    sponsor: "Creator Tools",
    title: "Upgrade your creator workflow",
    description: "A sponsored placement that can be sold directly while ad networks are still being approved.",
    cta: "Learn more",
    url: "https://adlinkly.net",
    placement: "unlock_secondary",
    payoutType: "flat",
    creatorShareBps: 4000
  }
];

export function getUnlockCampaign() {
  return sponsorCampaigns.find((campaign) => campaign.placement === "unlock_primary") || sponsorCampaigns[0];
}

export function estimateCreatorShare(amountCents: number, creatorShareBps: number) {
  return Math.floor((amountCents * creatorShareBps) / 10000);
}
