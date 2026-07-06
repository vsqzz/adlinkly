import { Nav } from "@/components/nav";

const plans = [
  ["Free", "$0", "Create monetized links, basic analytics, standard payout review."],
  ["Creator Pro", "$12/mo", "Higher limits, API keys, custom profiles, lower payout threshold, priority support."],
  ["Visitor Premium", "$7/mo", "Cleaner unlocks, fewer ads, and creator earnings boosted from the premium pool."]
];

export default function PremiumPage() {
  return (
    <>
      <Nav />
      <main className="shell py-10">
        <h1 className="text-4xl font-black">Freemium and premium plans</h1>
        <p className="mt-4 max-w-3xl leading-7 text-slate-600 dark:text-slate-300">
          Adlinkly is payment-provider-neutral while the company is being set up. You can collect interest, approve creators, and run manual payout requests now, then connect PayPal, Wise, Tipalti, Stripe, or another provider once verification is possible.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.map(([name, price, body]) => (
            <div className="glass rounded-lg p-6" key={name}>
              <h2 className="text-2xl font-black">{name}</h2>
              <p className="mt-4 text-4xl font-black">{price}</p>
              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">{body}</p>
              <button className="focus-ring mt-6 w-full rounded-lg bg-sky-500 px-4 py-3 text-sm font-bold text-white" type="button">
                Choose plan
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
