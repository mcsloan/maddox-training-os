"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readableError } from "@/lib/errorMessage";
import { createTrainingWorkLog, getTrainingWorkLogByDate, saveTrainingWorkLog } from "@/lib/storage/trainingWorkRepository";
import { Rating, TrainingWorkLog } from "@/lib/types";

export function TrainingWorkForm({ date, title, workoutId, blockIds, blockNames, plannedDurationMinutes }: { date: string; title: string; workoutId: string | null; blockIds: string[]; blockNames: string[]; plannedDurationMinutes: number | null; }) {
  const router = useRouter();
  const existing = useMemo(() => getTrainingWorkLogByDate(date), [date]);
  const [log, setLog] = useState<TrainingWorkLog>(() => createTrainingWorkLog(date, existing?.workoutId ?? workoutId, title, blockIds, plannedDurationMinutes, existing || undefined));
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(existing ? "Loaded saved training-work log." : "Ready to log training work.");

  function update(patch: Partial<TrainingWorkLog>) {
    setLog((current) => ({ ...current, ...patch, updatedAt: new Date().toISOString() }));
  }

  async function save() {
    setSaving(true);
    setStatus("Saving training work log...");
    try {
      saveTrainingWorkLog(log);
      setStatus("Training work logged.");
      router.push(`/day/${date}`);
    } catch (reason) {
      setSaving(false);
      setStatus(`Could not save training work log. ${readableError(reason)}`);
    }
  }

  return (
    <div className="space-y-5">
      <section className="card">
        <h2 className="text-xl font-black">Training work details</h2>
        <p className="mt-2 text-sm text-slate-600">This log captures the planned training work separately from sport-load logging.</p>
        {blockNames.length > 0 && <div className="mt-4 rounded-2xl bg-ice p-4"><p className="label">Planned blocks</p><p className="font-semibold">{blockNames.join(", ")}</p></div>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <YesNo label="Completed?" value={log.completed} onChange={(completed) => update({ completed })} />
          <label><span className="label">Actual duration (minutes)</span><input className="field" type="number" inputMode="numeric" value={log.actualDuration ?? ""} onChange={(event) => update({ actualDuration: event.target.value ? Number(event.target.value) : null })} /></label>
          <RatingField label="Effort / difficulty" value={log.effort} onChange={(effort) => update({ effort })} />
          <label className="sm:col-span-2"><span className="label">Notes</span><textarea className="field min-h-28" value={log.notes} onChange={(event) => update({ notes: event.target.value })} /></label>
        </div>
      </section>
      <div className="sticky bottom-16 rounded-2xl bg-ice/95 p-3 backdrop-blur sm:bottom-0">
        <button className="btn-primary min-h-16 w-full text-lg" disabled={saving} onClick={save}>{saving ? "Saving..." : "Save Training Work Log"}</button>
        <p className="mt-2 text-center text-sm font-semibold text-slate-500">{status}</p>
      </div>
    </div>
  );
}

function RatingField({ label, value, onChange }: { label: string; value: Rating | null; onChange: (value: Rating | null) => void }) {
  return <label><span className="label">{label} 1-5</span><select className="field" value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) as Rating : null)}><option value="">Choose</option>{[1,2,3,4,5].map((rating) => <option value={rating} key={rating}>{rating} / 5</option>)}</select></label>;
}

function YesNo({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return <label><span className="label">{label}</span><select className="field" value={value ? "yes" : "no"} onChange={(event) => onChange(event.target.value === "yes")}><option value="yes">Yes</option><option value="no">No</option></select></label>;
}
