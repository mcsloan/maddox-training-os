import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));

import CanonicalDayLogPage from "./page";

async function renderLog(date: string) { return renderToStaticMarkup(await CanonicalDayLogPage({ params: Promise.resolve({ date }) })); }

describe("unified canonical date logging route", () => {
  it("shows only the corrected 90-minute Marc Sport Load on Aug 14", async () => {
    const html = await renderLog("2026-08-14");
    expect(html.match(/>Marc O’Connor Ice</g)).toHaveLength(1);
    expect(html).toContain("90 minutes");
    expect(html).not.toContain("Game-Speed Puck + Shot");
    expect(html).not.toContain("Completed?");
  });

  it("shows exact Phase 5 Week 2 A source dose on Aug 18", async () => {
    const html = await renderLog("2026-08-18");
    for (const value of ["Lateral Cross Under Start", "3 sets", "15yd/side", "Rest 30s", "Wall March Hold", "Tempo 0-5-0", "Towel ISO Lateral Squat", "Towel Body Saw to Pike Up", "1.5 Rep Towel Leg Curl", "Split Squat Wall Anti-Rotation Press Hold", "50-Yard Shuttle Run", "52s/2min"]) expect(html).toContain(value);
    expect(html.match(/Save Today’s Training/g)).toHaveLength(1);
    for (const value of ["Get Mobile", "Wall Ankle Mobility", "Get Stable", "Plank", "30 sec", "Get Warm", "Power Skip (Height)", "Get Activated", "Lateral Wall Push", "5 sec/side", "Lying Figure 4 Glute Stretch", "Bretzel", "Kneeling Lat Stretch", "2:00 OR 1:00/side", "5-second inhale", "close your eyes"]) expect(html).toContain(value);
    expect(html.match(/5-second inhale/g)).toHaveLength(1);
    expect(html).not.toContain("WU-10");
    expect(html).not.toContain("MOB-15");
    expect(html.match(/playlist\?list=PLAMIllZnMikBopeN4A4PgKYT8AImGsJEN/g)).toHaveLength(1);
    expect(html).toContain("Watch Speed Stack A warm-up and cooldown demonstrations");
  });

  it("shows source-backed equipment and space requirements for Aug 19 forward drills", async () => {
    const html = await renderLog("2026-08-19");
    expect(html).toContain("Full-Speed Weave with Scan");
    expect(html).toContain("Read-React Puck Carry");
    expect(html).toContain("Sprint-In Shot");
    expect(html).toContain("Equipment / space:");
    expect(html).toContain("Stick, puck/ball, 4–6 cones.");
    expect(html).toContain("Stick, puck/ball, colored cones or parent point.");
    expect(html).toContain("10–15 yd lane, puck, net.");
    expect(html).toContain("Cones in line or staggered.");
    expect(html).toContain("Set 3 exits left/straight/right.");
    expect(html).toContain("Start away from puck/net.");
    expect(html).not.toContain("Basement substitute");
  });

  it("shows each Aug 16 Sport Load once in the unified form", async () => {
    const html = await renderLog("2026-08-16");
    expect(html.match(/>Marc O’Connor Ice</g)).toHaveLength(1);
    expect(html.match(/>4v4 Hockey</g)).toHaveLength(1);
    expect(html.match(/Save Today’s Training/g)).toHaveLength(1);
  });

  it("keeps the Aug 20 KPI battery isolated in the unified experience", async () => {
    const html = await renderLog("2026-08-20");
    expect(html).toContain("KPI Retest");
    expect(html.match(/data-kpi-id=/g)).toHaveLength(14);
    for (const name of ["10-Yard Sprint", "Broad Jump", "5-10-5 Pro Agility", "50-Shot Target Hits", "Puck-Control Weave", "Head-Up Callout %", "30-Second Quick Hands Touch Count", "Plank Quality", "100m Sprint", "45-Second Hockey Shift Shuttle", "Push-Up Test", "Flexed-Arm Hang", "Zwift Bike 3x10s Peak Power", "Vertical Jump"]) expect(html).toContain(name);
    expect(html.match(/type="checkbox"/g)).toHaveLength(14);
    expect(html).not.toContain("Enter KPI Results");
    expect(html).not.toContain("Completed?");
    expect(html).not.toContain("Speed Stack");
    expect(html).not.toContain("Save Today’s Training");
  });
});
