import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLoadForm } from "@/components/ExternalLoadForm";
import { ExternalLoadChip } from "@/components/LoadChips";
import { externalLoads, formatPlanDate } from "@/lib/trainingData";

export default async function ExternalLoadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const load = externalLoads.find((item) => item.id === id);
  if (!load) notFound();

  return <div className="mx-auto max-w-3xl"><div className="mb-5"><Link className="text-sm font-bold text-blue" href={`/day/${load.date}`}>← Back to day</Link></div><section className="card mb-6 bg-navy text-white"><ExternalLoadChip type={load.type} title={load.title} /><h1 className="mt-4 text-3xl font-black">{load.title}</h1><p className="mt-2 text-slate-200">{formatPlanDate(load.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {load.provider} · Planned intensity {load.plannedIntensity}/5</p><p className="mt-3 text-sm text-slate-300">Saving an update creates a new immutable snapshot and preserves older entries.</p></section><ExternalLoadForm load={load} /></div>;
}
