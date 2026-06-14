import { ExportButtons } from "@/components/ExportButtons";
import { ClearLocalDataButton } from "@/components/ClearLocalDataButton";
import Link from "next/link";
import { getNextWorkout, getTodayWorkout } from "@/lib/trainingData";

export default function ExportsPage() {
  const todayWorkout = getTodayWorkout() || getNextWorkout("0000-00-00");
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6"><p className="label">Parent tools</p><h1 className="text-4xl font-black">Export Center</h1><p className="mt-2 text-slate-500">Preview what reports will contain. File generation remains a Phase 2 placeholder.</p></div>
      <ExportButtons />
      <section className="card mt-6"><h2 className="text-xl font-black">Review before exporting</h2><p className="my-3 text-sm text-slate-500">Check saved attempts and KPI results before creating future reports.</p><div className="grid gap-3 sm:grid-cols-2"><Link className="btn-secondary" href="/history">Open Session History</Link><Link className="btn-secondary" href="/kpis">Open KPI Dashboard</Link></div></section>
      <section className="card mt-6 border border-red-100">
        <p className="label">Phase 1 developer tool</p>
        <h2 className="text-xl font-black">Reset browser data</h2>
        <p className="my-3 text-sm font-semibold text-red-700">Warning: clearing data only affects this current browser/device, and cannot be undone.</p>
        <ClearLocalDataButton />
      </section>
      <section className="card mt-6 border border-amber-200">
        <p className="label">Cross-browser diagnostics</p>
        <h2 className="text-xl font-black">Session debug</h2>
        <p className="my-3 text-sm text-slate-500">Run every session initialization dependency independently and show raw failures on screen.</p>
        {todayWorkout ? <Link className="btn-secondary w-full" href={`/debug/session/${todayWorkout.id}`}>Debug Next Available Session</Link> : <p className="text-sm text-slate-500">No session template is available to debug.</p>}
      </section>
    </div>
  );
}
