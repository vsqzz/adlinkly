"use client";

import { useEffect, useState } from "react";

const options = ["light", "dark", "system"] as const;
type Theme = (typeof options)[number];

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme((localStorage.getItem("adlinkly-theme") as Theme) || "system");
  }, []);

  function apply(next: Theme) {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    localStorage.setItem("adlinkly-theme", next);
    document.documentElement.dataset.theme = next;
    document.documentElement.classList.toggle("dark", next === "dark" || (next === "system" && prefersDark));
    setTheme(next);
  }

  return (
    <div className="inline-flex rounded-lg border border-slate-300 bg-white p-1 text-xs dark:border-slate-700 dark:bg-slate-950">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => apply(option)}
          className={`focus-ring rounded-md px-3 py-1.5 capitalize transition ${
            theme === option ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "text-slate-600 dark:text-slate-300"
          }`}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
