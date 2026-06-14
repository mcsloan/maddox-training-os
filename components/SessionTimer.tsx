"use client";

import { useEffect, useState } from "react";

export function SessionTimer({ initialSeconds = 0, onChange }: { initialSeconds?: number; onChange: (seconds: number) => void }) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        const next = value + 1;
        onChange(next);
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, onChange]);

  const display = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  return (
    <div className="rounded-2xl bg-navy p-4 text-white">
      <p className="label text-slate-300">Timer</p>
      <p className="mb-4 font-mono text-5xl font-black tracking-tight">{display}</p>
      <div className="grid grid-cols-2 gap-2">
        <button className="min-h-12 rounded-xl bg-lime font-bold text-navy" onClick={() => setRunning((value) => !value)}>
          {running ? "Pause" : "Start"}
        </button>
        <button className="min-h-12 rounded-xl bg-white/15 font-bold" onClick={() => { setRunning(false); setSeconds(0); onChange(0); }}>
          Reset
        </button>
      </div>
    </div>
  );
}
