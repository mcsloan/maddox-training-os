import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import DayPage from "./page";
import { projectCanonicalDay } from "@/lib/projections/canonicalDay";
import { buildForwardPlanIntegrityMatrix } from "@/lib/projections/forwardPlanIntegrity";

async function renderDay(date: string) { return renderToStaticMarkup(await DayPage({ params: Promise.resolve({ date }) })); }

describe("compact canonical Day route", () => {
  it.each(["2026-08-12", "2026-08-11", "2026-08-05", "2026-07-23", "2026-07-27", "2026-06-30"])("preserves Phase 1 canonical identity while using the compact site-wide contract for %s", async (date) => {
    const day = projectCanonicalDay(date);
    const html = await renderDay(date);
    expect(html).toContain(day.title);
    expect(html).not.toContain("Readiness check");
    expect(html).not.toContain("End-of-day reflection");
    expect(html).not.toContain("None Camp Provides Sport Conditioning");
    expect(html.match(/Log Today(?:&#x27;|')s Training/g)).toHaveLength(1);
    expect(html).toContain(`/log/${date}`);
  });

  it.each([
    ["2026-08-14", "Marc O&#x27;Connor Hockey", "90 min"],
    ["2026-08-15", "Marc O&#x27;Connor Hockey", "Marc O’Connor Ice"],
    ["2026-08-16", "Marc + 4v4 Game-Speed Day", "4v4 Hockey"],
    ["2026-08-18", "Speed Stack A + Puck Quality", "Training total: 75 min"],
    ["2026-08-20", "KPI Retest", "Training total: 50 min"],
    ["2026-08-24", "Sensplex Competitive Player Development Camp", "Sensplex Competitive Player Development Camp"],
    ["2026-08-29", "Marc O&#x27;Connor Ice", "120 min"],
    ["2026-08-31", "Recovery / Absorb", "Training total: 10 min"],
    ["2026-09-01", "Speed/Power Primer + Shot", "Training total: 16 min"],
    ["2026-09-07", "NMHA Player Pathway / Pre-Tryout Conditioning", "50 min"],
    ["2026-09-12", "Nepean Raiders U12B Tryout — Skills", "120 min"],
    ["2026-09-17", "Invite Only / Intersquad", "60 min"],
    ["2026-09-18", "U12B Tryout — Balance", "90 min"],
  ])("renders approved forward summary for %s", async (date, title, expected) => {
    const html = await renderDay(date);
    expect(html).toContain(title);
    expect(html).toContain(expected);
    expect(html).not.toContain("Weakness Overlay");
    expect(html).not.toContain("Required");
    expect(html.match(/Log Today(?:&#x27;|')s Training/g)).toHaveLength(1);
  });

  it("integrates shooting focus and never duplicates it as a second workout", async () => {
    const html = await renderDay("2026-08-17");
    expect(html).toContain("Focus: Shot accuracy");
    expect(html.match(/Shooting accuracy/g)).toHaveLength(1);
  });

  it("renders the corrected Aug 14 Marc Sport Load without displaced training debt", async () => {
    const html = await renderDay("2026-08-14");
    expect(html.match(/>Marc O’Connor Ice</g)).toHaveLength(1);
    expect(html).toContain("90 min");
    expect(html).not.toContain("Game-Speed Puck + Shot");
    expect(html).not.toContain("Training total:");
  });

  it("renders stacked Aug 16 Sport Loads once each and no training total", async () => {
    const html = await renderDay("2026-08-16");
    expect(html.match(/>Marc O’Connor Ice</g)).toHaveLength(1);
    expect(html.match(/>4v4 Hockey</g)).toHaveLength(1);
    expect(html).not.toContain("Training total:");
  });

  it("renders every forward date with one canonical row per executable activity and one primary CTA", async () => {
    for (const row of buildForwardPlanIntegrityMatrix()) {
      const html = await renderDay(row.date);
      expect(html.match(/Log Today(?:&#x27;|')s Training/g), row.date).toHaveLength(1);
      expect(html, row.date).not.toContain("Readiness Check");
      expect(html, row.date).not.toContain("End-of-day Reflection");
      for (const id of row.loggingIds) expect(html.match(new RegExp(`data-activity-id="${id}"`, "g")), `${row.date}:${id}`).toHaveLength(1);
      if (row.trainingTotal) expect(html, row.date).toContain(`Training total: ${row.trainingTotal} min`);
    }
  });
});
