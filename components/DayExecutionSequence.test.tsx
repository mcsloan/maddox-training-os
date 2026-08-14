import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { DayExecutionSequence } from "./DayExecutionSequence";
import { projectCanonicalDay } from "../lib/projections/canonicalDay";

describe("DayExecutionSequence", () => {
  it.each([
    ["2026-08-11", "30 min"],
    ["2026-07-23", "45 min"],
  ])("renders the canonical projected cardio duration for %s", (date, durationLabel) => {
    const day = projectCanonicalDay(date);
    const html = renderToStaticMarkup(
      <DayExecutionSequence entries={day.executionEntries} stepPresentation={day.presentation.executionSteps} />,
    );

    expect(html).toContain("Controlled bike or treadmill");
    expect(html).toContain(durationLabel);
  });
});
