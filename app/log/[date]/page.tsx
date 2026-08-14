import Link from "next/link";
import { notFound } from "next/navigation";
import { CanonicalDayLogForm } from "@/components/CanonicalDayLogForm";
import { projectCanonicalDay } from "@/lib/projections/canonicalDay";
import { formatPlanDate } from "@/lib/trainingData";

export default async function CanonicalDayLogPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const day = projectCanonicalDay(date);
  if (!day.isResolvable) notFound();
  return <main className="mx-auto max-w-3xl pb-8"><Link className="mb-4 inline-block text-sm font-bold text-blue" href={`/day/${date}`}>← Back to day</Link><section className="card mb-4 bg-navy text-white"><p className="label text-lime">Log today&apos;s training</p><h1 className="text-3xl font-black">{day.title}</h1><p className="mt-2 text-slate-200">{formatPlanDate(date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p></section><CanonicalDayLogForm day={day} /></main>;
}
