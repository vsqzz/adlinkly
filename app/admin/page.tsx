import { Nav } from "@/components/nav";

export default function AdminPage() {
  return (
    <>
      <Nav />
      <main className="shell py-10">
        <h1 className="text-4xl font-black">Admin command center</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {["Pending payouts", "Risky creators", "Abuse reports", "Ad campaigns"].map((item, index) => (
            <div className="glass rounded-lg p-5" key={item}>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{item}</p>
              <p className="mt-3 text-3xl font-black">{[12, 7, 34, 18][index]}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
