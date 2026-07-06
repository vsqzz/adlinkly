import Link from "next/link";
import { createUnlockToken } from "@/lib/security";

export default async function UnlockPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const token = await createUnlockToken({ slug, visitorId: "demo-visitor" });

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#d9f99d,transparent_28%),linear-gradient(180deg,#f8fafc,#eef2f7)] py-10 dark:bg-[radial-gradient(circle_at_top,#164e63,transparent_28%),linear-gradient(180deg,#05070d,#0b1120)]">
      <section className="shell grid min-h-[calc(100vh-80px)] place-items-center">
        <div className="glass w-full max-w-xl rounded-lg p-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-sky-500">Adlinkly protected link</p>
          <h1 className="mt-3 text-4xl font-black">Unlock creator content</h1>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
            This demo validates a signed unlock token before redirecting. In production this page would include ad inventory, Turnstile, and server-verified timing.
          </p>
          <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4 text-left text-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="font-bold">Link slug</p>
            <p className="mt-1 text-slate-500">{slug}</p>
            <p className="mt-4 font-bold">Unlock token</p>
            <p className="mt-1 break-all font-mono text-xs text-slate-500">{token}</p>
          </div>
          <Link className="focus-ring mt-6 inline-flex rounded-lg bg-sky-500 px-5 py-3 text-sm font-bold text-white hover:bg-sky-600" href={`/api/unlock?slug=${slug}&token=${encodeURIComponent(token)}`}>
            Continue to destination
          </Link>
        </div>
      </section>
    </main>
  );
}
