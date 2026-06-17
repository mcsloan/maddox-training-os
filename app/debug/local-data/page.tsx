"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEYS = [
  "maddox-training-os:kpis",
  "maddox-training-os:sessions",
  "maddox-training-os:training-work-logs",
  "maddox-training-os:external-load-logs",
  "maddox-training-os:device-id",
] as const;

interface LocalDataSnapshot {
  key: string;
  value: string;
  present: boolean;
  characterLength: number;
  parsedCount: string;
  parseStatus: string;
}

export default function LocalDataDebugPage() {
  const [snapshots, setSnapshots] = useState<LocalDataSnapshot[]>([]);
  const [copyStatus, setCopyStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    setSnapshots(STORAGE_KEYS.map(readKey));
  }, []);

  async function copy(key: string, value: string) {
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        setCopyStatus((current) => ({ ...current, [key]: "Clipboard unavailable. Use Select all text." }));
        return;
      }
      await navigator.clipboard.writeText(value);
      setCopyStatus((current) => ({ ...current, [key]: "Copied." }));
    } catch {
      setCopyStatus((current) => ({ ...current, [key]: "Copy failed. Use Select all text." }));
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <section className="card border-2 border-amber-300 bg-amber-50">
        <p className="label text-amber-900">Read-only local data diagnostic</p>
        <h1 className="text-3xl font-black text-amber-950">Read-only diagnostics. Do not paste publicly. Do not clear storage.</h1>
        <p className="mt-3 text-sm font-semibold text-amber-900">
          This page only reads selected localStorage keys from this browser. It does not write, delete, migrate, or sync data.
        </p>
      </section>

      {snapshots.map((snapshot) => (
        <LocalDataCard
          copyStatus={copyStatus[snapshot.key] || ""}
          key={snapshot.key}
          onCopy={() => copy(snapshot.key, snapshot.value)}
          snapshot={snapshot}
        />
      ))}
    </div>
  );
}

function LocalDataCard({ copyStatus, onCopy, snapshot }: { copyStatus: string; onCopy: () => void; snapshot: LocalDataSnapshot }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function selectAllText() {
    textareaRef.current?.focus();
    textareaRef.current?.select();
  }

  return (
    <section className="card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="label">localStorage key</p>
          <h2 className="break-all text-xl font-black">{snapshot.key}</h2>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-black ${snapshot.present ? "bg-lime/30 text-navy" : "bg-rink text-slate-600"}`}>
          {snapshot.present ? "Present" : "Missing"}
        </span>
      </div>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-xl bg-ice p-3">
          <dt className="font-bold">Character length</dt>
          <dd>{snapshot.characterLength}</dd>
        </div>
        <div className="rounded-xl bg-ice p-3">
          <dt className="font-bold">Parsed count</dt>
          <dd>{snapshot.parsedCount}</dd>
        </div>
        <div className="rounded-xl bg-ice p-3">
          <dt className="font-bold">Parse status</dt>
          <dd>{snapshot.parseStatus}</dd>
        </div>
      </dl>

      <label className="mt-4 block">
        <span className="label">Raw JSON / text</span>
        <textarea
          className="field min-h-64 font-mono text-xs"
          readOnly
          ref={textareaRef}
          value={snapshot.value}
        />
      </label>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="btn-primary" disabled={!snapshot.present} onClick={onCopy}>
          Copy
        </button>
        <button className="btn-secondary" disabled={!snapshot.present} onClick={selectAllText}>
          Select all text
        </button>
        {copyStatus && <p className="text-sm font-semibold text-slate-600">{copyStatus}</p>}
      </div>
    </section>
  );
}

function readKey(key: string): LocalDataSnapshot {
  let value = "";
  let present = false;
  try {
    const stored = window.localStorage.getItem(key);
    present = stored !== null;
    value = stored ?? "";
  } catch (reason) {
    value = `Unable to read localStorage key. ${reason instanceof Error ? reason.message : String(reason)}`;
  }

  const parsed = parseValue(value, present);
  return {
    key,
    value,
    present,
    characterLength: value.length,
    parsedCount: parsed.count,
    parseStatus: parsed.status,
  };
}

function parseValue(value: string, present: boolean) {
  if (!present) return { count: "0", status: "missing" };
  if (!value) return { count: "0", status: "empty string" };
  try {
    const parsed = JSON.parse(value) as unknown;
    if (Array.isArray(parsed)) return { count: String(parsed.length), status: "JSON array" };
    if (parsed && typeof parsed === "object") return { count: String(Object.keys(parsed).length), status: "JSON object" };
    return { count: "1", status: `JSON ${typeof parsed}` };
  } catch {
    return { count: "n/a", status: "plain text / invalid JSON" };
  }
}
