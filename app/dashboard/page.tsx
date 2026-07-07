import Link from "next/link";
import { Nav } from "@/components/nav";
import { StatCard } from "@/components/stat-card";
import { getCreatorDashboardData } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getCreatorDashboardData();

  return (
    <>
      <Nav />
      <main className="shell py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-sky-500">Creator workspace</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Dashboard</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{data.note}</p>
          </div>
          <Link className="focus-ring rounded-lg bg-sky-500 px-4 py-2 text-sm font-bold text-white hover:bg-sky-600" href="/dashboard/new-link">
            Create monetized link
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="glass rounded-lg p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black">Top links</h2>
              <Link className="text-sm font-bold text-sky-500" href="/api-docs">
                API docs
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="py-3">Link</th>
                    <th>Clicks</th>
                    <th>EPC</th>
                    <th>Risk</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.links.map((link) => (
                    <tr className="border-t border-slate-200 dark:border-slate-800" key={link.slug}>
                      <td className="py-4">
                        <p className="font-bold">{link.title}</p>
                        <p className="text-slate-500">adlinkly.net/l/{link.slug}</p>
                      </td>
                      <td>{link.clicks}</td>
                      <td>{link.epc}</td>
                      <td>{link.risk}</td>
                      <td>
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                          {link.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass rounded-lg p-5">
            <h2 className="text-xl font-black">Payouts</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Manual approval first, automated payouts later.</p>
            <div className="mt-4 space-y-3">
              {data.payouts.map((row) => (
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800" key={`${row.date}-${row.amount}`}>
                  <div className="flex items-center justify-between">
                    <p className="font-black">{row.amount}</p>
                    <span className="text-xs font-bold text-sky-500">{row.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{row.date} via {row.method}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
