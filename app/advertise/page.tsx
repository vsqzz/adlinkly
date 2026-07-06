import { Nav } from "@/components/nav";
import { sponsorCampaigns } from "@/lib/ads";

export default function AdvertisePage() {
  return (
    <>
      <Nav />
      <main className="shell py-10">
        <p className="text-sm font-bold uppercase tracking-wide text-sky-500">Revenue engine</p>
        <h1 className="mt-2 text-4xl font-black">Advertise on Adlinkly</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Sell sponsor placements directly while larger ad networks and business verification are still being set up. Sponsors can buy unlock-page placements, creator category placements, and featured campaign slots.
        </p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Unlock page sponsor", "Displayed before visitors continue to creator links."],
            ["Category placement", "Target gaming, Discord, software, creator tools, or downloads."],
            ["Affiliate campaign", "Track clicks and split qualified revenue with creators."]
          ].map(([title, body]) => (
            <div className="glass rounded-lg p-5" key={title}>
              <h2 className="text-xl font-black">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
            </div>
          ))}
        </section>

        <section className="glass mt-8 rounded-lg p-6">
          <h2 className="text-2xl font-black">Active demo campaigns</h2>
          <div className="mt-4 grid gap-3">
            {sponsorCampaigns.map((campaign) => (
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800" key={campaign.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-black">{campaign.title}</p>
                    <p className="text-sm text-slate-500">{campaign.sponsor} - {campaign.payoutType.toUpperCase()} - creator share {campaign.creatorShareBps / 100}%</p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    {campaign.placement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
