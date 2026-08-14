export function VideoDemoLink({ href, exerciseName, label: suppliedLabel }: { href: string; exerciseName: string; label?: string }) {
  const label = suppliedLabel || `Watch demo: ${exerciseName}`;
  return <a aria-label={label} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-blue bg-navy text-white shadow-sm transition hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-200" href={href} rel="noreferrer" target="_blank" title={label}><svg aria-hidden="true" className="ml-0.5 h-4 w-4" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg><span className="sr-only">{label}</span></a>;
}
