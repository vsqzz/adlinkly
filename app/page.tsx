import Link from "next/link";
import { Nav } from "@/components/nav";
import { fraudSignals } from "@/lib/mock-data";

const features = [
  ["Creator monetization", "Short links with paid unlocks, premium visitor boosts, payout ledgers, and affiliate earnings."],
  ["Anti-bypass engine", "Signed sessions, server-side countdown validation, bot checks, proxy scoring, and delayed payout review."],
  ["Business dashboard", "Creator analytics, admin moderation, support queues, API keys, advertiser inventory, and subscription tiers."]
];

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#e0f2fe,transparent_32%),linear-gradient(180deg,#ffffff,#f8fafc)] py-20 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,#0f3a55,transparent_30%),linear-gradient(180deg,#05070d,#0b1120)]">
          <div className="shell grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-bold text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300">
                adlinkly.net is ready for creators
              </p>
              <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 dark:text-white md:text-7xl">
                Monetized links with premium boosts and fraud control.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Adlinkly is a modern Linkvertise alternative for creators, teams, and advertisers. Build short links, earn from qualified visits, reward premium traffic, and manage payouts from one clean dashboard.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link className="focus-ring rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950" href="/dashboard">
                  Open Creator Dashboard
                </Link>
                <Link className="focus-ring rounded-lg border border-slate-300 px-5 py-3 text-sm font-bold hover:border-sky-400 dark:border-slate-700" href="/l/preset-pack">
                  Preview Unlock Flow
                </Link>
              </div>
            </div>
            <div className="glass rounded-lg p-5">
              <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white dark:border-slate-800">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm text-slate-400">Creator revenue</p>
                    <p className="text-4xl font-black">$1,284.74</p>
                  </div>
                  <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-bold text-emerald-300">+18.6%</span>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {["Premium pool", "Ad unlocks", "Referrals", "API clicks"].map((item, index) => (
                    <div className="rounded-lg bg-white/7 p-4" key={item}>
                      <p className="text-sm text-slate-400">{item}</p>
                      <p className="mt-2 text-2xl font-black">{["$312", "$761", "$84", "$127"][index]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="shell py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {features.map(([title, body]) => (
              <div className="glass rounded-lg p-6" key={title}>
                <h2 className="text-xl font-black">{title}</h2>
                <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white py-16 dark:border-slate-800 dark:bg-slate-950">
          <div className="shell grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-black">Premium visitors can increase creator earnings.</h2>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
                Adlinkly allocates part of each premium subscription into a monthly creator pool. When premium users open creator links, those visits receive a higher creator value while the visitor sees a cleaner experience.
              </p>
            </div>
            <div className="glass rounded-lg p-6">
              <p className="font-mono text-sm text-slate-500 dark:text-slate-400">premium_pool = subscription * creator_share</p>
              <p className="mt-3 font-mono text-sm text-slate-500 dark:text-slate-400">creator_payout = pool * qualified_visit_weight</p>
              <p className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                Result: creators earn more from premium traffic without forcing premium visitors through heavy ad steps.
              </p>
            </div>
          </div>
        </section>

        <section className="shell py-16">
          <h2 className="text-3xl font-black">Anti-bypass foundation</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {fraudSignals.map((signal) => (
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300" key={signal}>
                {signal}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
