import { expect, test } from "@playwright/test";

test("Calendar opens on the current week and expands one canonical date at a time", async ({ page }) => {
  await page.goto("/calendar");
  const weeks = page.locator("section[data-calendar-week]");
  await expect(weeks.first()).toHaveAttribute("data-calendar-week", "9");
  await expect(page.locator("[data-calendar-date]")).toHaveCount(84);
  await expect(page.locator('[data-today="true"]')).toHaveCount(1);
  await expect(page.locator('[data-today="true"] [data-calendar-details]')).toHaveCount(0);
  const todayBox = await page.locator('[data-today="true"]').boundingBox();
  expect(todayBox?.y ?? 9999).toBeLessThan(900);

  const aug16 = page.locator('[data-calendar-date="2026-08-16"]');
  const logLink = aug16.getByRole("link", { name: /training for Sunday, August 16/ });
  await expect(logLink).toHaveAttribute("href", "/log/2026-08-16");
  await logLink.click();
  await expect(page).toHaveURL(/\/log\/2026-08-16$/);
  await page.goBack();
  const aug16Toggle = aug16.getByRole("button", { name: "Show details for Sunday, August 16" });
  await expect(aug16Toggle).toHaveAttribute("aria-expanded", "false");
  await aug16Toggle.click();
  await expect(aug16.getByRole("button", { name: "Hide details for Sunday, August 16" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("[data-calendar-details]")).toHaveCount(1);
  await expect(aug16.getByText("Marc O’Connor Ice", { exact: true })).toHaveCount(1);
  await expect(aug16.getByText("4v4 Hockey", { exact: true })).toHaveCount(1);
  await expect(aug16).toContainText("Bell Sensplex Myers Automotive Arena");
  await aug16.getByRole("button", { name: "Hide details for Sunday, August 16" }).click();
  await expect(aug16.locator("[data-calendar-details]")).toHaveCount(0);

  const aug18 = page.locator('[data-calendar-date="2026-08-18"]');
  await aug18.getByRole("button", { name: "Show details for Tuesday, August 18" }).click();
  await expect(page.locator("[data-calendar-details]")).toHaveCount(1);
  await expect(aug16.locator("[data-calendar-details]")).toHaveCount(0);
  await expect(aug18).toContainText("Phase 5 Speed Stack A — Week 2");
  await expect(page.locator('[data-calendar-date="2026-08-20"]')).toContainText("KPI");

  await page.goto("/day/2026-08-16");
  await expect(page.getByRole("link", { name: "Log Today's Training", exact: true })).toHaveAttribute("href", "/log/2026-08-16");
});

test("Calendar remains compact without horizontal overflow at iPhone width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/calendar");
  await expect(page.locator("section[data-calendar-week]").first()).toHaveAttribute("data-calendar-week", "9");
  await expect(page.locator('[data-calendar-date="2026-08-16"]')).toBeVisible();
  const rowBox = await page.locator('[data-calendar-date="2026-08-16"] > div').first().boundingBox();
  expect(rowBox?.height ?? 9999).toBeLessThan(260);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("Calendar status combines completed-session and distinct Sport Load evidence", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("maddox-training-os:sessions", JSON.stringify([{
      id: "legacy-session-aug-17",
      workoutId: "legacy-workout",
      date: "2026-08-17",
      startedAt: "2026-08-17T12:00:00.000Z",
      completedAt: "2026-08-17T13:00:00.000Z",
      currentStep: 0,
      status: "completed",
      readiness: { energy: 4, soreness: 1, focus: 4, notes: "" },
      exercises: {},
      kpiResults: {},
      reflection: { energy: 4, confidence: 4, difficulty: 3, improvement: "", notes: "" },
    }]));
    localStorage.setItem("maddox-training-os:external-load-logs", JSON.stringify([
      {
        id: "marc-aug-16-log",
        externalLoadId: "v84-sport-load:2026-08-16:0:marc-o-connor-ice",
        date: "2026-08-16",
        title: "Marc O’Connor Ice",
        attended: true,
        actualDuration: 60,
        effort: 4,
        updatedAt: "2099-01-01T00:00:00.000Z",
      },
      {
        id: "4v4-aug-16-partial",
        externalLoadId: "v84-sport-load:2026-08-16:1:4v4-hockey",
        date: "2026-08-16",
        title: "4v4 Hockey",
        attended: false,
        actualDuration: null,
        effort: null,
        updatedAt: "2099-01-01T00:00:00.000Z",
      },
      {
        id: "unrelated-aug-16-log",
        externalLoadId: "not-in-the-plan",
        date: "2026-08-16",
        title: "Unrelated Ice",
        attended: true,
        actualDuration: 30,
        effort: 3,
        updatedAt: "2099-01-01T00:00:00.000Z",
      },
    ]));
  });
  await page.goto("/calendar");

  const aug17 = page.locator('[data-calendar-date="2026-08-17"]');
  await expect(aug17).toContainText("Logged");
  await expect(aug17.getByRole("link", { name: /Update training/ })).toHaveAttribute("href", "/log/2026-08-17");

  const aug16 = page.locator('[data-calendar-date="2026-08-16"]');
  await expect(aug16).toContainText("Partially logged");
  await aug16.getByRole("button", { name: "Show details for Sunday, August 16" }).click();
  await expect(aug16.getByText(/^Logged · 60 min/)).toHaveCount(1);
  await expect(aug16.getByText(/^Partially logged · — min/)).toHaveCount(1);
  await expect(aug16).not.toContainText("Unrelated Ice");
});
