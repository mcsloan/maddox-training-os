export function ParentDashboardCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <article className="card"><p className="label">{label}</p><p className="text-3xl font-black">{value}</p><p className="mt-2 text-sm text-slate-500">{detail}</p></article>;
}
