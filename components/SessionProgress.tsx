export function SessionProgress({ current, total }: { current: number; total: number }) {
  const percent = Math.round((current / total) * 100);
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-bold">
        <span>Step {current} of {total}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-rink">
        <div className="h-full rounded-full bg-blue transition-all" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
