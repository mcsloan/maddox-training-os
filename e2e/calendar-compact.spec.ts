import { expect, test } from "@playwright/test";

test("Calendar opens on the current week and expands one canonical date at a time", async ({ page }) => {
  await page.goto("/calendar");
  const weeks = page.locator("section[data-calendar-week]");
  await expect(weeks.first().locator('[data-today="true"]')).toHaveCount(1);
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
  const currentWeek = page.locator("section[data-calendar-week]").first();
  await expect(currentWeek.locator('[data-today="true"]')).toHaveCount(1);
  const rows = currentWeek.locator("[data-calendar-row]");
  await expect(rows).toHaveCount(7);
  const firstFiveBoxes = await Promise.all(Array.from({ length: 5 }, (_, index) => rows.nth(index).boundingBox()));
  for (const box of firstFiveBoxes) expect(box?.height ?? 9999).toBeLessThan(90);
  const firstTop = firstFiveBoxes[0]?.y ?? 0;
  const fifthBottom = (firstFiveBoxes[4]?.y ?? 9999) + (firstFiveBoxes[4]?.height ?? 9999);
  expect(fifthBottom - firstTop).toBeLessThan(410);
  expect(fifthBottom).toBeLessThan(844);
  const todayBox = await currentWeek.locator('[data-today="true"] [data-calendar-row]').boundingBox();
  const ordinaryBox = await rows.first().boundingBox();
  expect(Math.abs((todayBox?.height ?? 9999) - (ordinaryBox?.height ?? 0))).toBeLessThanOrEqual(8);
  await expect(currentWeek.locator('[data-today="true"]')).toContainText("TODAY");
  await expect(currentWeek.locator('[data-today="true"] a[href^="/log/"]')).toHaveCount(1);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("Calendar preserves its desktop grid while mobile rows stay independently expandable", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/calendar");
  await expect(page.getByText("Week / Phase", { exact: true }).first()).toBeVisible();
  const currentWeek = page.locator("section[data-calendar-week]").first();
  const rows = currentWeek.locator("[data-calendar-row]");
  await expect(rows).toHaveCount(7);
  const desktopBox = await rows.first().boundingBox();
  expect(desktopBox?.height ?? 9999).toBeLessThan(100);

  const firstToggle = currentWeek.getByRole("button", { name: /^Show details/ }).first();
  const secondToggle = currentWeek.getByRole("button", { name: /^Show details/ }).nth(1);
  await firstToggle.click();
  await expect(currentWeek.locator("[data-calendar-details]")).toHaveCount(1);
  await secondToggle.click();
  await expect(currentWeek.locator("[data-calendar-details]")).toHaveCount(1);
  await expect(firstToggle).toHaveAttribute("aria-expanded", "false");
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
