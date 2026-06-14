import { ExportButtons } from "@/components/ExportButtons";
import { ClearLocalDataButton } from "@/components/ClearLocalDataButton";
import Link from "next/link";
import { getTodayWorkout } from "@/lib/trainingData";

export default function ExportsPage() {
  const todayWorkout = getTodayWorkout();
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6"><p className="label">Parent tools</p><h1 className="text-4xl font-black">Export Center</h1><p className="mt-2 text-slate-500">Phase 1 buttons show a clear placeholder. Real file generation is planned next.</p></div>
      <ExportButtons />
      <section className="card mt-6 border border-red-100">
        <p className="label">Phase 1 developer tool</p>
        <h2 className="text-xl font-black">Reset browser data</h2>
        <p className="my-3 text-sm text-slate-500">Useful during testing. This only clears sessions and KPI results stored in this browser.</p>
        <ClearLocalDataButton />
      </section>
      <section className="card mt-6 border border-amber-200">
        <p className="label">Cross-browser diagnostics</p>
        <h2 className="text-xl font-black">Session debug</h2>
        <p className="my-3 text-sm text-slate-500">Run every session initialization dependency independently and show raw failures on screen.</p>
        <Link className="btn-secondary w-full" href={`/debug/session/${todayWorkout.id}`}>Debug Today&apos;s Session</Link>
      </section>
    </div>
  );
}
