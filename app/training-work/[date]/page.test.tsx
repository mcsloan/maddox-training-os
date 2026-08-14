import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
}));
vi.mock("@/components/TrainingWorkForm", () => ({
  TrainingWorkForm: (props: { workoutId: string | null; plannedDurationMinutes: number | null }) => (
    <div data-duration={props.plannedDurationMinutes} data-workout-id={props.workoutId} />
  ),
}));

import TrainingWorkPage from "./page";

describe("Training Work canonical Day identity", () => {
  it("uses Aug 12 canonical identity and scoped Training Work metadata", async () => {
    const html = renderToStaticMarkup(await TrainingWorkPage({ params: Promise.resolve({ date: "2026-08-12" }) }));

    expect(html).toContain("Speed Stack B movement/upper/lower mix.");
    expect(html).not.toContain("Game-speed puck decisions");
    expect(html).toContain('data-duration="115"');
    expect(html).toContain('data-workout-id="session-2026-08-12"');
    expect(html).toContain("Saving this log does not mark sport-load logging complete.");
  });
});
