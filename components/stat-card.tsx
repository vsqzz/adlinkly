export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="glass rounded-lg p-5">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">{detail}</p>
    </div>
  );
}
