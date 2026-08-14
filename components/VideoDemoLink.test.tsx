import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { VideoDemoLink } from "./VideoDemoLink";

describe("VideoDemoLink", () => {
  it("renders an accessible compact demo control", () => {
    const html = renderToStaticMarkup(<VideoDemoLink exerciseName="Wall March Hold" href="https://example.com/demo" />);
    expect(html).toContain('aria-label="Watch demo: Wall March Hold"');
    expect(html).toContain('title="Watch demo: Wall March Hold"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain("<svg");
  });
});
