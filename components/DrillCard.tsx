"use client";

import { Drill, ExerciseCompletion, Rating } from "@/lib/types";
import type { ActivityPresentationChild } from "@/lib/projections/activityPresentation";
import { isUsableExternalUrl } from "@/lib/trainingData";
import { SessionTimer } from "./SessionTimer";

interface DrillVideoState {
  primaryVideoUrl: string | null;
  sourcePlaylistUrl: string | null;
  sourceVideoTitle: string | null;
  matchStatus: string;
}

export function DrillCard({ drill, completion, onChange, presentationChildren = [], videoState }: { drill: Drill; completion: ExerciseCompletion; onChange: (next: ExerciseCompletion) => void; presentationChildren?: ActivityPresentationChild[]; videoState?: DrillVideoState | null }) {
  const update = (patch: Partial<ExerciseCompletion>) => onChange({ ...completion, ...patch });
  const purpose = distinctPurpose(drill);

  return (
    <article className={`card border-2 transition ${completion.done ? "border-lime bg-lime/10" : "border-transparent"}`}>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-ice px-3 py-1 text-xs font-black uppercase tracking-wide text-blue">{drill.category}</span>
          <h2 className="mt-3 text-3xl font-black leading-tight">{drill.name}</h2>
          {purpose && <p className="mt-2 text-slate-600">{purpose}</p>}
        </div>
        {completion.done && <span className="rounded-full bg-lime px-3 py-1 text-sm font-black">DONE</span>}
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 rounded-2xl bg-ice p-4 sm:grid-cols-3">
        <div><p className="label">Plan</p><p className="font-bold">{drill.plannedPrescription || planLabel(drill)}</p></div>
        <div><p className="label">Rest / tempo</p><p className="font-bold">{restTempoLabel(drill)}</p></div>
        <div><p className="label">Equipment</p><p className="font-bold">{drill.equipment.length ? drill.equipment.join(", ") : "No equipment listed"}</p></div>
      </div>

      {presentationChildren.length > 0 && (
        <div className="mb-5 rounded-2xl border border-rink bg-white p-4">
          <p className="label">Planned drill details</p>
          <div className="mt-3 grid gap-3">
            {presentationChildren.map((child) => (
              <article className="rounded-xl bg-ice p-3" key={child.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-black">{child.title}</h3>
                  <p className="text-sm font-bold text-slate-600">{childPlanLabel(child)}</p>
                </div>
                {child.instruction && <p className="mt-2 text-sm text-slate-700">{child.instruction}</p>}
                {child.coachingCue && child.coachingCue !== child.instruction && <p className="mt-2 text-sm font-semibold text-slate-700">{child.coachingCue}</p>}
                {child.videoUrl && <a className="mt-2 inline-block text-sm font-bold text-blue" href={child.videoUrl} target="_blank" rel="noreferrer">Open Video Demo</a>}
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          {purpose && (
            <>
              <p className="label">Purpose</p>
              <p>{purpose}</p>
            </>
          )}
          <p className="label mt-5">Setup checklist</p>
          <ul className="space-y-2">
            {drill.setupChecklist.map((item) => <li key={item} className="flex gap-2"><span className="font-black text-blue">□</span><span>{item}</span></li>)}
          </ul>
          {(drill.plannedGroup || drill.sourceCode || drill.sourcePage) && (
            <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-slate-700">
              {drill.plannedGroup && <span className="rounded-full bg-white px-3 py-1">{drill.plannedGroup}</span>}
              {drill.sourceCode && <span className="rounded-full bg-white px-3 py-1">Code {drill.sourceCode}</span>}
              {drill.sourcePage && <span className="rounded-full bg-white px-3 py-1">{drill.sourcePage}</span>}
            </div>
          )}
          <p className="mt-3 text-sm text-slate-500">{drill.setup}</p>
          <p className="label mt-5">Do it</p>
          <ol className="list-inside list-decimal space-y-2">
            {drill.instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
          </ol>
          <p className="label mt-5">Coach cues</p>
          <div className="flex flex-wrap gap-2">
            {drill.coachingCues.map((cue) => <span key={cue} className="rounded-full bg-lime/60 px-3 py-1 text-sm font-bold">{cue}</span>)}
          </div>
          <details className="mt-5 rounded-xl border border-rink p-3" open>
            <summary className="cursor-pointer font-bold">Coach details and safety</summary>
            <p className="label mt-3">Common mistakes</p>
            <ul className="list-inside list-disc space-y-1">{drill.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul>
            <p className="label mt-3">Beginner version</p>
            <p>{drill.regression}</p>
            <p className="label mt-3">Harder version</p>
            <p>{drill.progression}</p>
            <p className="label mt-3">Safety</p>
            <p>{drill.safetyNotes}</p>
          </details>
          <DrillVideoLinks drill={drill} videoState={videoState} />
        </div>
        <div className="space-y-4">
          {drill.plannedDuration && <SessionTimer initialSeconds={completion.actualDuration || 0} onChange={(actualDuration) => update({ actualDuration })} />}
          <div className="grid grid-cols-2 gap-3">
            <label><span className="label">Actual sets</span><input className="field" type="number" inputMode="numeric" value={completion.actualSets ?? ""} onChange={(event) => update({ actualSets: event.target.value ? Number(event.target.value) : null })} /></label>
            <label><span className="label">Actual reps</span><input className="field" type="number" inputMode="numeric" value={completion.actualReps ?? ""} onChange={(event) => update({ actualReps: event.target.value ? Number(event.target.value) : null })} /></label>
            <label><span className="label">Time (sec)</span><input className="field" type="number" inputMode="numeric" value={completion.actualDuration ?? ""} onChange={(event) => update({ actualDuration: event.target.value ? Number(event.target.value) : null })} /></label>
            <label><span className="label">Distance</span><input className="field" type="number" inputMode="decimal" value={completion.actualDistance ?? ""} onChange={(event) => update({ actualDistance: event.target.value ? Number(event.target.value) : null })} /></label>
          </div>
          <label><span className="label">Difficulty</span><select className="field" value={completion.difficulty ?? ""} onChange={(event) => update({ difficulty: event.target.value ? Number(event.target.value) as Rating : null })}><option value="">Choose 1-5</option>{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} / 5</option>)}</select></label>
          <label><span className="label">Quick note</span><textarea className="field min-h-20" value={completion.notes} onChange={(event) => update({ notes: event.target.value })} placeholder="Optional" /></label>
          <button className={`min-h-20 w-full rounded-2xl text-xl font-black ${completion.done ? "bg-lime text-navy" : "bg-blue text-white"}`} onClick={() => update({ done: !completion.done })}>
            {completion.done ? "Completed ✓" : "Mark Done"}
          </button>
        </div>
      </div>
    </article>
  );
}

function childPlanLabel(child: ActivityPresentationChild) {
  const parts = [];
  if (child.plannedSets) parts.push(`${child.plannedSets} sets`);
  if (child.plannedReps) parts.push(child.plannedReps);
  if (child.plannedDurationMinutes) parts.push(`${child.plannedDurationMinutes} min`);
  return parts.join(" · ") || "Planned detail";
}

function distinctPurpose(drill: Drill) {
  const purpose = drill.purpose.trim();
  if (!purpose) return "";
  const normalizedPurpose = normalizeLabel(purpose);
  if (normalizedPurpose === normalizeLabel(drill.category)) return "";
  if (normalizedPurpose === normalizeLabel(drill.name)) return "";
  return purpose;
}

function normalizeLabel(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function planLabel(drill: Drill) {
  const parts = [];
  if (drill.plannedSets) parts.push(`${drill.plannedSets} sets`);
  if (drill.plannedReps) parts.push(`${drill.plannedReps} reps`);
  if (drill.plannedDuration) parts.push(`${drill.plannedDuration} sec`);
  return parts.join(" × ") || "Plan detail not listed";
}

function restTempoLabel(drill: Drill) {
  const parts = [];
  if (drill.plannedRest) parts.push(`Rest ${drill.plannedRest}`);
  if (drill.plannedTempo) parts.push(`Tempo ${drill.plannedTempo}`);
  return parts.join(" · ") || "Not listed";
}

function DrillVideoLinks({ drill, videoState }: { drill: Drill; videoState?: DrillVideoState | null }) {
  if (videoState) {
    return (
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {isUsableExternalUrl(videoState.primaryVideoUrl) ? <a className="btn-secondary" href={videoState.primaryVideoUrl!} target="_blank" rel="noreferrer">Open Video Demo</a> : videoState.matchStatus === "Not Video Required" ? <p className="rounded-2xl bg-ice p-3 text-sm font-bold text-slate-600">No video required</p> : <p className="rounded-2xl bg-ice p-3 text-sm font-bold text-slate-500">Approved link pending</p>}
        {isUsableExternalUrl(videoState.sourcePlaylistUrl) && <a className="btn-secondary" href={videoState.sourcePlaylistUrl!} target="_blank" rel="noreferrer">Open Source Playlist</a>}
      </div>
    );
  }

  if (!isUsableExternalUrl(drill.videoUrl) && !isUsableExternalUrl(drill.qrUrl)) return null;
  return <div className="mt-4 grid gap-2 sm:grid-cols-2">{isUsableExternalUrl(drill.videoUrl) && <a className="btn-secondary" href={drill.videoUrl!} target="_blank" rel="noreferrer">Open Video Demo</a>}{isUsableExternalUrl(drill.qrUrl) && <a className="btn-secondary" href={drill.qrUrl!} target="_blank" rel="noreferrer">Open QR-Ready Link</a>}</div>;
}
