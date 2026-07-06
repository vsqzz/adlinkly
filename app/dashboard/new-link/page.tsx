import { Nav } from "@/components/nav";

export default function NewLinkPage() {
  return (
    <>
      <Nav />
      <main className="shell py-8">
        <h1 className="text-4xl font-black">Create monetized link</h1>
        <form className="glass mt-8 grid gap-5 rounded-lg p-6">
          <label className="grid gap-2 text-sm font-bold">
            Destination URL
            <input className="focus-ring rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal dark:border-slate-700 dark:bg-slate-950" placeholder="https://example.com/download" />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Link title
            <input className="focus-ring rounded-lg border border-slate-300 bg-white px-4 py-3 font-normal dark:border-slate-700 dark:bg-slate-950" placeholder="My creator asset pack" />
          </label>
          <div className="grid gap-4 md:grid-cols-3">
            {["Ad unlock", "Premium boost", "Fraud review"].map((item) => (
              <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 text-sm font-bold dark:border-slate-800" key={item}>
                <input defaultChecked type="checkbox" />
                {item}
              </label>
            ))}
          </div>
          <button className="focus-ring w-fit rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white dark:bg-white dark:text-slate-950" type="button">
            Save link
          </button>
        </form>
      </main>
    </>
  );
}
