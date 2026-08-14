import { describe, expect, it } from "vitest";
import { exerciseVideoMap } from "../imports/v8_4";
import { buildForwardContentCompletenessMatrix } from "./forwardContentCompleteness";

const approvedMappings = {
  "SKL-HU-002": "https://www.youtube.com/watch?v=t1yWo7DUx_M",
  "SKL-HU-003": "https://www.icehockeysystems.com/hockey-drills/head-up-scan-ice-warm-up",
  "SKL-GS-002": "https://www.icehockeysystems.com/practice/1/85576",
  "SKL-DEKE-003": "https://www.youtube.com/watch?v=zQgpIbT5K3A&t=7s",
  "SHOT-GAME-002": "https://www.icehockeysystems.com/skill-development-videos/shooting-stride",
  "SHOT-QR-001": "https://www.icehockeysystems.com/skill-development-videos/catch-and-release-shot",
  "SHOT-ANGLE-001": "https://www.icehockeysystems.com/hockey-drills/change-shot-angle",
} as const;

const unresolvedIds = ["SKL-HU-001", "SKL-GS-001", "SKL-DEKE-001", "SKL-DEKE-002", "SHOT-ACC-001", "SHOT-MECH-001", "SHOT-GAME-001"];

describe("forward execution content completeness", () => {
  it("records honest content and video gaps without filler", () => {
    const matrix = buildForwardContentCompletenessMatrix();
    expect(matrix).toHaveLength(46);
    expect(matrix.filter((row) => row.verdict === "PASS")).toHaveLength(14);
    expect(matrix.filter((row) => row.verdict === "CONTENT GAP" || row.verdict === "CONTENT + VIDEO GAP")).toHaveLength(2);
    expect(matrix.filter((row) => row.verdict === "VIDEO GAP" || row.verdict === "CONTENT + VIDEO GAP")).toHaveLength(32);
    expect(matrix.every((row) => row.loggingIdentityValid && row.loggingFieldsAvailable)).toBe(true);
    expect(matrix.find((row) => row.activityId === "SS-A-P5W2")?.verdict).toBe("PASS");
    expect(matrix.some((row) => row.issues.includes("approved_video_mapping_incomplete"))).toBe(true);
  });

  it("uses only the seven parent-approved Skill/Shot/IQ mappings", () => {
    for (const [id, url] of Object.entries(approvedMappings)) {
      const mappings = exerciseVideoMap.filter((video) => video.canonicalExerciseId === id);
      expect(mappings).toHaveLength(1);
      expect(mappings[0]?.primaryVideoUrl).toBe(url);
    }

    for (const id of unresolvedIds) {
      expect(exerciseVideoMap.some((video) => video.canonicalExerciseId === id)).toBe(false);
    }
  });
});
