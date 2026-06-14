"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function DebugSessionError({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ id: string }>();
  const routeId = typeof params?.id === "string" ? params.id : "unknown";
  return <div className="card mx-auto max-w-3xl border-2 border-red-300"><h1 className="text-3xl font-black">Debug page crashed</h1><p className="mt-4 break-all font-bold text-red-700">{error.message}</p><pre className="mt-4 overflow-auto whitespace-pre-wrap rounded-xl bg-red-50 p-3 text-xs">{error.stack || "No stack available"}</pre><div className="mt-5 flex gap-3"><Link className="btn-primary" href={`/debug/session/${routeId}`}>Reload Debug Page</Link><Link className="btn-secondary" href="/today">Back to Today</Link></div></div>;
}
