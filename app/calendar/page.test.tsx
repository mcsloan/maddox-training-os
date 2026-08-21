import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CalendarPage from "./page";

describe("compact expandable Calendar route", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 16, 12));
  });
  afterEach(() => vi.useRealTimers());

  it("renders all plan dates as collapsed canonical rows with one Log action", () => {
    const html = renderToStaticMarkup(<CalendarPage />);
    expect(html.match(/data-calendar-date=/g)).toHaveLength(96);
    expect(html.match(/href="\/log\/2026-/g)).toHaveLength(96);
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(96);
    expect(html.match(/data-calendar-row="true"/g)).toHaveLength(96);
    expect(html.match(/data-calendar-mobile-meta="true"/g)).toHaveLength(96);
    expect(html).not.toContain("data-calendar-details=");
    expect(html).not.toContain("Method phase:");
    expect(html).not.toContain("Open any scheduled day");
    expect(html).not.toContain("href=\"/day/");
  });

  it("puts current Week 9 first and marks Aug 16 as Today without expanding it", () => {
    const html = renderToStaticMarkup(<CalendarPage />);
    expect(html.indexOf('data-calendar-week="9"')).toBeLessThan(html.indexOf('data-calendar-week="10"'));
    expect(html).toContain('data-calendar-date="2026-08-16"');
    expect(html).toContain('data-today="true"');
    expect(html).toContain('aria-label="Show details for Sunday, August 16"');
    expect(html).toContain('href="/log/2026-08-16"');
    expect(html.match(/>TODAY<\/span>/g)).toHaveLength(1);
  });
});
