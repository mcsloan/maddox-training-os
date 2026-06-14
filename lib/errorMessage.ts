export function readableError(reason: unknown) {
  if (reason instanceof Error) return reason.message;
  if (reason && typeof reason === "object") {
    const value = reason as { message?: unknown; code?: unknown };
    const message = typeof value.message === "string" ? value.message : "";
    const code = typeof value.code === "string" ? value.code : "";
    if (message && code) return `${message} (${code})`;
    if (message) return message;
    if (code) return code;
    try {
      return JSON.stringify(reason);
    } catch {
      return "Unknown object error";
    }
  }
  return String(reason);
}
