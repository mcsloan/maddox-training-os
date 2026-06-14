"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { localKpiRepository } from "@/lib/storage/localKpiRepository";
import { localSessionRepository } from "@/lib/storage/localSessionRepository";

const isDevelopment = process.env.NODE_ENV === "development";

export default function SessionError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ id: string }>();
  const routeId = typeof params?.id === "string" ? params.id : "unknown";
  const [userAgent, setUserAgent] = useState("Unavailable");

  useEffect(() => {
    setUserAgent(navigator.userAgent);
  }, []);

  const debugInfo = JSON.stringify({
    title: "Session crashed",
    routeId,
    message: error.message,
    stack: isDevelopment ? error.stack : undefined,
    digest: error.digest,
    userAgent,
    repository: localSessionRepository.getDiagnostics(),
  }, null, 2);

  async function copy() {
    try {
      await navigator.clipboard.writeText(debugInfo);
    } catch {
      window.prompt("Copy debug info:", debugInfo);
    }
  }

  function clear() {
    if (!window.confirm("Clear all local session logs and KPI results from this browser? This cannot be undone.")) return;
    localSessionRepository.clearAll();
    localKpiRepository.clearAll();
    window.location.href = "/today";
  }

  return (
    <div className="card mx-auto max-w-3xl border-2 border-red-300">
      <p className="label text-red-700">Uncaught client error</p>
      <h1 className="text-4xl font-black">Session crashed</h1>
      <dl className="mt-5 grid gap-2 text-sm sm:grid-cols-2">
        <dt className="font-bold">Route id</dt><dd className="break-all">{routeId}</dd>
        <dt className="font-bold">Exact error.message</dt><dd className="break-all text-red-700">{error.message}</dd>
        <dt className="font-bold">Browser userAgent</dt><dd className="break-all">{userAgent}</dd>
        {isDevelopment && <><dt className="font-bold">Error stack</dt><dd className="whitespace-pre-wrap break-all">{error.stack || "Unavailable"}</dd></>}
      </dl>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button className="btn-primary" onClick={copy}>Copy Debug Info</button>
        <Link className="btn-secondary" href={`/debug/session/${routeId}`}>Open Debug Page</Link>
        <Link className="btn-secondary" href="/today">Back to Today</Link>
        <button className="btn-secondary border-red-200 text-red-700" onClick={clear}>Clear Local Training Data</button>
      </div>
    </div>
  );
}
