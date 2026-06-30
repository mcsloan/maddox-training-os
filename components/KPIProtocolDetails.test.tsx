import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { KPIProtocolDetails } from "./KPIProtocolDetails";
import kpisJson from "../data/kpis.json";
import type { KPI } from "../lib/types";

const kpis = kpisJson as KPI[];

function renderProtocol(kpiId: string) {
  const kpi = kpis.find((item) => item.id === kpiId);
  if (!kpi) throw new Error(`Missing KPI fixture: ${kpiId}`);
  return renderToStaticMarkup(<KPIProtocolDetails kpi={kpi} />);
}

describe("KPIProtocolDetails", () => {
  it("renders Zwift protocol details from the KPI registry", () => {
    const html = renderProtocol("kpi-zwift-bike-3x10s-peak-power");

    expect(html).toContain("Protocol details");
    expect(html).toContain("Free Ride");
    expect(html).toContain("not ERG");
    expect(html).toContain("Power Source");
    expect(html).toContain("Controllable");
    expect(html).toContain("10 seconds");
    expect(html).toContain("2 minutes");
    expect(html).toContain("Wahoo KICKR CORE");
    expect(html).toContain("Tempus Fugit");
  });

  it("renders Puck-Control Weave deferral wording from the KPI registry", () => {
    const html = renderProtocol("kpi-puck-weave");

    expect(html).toContain("safe space is unavailable");
    expect(html).toContain("defer");
    expect(html).toContain("do not force a numeric result");
  });
});
