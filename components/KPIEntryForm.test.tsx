import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("../lib/storage/cloudKpiRepository", () => ({
  saveStandaloneKpiResult: vi.fn(),
}));

import { KPIEntryForm } from "./KPIEntryForm";
import kpisJson from "../data/kpis.json";
import type { KPI } from "../lib/types";

const kpis = kpisJson as KPI[];

function renderEntryForm(kpiId: string) {
  const kpi = kpis.find((item) => item.id === kpiId);
  if (!kpi) throw new Error(`Missing KPI fixture: ${kpiId}`);
  return renderToStaticMarkup(<KPIEntryForm kpi={kpi} onSaved={vi.fn()} />);
}

describe("KPIEntryForm", () => {
  it("renders structured 45-second shuttle helper fields", () => {
    const html = renderEntryForm("kpi-45-second-shuttle");

    expect(html).toContain("Completed 10m lengths");
    expect(html).toContain("Partial final metres");
    expect(html).toContain("Computed total");
    expect(html).toContain("10 completed lengths + 0.73m partial = 100.73m");
  });
});
