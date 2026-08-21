import { expect, test } from "@playwright/test";

const dates = enumerateDates("2026-08-14", "2026-09-18");
const screenshotDates = new Set(["2026-08-14", "2026-08-16", "2026-08-18", "2026-08-24", "2026-08-31"]);
const forbidden = /Use the referenced approved source drill\/module|Quality first|Weakness Overlay|None Camp Provides Conditioning|source missing|approved module reference|content gap|unresolved mapping/i;
const expectedDemoCounts: Record<string, number> = {
  "2026-08-17": 1,
  "2026-08-18": 9,
  "2026-08-19": 3,
  "2026-08-21": 1,
  "2026-09-01": 2,
  "2026-09-03": 2,
};

test("all forward Day and Log routes satisfy the read-only product contract", async ({ page }) => {
  for (const date of dates) {
    await page.goto(`/day/${date}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: "Log Today's Training", exact: true })).toHaveCount(1);
    await expect(page.locator("body")).not.toContainText(forbidden);
    if (screenshotDates.has(date)) await page.screenshot({ fullPage: true, path: `qa-artifacts/forward-product-quality/${date}-day.png` });

    await page.goto(`/log/${date}`);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Readiness", exact: true })).toHaveCount(1);
    await expect(page.getByRole("heading", { name: "Reflection", exact: true })).toHaveCount(1);
    await expect(page.locator("body")).not.toContainText(forbidden);
    const demoLinks = page.locator('a[aria-label^="Watch"]');
    await expect(demoLinks).toHaveCount(expectedDemoCounts[date] ?? 0);
    if (date === "2026-08-18") {
      await expect(page.getByRole("link", { name: "Watch Speed Stack A warm-up and cooldown demonstrations" })).toHaveCount(1);
      await expect(page.locator("body")).not.toContainText(/WU-10|MOB-15/);
    }
    if (screenshotDates.has(date)) await page.screenshot({ fullPage: true, path: `qa-artifacts/forward-product-quality/${date}-log.png` });
  }
});

test("approved Skill/Shot/IQ videos use the accessible puck control", async ({ page }) => {
  await page.goto("/log/2026-08-19");
  const expected = [
    ["Read-React Puck Carry", "https://www.icehockeysystems.com/practice/1/85576"],
    ["Backhand Toe-Drag Escape", "https://www.youtube.com/watch?v=zQgpIbT5K3A&t=7s"],
    ["Sprint-In Shot", "https://www.icehockeysystems.com/skill-development-videos/shooting-stride"],
  ] as const;
  for (const [name, url] of expected) {
    const link = page.getByRole("link", { name: `Watch demo: ${name}` });
    await expect(link).toHaveAttribute("href", url);
    await expect(link).toHaveAttribute("title", `Watch demo: ${name}`);
  }
});

test("Aug 20 is one 14-item KPI Test in the canonical execution flow", async ({ page }) => {
  await page.goto("/kpis");
  const scoreboard = page.locator("table").first();
  await expect(scoreboard.locator("tbody tr")).toHaveCount(14);
  await expect(scoreboard.locator("tbody")).not.toContainText("Jun 30");
  await page.screenshot({ fullPage: true, path: "qa-artifacts/forward-product-quality/2026-08-20-kpi-dashboard.png" });

  await page.goto("/log/2026-08-20");
  await expect(page.locator("[data-kpi-id]")).toHaveCount(14);
  await expect(page.getByText("Puck-Control Weave", { exact: true })).toBeVisible();
  await expect(page.getByText("Deferred / Not Tested", { exact: true })).toHaveCount(14);
  await expect(page.getByText("Enter KPI Results", { exact: true })).toHaveCount(0);
  await page.screenshot({ fullPage: true, path: "qa-artifacts/forward-product-quality/2026-08-20-log.png" });
});

test("Today redirects to the canonical dated Day route", async ({ page }) => {
  await page.goto("/today");
  await expect(page).toHaveURL(/\/day\/\d{4}-\d{2}-\d{2}$/);
});

test("Plan renders the canonical 14-week performance period through Sep 18", async ({ page }) => {
  await page.goto("/plan");
  await expect(page.getByText("14-week performance plan", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "14-Week Methodology", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /^W13 ·/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /^W14 ·/ })).toBeVisible();
  await expect(page.getByText(/Week 13 · Sep 7-Sep 13/)).toBeVisible();
  await expect(page.getByText(/Week 14 · Sep 14-Sep 18/)).toBeVisible();
  await expect(page.getByText("Weekly Load · W1-W12", { exact: true })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("12-week offseason plan");
});

function enumerateDates(start: string, end: string) {
  const result: string[] = [];
  for (let date = new Date(`${start}T12:00:00Z`); date <= new Date(`${end}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + 1)) result.push(date.toISOString().slice(0, 10));
  return result;
}
