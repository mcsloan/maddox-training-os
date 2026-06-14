"use client";

import { useEffect, useState } from "react";

export function ReactHydrationDiagnostic() {
  const [status, setStatus] = useState("server/default");
  const [counter, setCounter] = useState(0);
  const [userAgent, setUserAgent] = useState("not available before hydration");
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    setStatus("hydrated");
    setUserAgent(navigator.userAgent);
    const onError = (event: ErrorEvent) => setLog((current) => [...current, `${new Date().toISOString()} window.onerror: ${event.message}\\n${event.error?.stack || ""}`]);
    const onRejection = (event: PromiseRejectionEvent) => setLog((current) => [...current, `${new Date().toISOString()} unhandledrejection: ${event.reason?.message || String(event.reason)}\\n${event.reason?.stack || ""}`]);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return (
    <article className="card">
      <p className="label">Tiny client component</p>
      <h1 className="text-3xl font-black">React Hydration Diagnostic</h1>
      <div className="mt-5 space-y-3 rounded-2xl bg-ice p-4">
        <p><strong>Hydration status:</strong> {status}</p>
        <p><strong>Counter:</strong> {counter}</p>
        <p className="break-all"><strong>Browser userAgent:</strong> {userAgent}</p>
      </div>
      <button className="btn-primary mt-4" onClick={() => setCounter((value) => value + 1)}>Increment counter</button>
      <div className="mt-5"><p className="label">Visible client error log</p><pre className="min-h-32 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-3 text-xs text-white">{log.join("\\n\\n") || "No client errors captured."}</pre></div>
    </article>
  );
}
