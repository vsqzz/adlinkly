import { Nav } from "@/components/nav";

export default function SupportPage() {
  return (
    <>
      <Nav />
      <main className="shell py-10">
        <h1 className="text-4xl font-black">Support center</h1>
        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="glass rounded-lg p-6">
            <h2 className="text-xl font-black">Queues</h2>
            {["Payout help", "Abuse reports", "API support", "Premium billing"].map((item) => (
              <div className="mt-3 rounded-lg border border-slate-200 p-4 text-sm font-bold dark:border-slate-800" key={item}>
                {item}
              </div>
            ))}
          </div>
          <form className="glass grid gap-4 rounded-lg p-6">
            <input className="focus-ring rounded-lg border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Email" />
            <input className="focus-ring rounded-lg border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Subject" />
            <textarea className="focus-ring min-h-40 rounded-lg border border-slate-300 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-950" placeholder="Tell us what happened" />
            <button className="focus-ring w-fit rounded-lg bg-sky-500 px-5 py-3 text-sm font-bold text-white" type="button">
              Create ticket
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
