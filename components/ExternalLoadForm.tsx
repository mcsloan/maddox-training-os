"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readableError } from "@/lib/errorMessage";
import { createExternalLoadLog, loadExternalLoadLogs, saveExternalLoadLog } from "@/lib/storage/externalLoadRepository";
import { ExternalLoadLog, PlannedExternalLoad, Rating } from "@/lib/types";

type SkillRecoveryWork = NonNullable<ExternalLoadLog["skillRecoveryWork"]>;

export function ExternalLoadForm({ load }: { load: PlannedExternalLoad }) {
  const router = useRouter();
  const [log, setLog] = useState<ExternalLoadLog>(() => createExternalLoadLog(load));
  const [status, setStatus] = useState("Ready");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadExternalLoadLogs().then((result) => {
      const previous = result.logs.find((item) => item.externalLoadId === load.id);
      if (previous) setLog(createExternalLoadLog(load, previous));
    });
  }, [load]);

  function update(patch: Partial<ExternalLoadLog>) {
    setLog((current) => ({ ...current, ...patch }));
  }

  function updateSkillRecoveryWork(patch: Partial<SkillRecoveryWork>) {
    setLog((current) => ({
      ...current,
      skillRecoveryWork: {
        headUpPuckTouchesCompleted: current.skillRecoveryWork?.headUpPuckTouchesCompleted ?? false,
        headUpPuckTouchesMinutes: current.skillRecoveryWork?.headUpPuckTouchesMinutes ?? null,
        accuracyShootingCompleted: current.skillRecoveryWork?.accuracyShootingCompleted ?? false,
        shotsTaken: current.skillRecoveryWork?.shotsTaken ?? null,
        targetHits: current.skillRecoveryWork?.targetHits ?? null,
        cooldownBikeCompleted: current.skillRecoveryWork?.cooldownBikeCompleted ?? false,
        cooldownBikeMinutes: current.skillRecoveryWork?.cooldownBikeMinutes ?? null,
        bikeIntensity: current.skillRecoveryWork?.bikeIntensity ?? "easy",
        recoveryMobilityCompleted: current.skillRecoveryWork?.recoveryMobilityCompleted ?? false,
        recoveryMobilityMinutes: current.skillRecoveryWork?.recoveryMobilityMinutes ?? null,
        ...patch,
      },
    }));
  }

  async function save() {
    setSaving(true);
    setStatus("Saving local backup...");
    try {
      const result = await saveExternalLoadLog(log, load);
      setStatus(result.mode === "cloud" ? "Cloud Synced" : "Local Backup Mode");
      router.push(`/day/${load.date}`);
    } catch (reason) {
      setStatus(`Local backup saved. Cloud sync failed: ${readableError(reason)}`);
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="rounded-2xl bg-ice p-4 text-sm font-bold text-slate-700">This saves the lacrosse load plus today’s skill, bike, mobility, and reflection notes.</p>
      <section className="card">
        <h2 className="text-xl font-black">Attendance and load</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <YesNo label="Did he attend?" value={log.attended} onChange={(attended) => update({ attended })} />
          <label><span className="label">Actual duration (minutes)</span><input className="field" type="number" inputMode="numeric" value={log.actualDuration ?? ""} onChange={(event) => update({ actualDuration: event.target.value ? Number(event.target.value) : null })} /></label>
          <RatingField label="Effort" value={log.effort} onChange={(effort) => update({ effort })} />
          <RatingField label="Energy after" value={log.energyAfter} onChange={(energyAfter) => update({ energyAfter })} />
          <RatingField label="Confidence" value={log.confidence} onChange={(confidence) => update({ confidence })} />
          <RatingField label="Difficulty" value={log.difficulty} onChange={(difficulty) => update({ difficulty })} />
          <label><span className="label">Soreness 0-5</span><select className="field" value={log.soreness} onChange={(event) => update({ soreness: Number(event.target.value) as ExternalLoadLog["soreness"] })}>{[0,1,2,3,4,5].map((value) => <option value={value} key={value}>{value} / 5</option>)}</select></label>
          <YesNo label="Any pain?" value={log.painFlag} onChange={(painFlag) => update({ painFlag })} />
        </div>
      </section>

      {load.type === "hockey_camp" && <section className="card"><h2 className="text-xl font-black">Camp reflection</h2><div className="mt-4 grid gap-4 sm:grid-cols-2"><RatingField label="Compete level" value={log.campReflection?.competeLevel ?? null} onChange={(value) => update({ campReflection: { ...log.campReflection!, competeLevel: value } })} /><RatingField label="Skating pace" value={log.campReflection?.skatingPace ?? null} onChange={(value) => update({ campReflection: { ...log.campReflection!, skatingPace: value } })} /><RatingField label="Puck confidence" value={log.campReflection?.puckConfidence ?? null} onChange={(value) => update({ campReflection: { ...log.campReflection!, puckConfidence: value } })} /><RatingField label="Communication / talking" value={log.campReflection?.communication ?? null} onChange={(value) => update({ campReflection: { ...log.campReflection!, communication: value } })} /><label className="sm:col-span-2"><span className="label">Did he attack or play passive?</span><textarea className="field min-h-24" value={log.campReflection?.attackedOrPassive || ""} onChange={(event) => update({ campReflection: { ...log.campReflection!, attackedOrPassive: event.target.value } })} /></label></div></section>}

      <section className="card">
        <h2 className="text-xl font-black">Today’s skill and recovery work</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <YesNo label="Head-up puck touches completed?" value={log.skillRecoveryWork?.headUpPuckTouchesCompleted ?? false} onChange={(headUpPuckTouchesCompleted) => updateSkillRecoveryWork({ headUpPuckTouchesCompleted })} />
          <NumberField label="Head-up puck touches minutes" value={log.skillRecoveryWork?.headUpPuckTouchesMinutes ?? null} onChange={(headUpPuckTouchesMinutes) => updateSkillRecoveryWork({ headUpPuckTouchesMinutes })} />
          <div className="sm:col-span-2 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900">Shooting is accuracy/mechanics work, not a conditioning workout.</div>
          <YesNo label="Accuracy shooting completed?" value={log.skillRecoveryWork?.accuracyShootingCompleted ?? false} onChange={(accuracyShootingCompleted) => updateSkillRecoveryWork({ accuracyShootingCompleted })} />
          <NumberField label="Shots taken" value={log.skillRecoveryWork?.shotsTaken ?? null} onChange={(shotsTaken) => updateSkillRecoveryWork({ shotsTaken })} />
          <NumberField label="Target hits / good shots" value={log.skillRecoveryWork?.targetHits ?? null} onChange={(targetHits) => updateSkillRecoveryWork({ targetHits })} />
          <div className="sm:col-span-2 rounded-xl bg-amber-50 p-3 text-sm font-bold text-amber-900">Bike should be easy cooldown only — conversational pace, no intervals.</div>
          <YesNo label="Cooldown bike completed?" value={log.skillRecoveryWork?.cooldownBikeCompleted ?? false} onChange={(cooldownBikeCompleted) => updateSkillRecoveryWork({ cooldownBikeCompleted })} />
          <NumberField label="Cooldown bike minutes" value={log.skillRecoveryWork?.cooldownBikeMinutes ?? null} onChange={(cooldownBikeMinutes) => updateSkillRecoveryWork({ cooldownBikeMinutes })} />
          <label><span className="label">Bike intensity</span><select className="field" value={log.skillRecoveryWork?.bikeIntensity ?? "easy"} onChange={(event) => updateSkillRecoveryWork({ bikeIntensity: event.target.value as SkillRecoveryWork["bikeIntensity"] })}><option value="easy">Easy</option><option value="moderate">Moderate</option></select></label>
          <YesNo label="Recovery mobility completed?" value={log.skillRecoveryWork?.recoveryMobilityCompleted ?? false} onChange={(recoveryMobilityCompleted) => updateSkillRecoveryWork({ recoveryMobilityCompleted })} />
          <NumberField label="Recovery mobility minutes" value={log.skillRecoveryWork?.recoveryMobilityMinutes ?? null} onChange={(recoveryMobilityMinutes) => updateSkillRecoveryWork({ recoveryMobilityMinutes })} />
        </div>
      </section>

      <section className="card"><h2 className="text-xl font-black">Reflection and recovery</h2><div className="mt-4 space-y-4"><TextArea label="One thing learned" value={log.whatWentWell} onChange={(whatWentWell) => update({ whatWentWell })} /><TextArea label="What should we adjust tomorrow?" value={log.whatToAdjust} onChange={(whatToAdjust) => update({ whatToAdjust })} /><TextArea label="Parent notes" value={log.parentNotes} onChange={(parentNotes) => update({ parentNotes })} /><YesNo label="Recovery completed?" value={log.recoveryCompleted} onChange={(recoveryCompleted) => update({ recoveryCompleted })} /></div></section>
      <div className="sticky bottom-16 rounded-2xl bg-ice/95 p-3 backdrop-blur sm:bottom-0"><button className="btn-primary min-h-16 w-full text-lg" disabled={saving} onClick={save}>{saving ? "Saving..." : "Save Today Log"}</button><p className="mt-2 text-center text-sm font-semibold text-slate-500">{status}</p></div>
    </div>
  );
}

function RatingField({ label, value, onChange }: { label: string; value: Rating | null; onChange: (value: Rating | null) => void }) {
  return <label><span className="label">{label} 1-5</span><select className="field" value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) as Rating : null)}><option value="">Choose</option>{[1,2,3,4,5].map((rating) => <option value={rating} key={rating}>{rating} / 5</option>)}</select></label>;
}

function YesNo({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return <label><span className="label">{label}</span><select className="field" value={value ? "yes" : "no"} onChange={(event) => onChange(event.target.value === "yes")}><option value="yes">Yes</option><option value="no">No</option></select></label>;
}

function NumberField({ label, value, onChange }: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  return <label><span className="label">{label}</span><input className="field" type="number" inputMode="numeric" value={value ?? ""} onChange={(event) => onChange(event.target.value ? Number(event.target.value) : null)} /></label>;
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="label">{label}</span><textarea className="field min-h-24" value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
