import { expect, test, type Page } from "@playwright/test";

const dayPath = "/day/2026-06-19";
const sessionPath = "/session/session-2026-06-19";
const expectedTitle = "Acceleration and accurate shooting";
const staleCompletedTitle = "Speed Stack C, conditioning, and shooting.";

const dangerousButtons = [
  "Finish Session",
  "Save",
  "Submit",
  "Start Fresh Attempt",
  "Log Today's Training",
  "Start / Log Today's Training",
];

test("June 19 Day and Session presentation proof-of-life is read-only", async ({ page }) => {
  await page.goto(dayPath, { waitUntil: "domcontentloaded" });
  await expect(page.getByText(expectedTitle, { exact: false })).toBeVisible();
  await expect(page.locator("body")).toContainText(/9964e52|a3a41f4/);

  await page.goto(sessionPath, { waitUntil: "domcontentloaded" });
  await assertDangerousButtonsNotClicked(page);

  const previousAttemptHeading = page.getByRole("heading", { name: /already completed this workout/i });
  const previousAttemptVisible = await previousAttemptHeading.isVisible().catch(() => false);
  console.log(`Previous Attempt gate visible: ${previousAttemptVisible}`);

  const reopenButton = page.getByRole("button", { name: "Reopen / Edit Latest Completed Session" });
  if (await reopenButton.isVisible().catch(() => false)) {
    await clickSafeButton(page, "Reopen / Edit Latest Completed Session");
    await expect(page.getByText(expectedTitle, { exact: false })).toBeVisible();
    console.log("Reopen/Edit surface uses shared day title.");
  } else {
    console.log("Reopen/Edit button not visible; continuing without click.");
  }

  await page.goto(sessionPath, { waitUntil: "domcontentloaded" });
  await assertDangerousButtonsNotClicked(page);

  const viewButton = page.getByRole("button", { name: "View Latest Completed Session" });
  if (await viewButton.isVisible().catch(() => false)) {
    await clickSafeButton(page, "View Latest Completed Session");
    const completedText = await page.locator("body").innerText();
    const staleTitlePresent = completedText.includes(staleCompletedTitle);
    console.log(`DEF-028 evidence - stale completed-session title present: ${staleTitlePresent}`);
    if (staleTitlePresent) {
      console.log(`DEF-028 current evidence: completed-session surface shows "${staleCompletedTitle}"`);
    }
  } else {
    console.log("View Latest Completed Session button not visible; completed-session surface not exercised.");
  }
});

async function clickSafeButton(page: Page, name: string) {
  if (dangerousButtons.includes(name)) throw new Error(`Refusing to click dangerous button: ${name}`);
  await page.getByRole("button", { name }).click();
}

async function assertDangerousButtonsNotClicked(page: Page) {
  for (const name of dangerousButtons) {
    const visible = await page.getByRole("button", { name }).isVisible().catch(() => false);
    if (visible) console.log(`Dangerous button visible but not clicked: ${name}`);
  }
}
