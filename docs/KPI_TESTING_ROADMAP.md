# KPI Testing Roadmap

## Current Initial Tests

- 5-10-5 Pro Agility
- 10-yard sprint
- Broad jump
- Shot accuracy
- Head-up callout
- Quick hands
- Plank quality
- Puck-control weave, with deferred state if not tested

## Recovered June 16 Baseline Values

These values were recovered from iPad local KPI data. They are not yet intentionally backfilled into production cloud data.

- 10-yard sprint best 2.31; attempts 2.44, 2.56, 2.31
- Broad jump best 142; attempts 142, 126, 131
- 5-10-5 best 6.10; attempts 6.36, 6.10, 6.26
- Shot accuracy best 2
- Head-up callout best 100; attempts 100, 100, 100
- Quick hands best 83; attempts 73, 83
- Plank best 55; attempts 50, 55; form scores noted as 4 and 4
- Puck-Control Weave not tested / no record

## Current KPI Defects

- DEF-001: Standalone KPI results were local-only.
- DEF-006: June 16 planned baseline fragmented from actual KPI work.
- DEF-011: Plank Quality KPI missing separate time plus form score model.
- DEF-012: Puck-Control Weave needs deferred / space-unavailable state.

## Advanced KPI / Combine-Inspired System

Purpose: Expand Maddox's KPI system beyond initial baseline tests into an age-appropriate performance testing library inspired by hockey combine-style measures, while comparing Maddox against himself over time, not against adult/NHL standards.

Feature candidates:

- 100m sprint
- 45-second hockey shift simulation / repeated-effort test
- Push-up test
- Pull-up test or flexed-arm hang
- Vertical jump
- Standing broad jump
- 5-10-5 / pro agility
- 10-yard or 10m acceleration
- Optional bike power / repeat-effort test later
- Shooting accuracy trend
- Head-up callout / scan-and-handle test
- Puck-control weave with deferred state if space unavailable

## Product Decisions

- Do not use a flat 400m as the primary hockey-shift test.
- Prefer a 45-second repeated shuttle / shift-simulation test because it better resembles hockey's start-stop-repeat demand.
- Do not use adult combine ranking pressure.
- Track personal trends only.
- Standardize warm-up, rest, surface, footwear, and timing.
- Do not test after high-load games/camps unless deliberately planned.
- Use testing to guide training, not to overload him.

## Cloud Sync Path

Standalone KPI cloud sync remains in progress, stashed, and not validated in staging. Resume only after environment rules are satisfied.
