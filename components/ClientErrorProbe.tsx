"use client";

import { useEffect, useState } from "react";

export function ClientErrorProbe() {
  const [error, setError] = useState("");

  useEffect(() => {
    function onError(event: ErrorEvent) {
      setError(`${event.message}\n${event.error?.stack || ""}`);
    }
    function onRejection(event: PromiseRejectionEvent) {
      setError(`${event.reason?.message || String(event.reason)}\n${event.reason?.stack || ""}`);
    }
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  async function copy() {
    const text = `${error}\n\nUserAgent: ${navigator.userAgent}\nURL: ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy client error:", text);
    }
  }

  if (process.env.NODE_ENV !== "development" || !error) return null;
  return <aside className="fixed inset-x-2 bottom-24 z-50 max-h-56 overflow-auto rounded-xl border-2 border-red-600 bg-red-100 p-3 text-xs text-red-900 shadow-xl sm:bottom-2 sm:left-auto sm:max-w-lg"><p className="font-black">Client JavaScript Error</p><pre className="my-2 whitespace-pre-wrap break-all">{error}</pre><button className="rounded-lg bg-red-700 px-3 py-2 font-bold text-white" onClick={copy}>Copy Error</button></aside>;
}
