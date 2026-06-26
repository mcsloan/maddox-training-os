# QA Matrix Bloat Controls

## Purpose

This document prevents QA planning from turning into giant unmaintainable matrices.

## What Matrix Bloat Is

Matrix bloat is any table that tries to enumerate every surface, requirement, role, date, defect, scenario, and test in one place. It usually creates stale rows, duplicate contract text, and false confidence.

## Why It Is Dangerous

- It hides missing source inspection behind large tables.
- It encourages one-off date assertions instead of reusable contracts.
- It duplicates scope and contracts across docs.
- It becomes too large for Mike or Codex to review accurately.
- It makes test generation look complete when no executable coverage exists.

## Maximum Intended Role By Matrix

| Matrix/doc | Intended role | Not allowed |
| --- | --- | --- |
| `APPLICATION_BEHAVIOR_CONTRACT.md` | Own stable contract IDs and testable rules. | Per-date route inventory or test scripts. |
| `ROUTE_SURFACE_COVERAGE_MATRIX.md` | Route coverage by surface or surface group. | One row per date or duplicated contract details. |
| `TEST_CASES.md` | Test groups, then selected concrete cases when ready. | Hundreds of premature test rows. |
| `DAY_SCENARIO_TEST_CASES.md` | Preserve detailed scenario-derived fixture expectations. | Becoming the primary test registry or a surface x requirement x day matrix. |
| `DATA_PROPAGATION_MATRIX.md` | Event-to-surface propagation rules. | Repeating every contract or browser route. |
| Traceability docs | Link contracts, defects, and test groups. | Rewriting full source contract text in every row. |

## Row Ownership Rules

- Each row must have one clear owner doc.
- Rows route readers to detail; they do not duplicate full detail.
- Every row must include status or readiness.
- Missing information must use:
  - Status: Needs source inspection
  - Reason
  - Next step
- Do not use placeholder rows filled with TBD, N/A, or future.

## When To Split Docs

Split only when a doc has more than one owner role. Good reasons:

- contract rules need stable IDs
- surface route inventory needs separate upkeep
- executable test groups need separate status
- evidence artifacts belong outside docs

Bad reasons:

- avoiding a concise update to the canonical doc
- creating a new planning markdown file without explicit approval
- duplicating old defect or roadmap content

## Review Questions Before Adding Rows

Before adding a row, answer:

1. Which contract, defect, requirement, or scope item does this row trace to?
2. Is this a reusable rule or a one-off fixture?
3. Is the detail already owned elsewhere?
4. Is the row small enough to maintain manually?
5. Does missing information need source inspection instead of invented detail?
6. Which test layer is appropriate?
7. Could one row cover a surface group instead of many dates?

## Hard Rules

- Do not create giant surface x requirement x day matrices.
- Route/surface coverage matrix is one row per surface or surface group, not one row per date.
- Traceability matrices link items; they do not duplicate full contract text.
- `TEST_CASES.md` starts with test groups before expanding into concrete tests.
- Dates such as June 19 may be fixtures/examples only.
- Contract IDs should be reused instead of creating many one-off assertions.
