import { expect, test, type Page } from "@playwright/test";

const dayPath = "/day/2026-06-19";
const sessionPath = "/session/session-2026-06-19";
const expectedTitle = "Acceleration and accurate shooting";
const staleCompletedTitle = "Speed Stack C, conditioning, and shooting.";
const productionBadgePattern = /v\d+\.\d+\.\d+\s*·\s*[0-9a-f]{7,}\s*·\s*production/i;

const dangerousButtons = [
  "Finish Session",
  "Save",
  "Submit",
  "Start Fresh Attempt",
  "Log Today's Training",
  "Start / Log Today's Training",
];

test("June 19 Day and Session presentation proof-of-life is read-only", async ({ page }, testInfo) => {
  await page.goto(dayPath, { waitUntil: "domcontentloaded" });
  logEvidence("Day URL", page.url());
  await assertDangerousButtonsNotClicked(page);

  const dayExpectedTitlePresent = await hasText(page, expectedTitle);
  logEvidence("Day expected title present", dayExpectedTitlePresent);
  expect(dayExpectedTitlePresent).toBe(true);

  const dayText = await bodyText(page);
  const badgeMatch = dayText.match(productionBadgePattern)?.[0] ?? "not found";
  logEvidence("Production badge", badgeMatch);
  expect(badgeMatch).not.toBe("not found");

  await page.goto(sessionPath, { waitUntil: "domcontentloaded" });
  logEvidence("Session URL", page.url());
  await assertDangerousButtonsNotClicked(page);

  const sessionExpectedTitlePresent = await hasText(page, expectedTitle);
  const sessionStaleTitlePresent = await hasText(page, staleCompletedTitle);
  logEvidence("Session expected title present", sessionExpectedTitlePresent);
  logEvidence("Session stale DEF-028 title present", sessionStaleTitlePresent);

  const previousAttemptHeading = page.getByRole("heading", { name: /already completed this workout/i });
  const previousAttemptVisible = await previousAttemptHeading.isVisible().catch(() => false);
  logEvidence("Previous Attempt gate visible", previousAttemptVisible);

  const reopenButton = page.getByRole("button", { name: "Reopen / Edit Latest Completed Session" });
  const reopenVisible = await reopenButton.isVisible().catch(() => false);
  logEvidence("Reopen/Edit button visible", reopenVisible);
  if (reopenVisible) {
    await clickSafeButton(page, "Reopen / Edit Latest Completed Session");
    logEvidence("Reopen/Edit URL", page.url());
    const reopenExpectedTitlePresent = await hasText(page, expectedTitle);
    const reopenStaleTitlePresent = await hasText(page, staleCompletedTitle);
    logEvidence("Reopen/Edit expected title present", reopenExpectedTitlePresent);
    logEvidence("Reopen/Edit stale DEF-028 title present", reopenStaleTitlePresent);
    expect(reopenExpectedTitlePresent).toBe(true);
  } else {
    logEvidence("Reopen/Edit branch", "not exercised");
  }

  await page.goto(sessionPath, { waitUntil: "domcontentloaded" });
  logEvidence("Session URL before completed-session check", page.url());
  await assertDangerousButtonsNotClicked(page);

  const viewButton = page.getByRole("button", { name: "View Latest Completed Session" });
  const viewLatestVisible = await viewButton.isVisible().catch(() => false);
  logEvidence("View Latest Completed Session button visible", viewLatestVisible);
  if (viewLatestVisible) {
    await clickSafeButton(page, "View Latest Completed Session");
    logEvidence("Completed-session URL", page.url());
    const expectedTitlePresent = await hasText(page, expectedTitle);
    const staleTitlePresent = await hasText(page, staleCompletedTitle);
    logEvidence("Completed-session expected title present", expectedTitlePresent);
    logEvidence("Completed-session stale DEF-028 title present", staleTitlePresent);
    if (staleTitlePresent) {
      const evidence = `Completed-session surface shows stale title "${staleCompletedTitle}"`;
      logEvidence("DEF-028 current evidence", evidence);
      testInfo.annotations.push({ type: "DEF-028", description: evidence });
    }
  } else {
    // Completed-session access depends on production saved-session state. Absence is not
    // a product pass for DEF-028; this proof-of-life still passes because it stayed read-only.
    const evidence = "completed-session surface not exercised; DEF-028 not reproduced by this run";
    logEvidence("Completed-session branch", "not exercised");
    logEvidence("DEF-028 reproduction", "not reproduced by this run");
    testInfo.annotations.push({ type: "DEF-028", description: evidence });
  }
});

async function clickSafeButton(page: Page, name: string) {
  if (dangerousButtons.includes(name)) throw new Error(`Refusing to click dangerous button: ${name}`);
  await page.getByRole("button", { name }).click();
  await assertDangerousButtonsNotClicked(page);
}

async function assertDangerousButtonsNotClicked(page: Page) {
  for (const name of dangerousButtons) {
    const visible = await page.getByRole("button", { name }).isVisible().catch(() => false);
    if (visible) logEvidence("Dangerous button visible but not clicked", name);
  }
}

async function hasText(page: Page, text: string) {
  return (await bodyText(page)).includes(text);
}

async function bodyText(page: Page) {
  return page.locator("body").innerText();
}

function logEvidence(label: string, value: boolean | string) {
  console.log(`[DEF-028 evidence] ${label}: ${value}`);
}
