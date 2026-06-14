"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const warning = "This browser is too old for Maddox Training OS. Please use Chrome on this Mac, or update iPhone/iPad to iOS/iPadOS 16.4+.";

function isUnsupportedSafari(userAgent: string) {
  const iosMatch = userAgent.match(/(?:iPhone|iPad|iPod).*OS (\d+)[._](\d+)/);
  if (iosMatch) {
    const iosMajor = Number(iosMatch[1]);
    const iosMinor = Number(iosMatch[2] || 0);
    return iosMajor < 16 || (iosMajor === 16 && iosMinor < 4);
  }
  const isSafari = /Safari\//.test(userAgent) && !/(Chrome|Chromium|CriOS|Edg|EdgiOS|OPR|FxiOS)\//.test(userAgent);
  if (!isSafari) return false;
  const match = userAgent.match(/Version\/(\d+)(?:\.(\d+))?/);
  if (!match) return false;
  const major = Number(match[1]);
  const minor = Number(match[2] || 0);
  return major < 16 || (major === 16 && minor < 4);
}

export function BrowserCompatibilityNotice() {
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    const result = isUnsupportedSafari(navigator.userAgent);
    if (result) {
      const legacyNotice = document.getElementById("legacy-safari-notice");
      if (legacyNotice) legacyNotice.style.display = "none";
    }
    setUnsupported(result);
  }, []);

  if (!unsupported) return null;
  return <aside className="border-b-2 border-red-700 bg-red-100 px-4 py-3 text-center text-sm font-bold text-red-900"><span>{warning}</span> <Link className="underline" href="/compatibility">Compatibility details</Link></aside>;
}
