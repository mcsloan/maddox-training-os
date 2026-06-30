export function calculateShuttleTotalMetres(completedLengthsValue: string | number, partialMetresValue: string | number) {
  if (String(completedLengthsValue).trim() === "" || String(partialMetresValue).trim() === "") return null;
  const completedLengths = Number(completedLengthsValue);
  const partialMetres = Number(partialMetresValue);
  if (!Number.isInteger(completedLengths) || completedLengths < 0) return null;
  if (!Number.isFinite(partialMetres) || partialMetres < 0 || partialMetres >= 10) return null;
  const total = completedLengths * 10 + partialMetres;
  if (total <= 0) return null;
  return Math.round(total * 100) / 100;
}
