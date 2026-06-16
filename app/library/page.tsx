import { exerciseVideoMap } from "@/lib/imports/v8_4";
import { drills, equipmentSetups, loadRules, parentCues, userFacingPlanText, workoutBlocks } from "@/lib/trainingData";

export default function LibraryPage() {
  const warmups = drills.filter((drill) => drill.category === "Warm-up");
  const stickShot = drills.filter((drill) => drill.category === "Puck Control" || drill.category === "Shooting");
  const exercises = drills.filter((drill) => !warmups.includes(drill) && !stickShot.includes(drill));

  return (
    <div>
      <div className="mb-6"><p className="label">Browse before training</p><h1 className="text-4xl font-black">Training Library</h1><p className="mt-2 text-slate-600">Workbook-shaped local seed content. Approved source links can be added without changing completed-session history.</p></div>
      <LibrarySection title="Workout Blocks">{workoutBlocks.map((block) => <LibraryCard key={block.id} eyebrow={`${block.id} · ${block.category}`} title={block.name} body={block.description} detail={`Best use: ${block.bestUse}`} />)}</LibrarySection>
      <LibrarySection title="Warmups">{warmups.map((drill) => <DrillLibraryCard key={drill.id} drill={drill} />)}</LibrarySection>
      <LibrarySection title="Exercises">{exercises.map((drill) => <DrillLibraryCard key={drill.id} drill={drill} />)}</LibrarySection>
      <LibrarySection title="Stick / Shot Drills">{stickShot.map((drill) => <DrillLibraryCard key={drill.id} drill={drill} />)}</LibrarySection>
      <LibrarySection title="Video Library">{exerciseVideoMap.map((video) => <article className="rounded-2xl border border-rink p-4" key={video.canonicalExerciseId}><p className="label">{video.exerciseCategory} · {video.sourceFamily}</p><h3 className="font-black">{video.exerciseName}</h3><p className="mt-2 text-sm">{video.sourceDocument} · {video.sourcePageOrSection}</p><p className="mt-2 text-xs text-slate-500">{video.matchStatus}{video.sourceVideoTitle ? ` · ${video.sourceVideoTitle}` : ""}</p>{video.primaryVideoUrl ? <a className="mt-3 inline-block text-sm font-bold text-blue" href={video.primaryVideoUrl} target="_blank" rel="noreferrer">Open video ↗</a> : video.matchStatus === "Not Video Required" ? <p className="mt-3 text-sm font-semibold text-slate-500">No video required</p> : <p className="mt-3 text-sm font-semibold text-slate-400">Approved link pending</p>}</article>)}</LibrarySection>
      <LibrarySection title="Equipment Setup">{equipmentSetups.map((setup) => <article className="rounded-2xl border border-rink p-4" key={setup.id}><h3 className="font-black">{setup.name}</h3><ul className="mt-2 list-inside list-disc text-sm">{setup.items.map((item) => <li key={item}>{item}</li>)}</ul><p className="mt-3 text-sm text-slate-500">{setup.setupNotes}</p></article>)}</LibrarySection>
      <LibrarySection title="Sport Loads / Recovery Rules">{loadRules.map((rule) => <article className="rounded-2xl border border-rink p-4" key={rule.id}><p className="label">{userFacingPlanText(rule.appliesTo)}</p><h3 className="font-black">{userFacingPlanText(rule.title)}</h3><ul className="mt-3 list-inside list-disc space-y-1 text-sm">{rule.rules.map((item) => <li key={item}>{userFacingPlanText(item)}</li>)}</ul><p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-semibold text-amber-900">{userFacingPlanText(rule.warning)}</p></article>)}</LibrarySection>
      <LibrarySection title="Parent Cues">{parentCues.map((cue) => <LibraryCard key={cue.id} eyebrow="Parent cue" title={cue.cue} body="Use one calm cue, then let the player own the session." />)}</LibrarySection>
    </div>
  );
}

function LibrarySection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="card mb-6"><h2 className="text-2xl font-black">{title}</h2><div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">{children}</div></section>;
}

function LibraryCard({ eyebrow, title, body, detail }: { eyebrow: string; title: string; body: string; detail?: string }) {
  return <article className="rounded-2xl border border-rink p-4"><p className="label">{eyebrow}</p><h3 className="font-black">{title}</h3><p className="mt-2 text-sm">{body}</p>{detail && <p className="mt-2 text-xs text-slate-500">{detail}</p>}</article>;
}

function DrillLibraryCard({ drill }: { drill: (typeof drills)[number] }) {
  return <LibraryCard eyebrow={drill.category} title={drill.name} body={drill.purpose} detail={`Equipment: ${drill.equipment.join(", ")}`} />;
}
