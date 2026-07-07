import { Nav } from "@/components/nav";
import { getAdminStats } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminStats();

  return (
    <>
      <Nav />
      <main className="shell py-10">
        <h1 className="text-4xl font-black">Admin command center</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.cards.map(([item, value]) => (
            <div className="glass rounded-lg p-5" key={item}>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{item}</p>
              <p className="mt-3 text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>
        <section className="glass mt-8 rounded-lg p-6">
          <h2 className="text-2xl font-black">PayPal payout automation</h2>
          <p className="mt-3 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
            Approved payouts can be sent through the PayPal Payouts API at <span className="font-mono">/api/admin/paypal-payouts</span>. Keep admin approval enabled until traffic quality, sponsor revenue, and PayPal account limits are stable.
          </p>
          <pre className="mt-5 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">{`POST /api/admin/paypal-payouts
{
  "adminSecret": "...",
  "payouts": [
    {
      "payoutId": "payout_123",
      "email": "creator@example.com",
      "amount": "25.00",
      "currency": "EUR"
    }
  ]
}`}</pre>
        </section>

        <section className="glass mt-8 rounded-lg p-6">
          <h2 className="text-2xl font-black">Sponsor campaigns</h2>
          <div className="mt-4 grid gap-3">
            {data.campaigns.map((campaign) => (
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800" key={campaign.id}>
                <p className="font-black">{campaign.title}</p>
                <p className="mt-1 text-sm text-slate-500">{campaign.sponsor} - creator share {campaign.creatorShareBps / 100}%</p>
              </div>
            ))}
          </div>
        </section>      </main>
    </>
  );
}
