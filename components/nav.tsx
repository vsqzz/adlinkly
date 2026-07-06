import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  ["Dashboard", "/dashboard"],
  ["Premium", "/premium"],
  ["Advertise", "/advertise"],
  ["API", "/api-docs"],
  ["Support", "/support"]
] as const;

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/88 backdrop-blur dark:border-slate-800 dark:bg-slate-950/88">
      <div className="shell flex min-h-16 items-center justify-between gap-4">
        <Link className="focus-ring rounded-md text-xl font-black tracking-tight" href="/">
          Adlinkly
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {links.map(([label, href]) => (
            <Link className="focus-ring rounded-md hover:text-sky-500" href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link className="focus-ring rounded-lg bg-sky-500 px-4 py-2 text-sm font-bold text-white hover:bg-sky-600" href="/dashboard">
            Launch App
          </Link>
        </div>
      </div>
    </header>
  );
}
