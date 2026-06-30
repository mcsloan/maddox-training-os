# Closed-Loop Conceptual Design

Status: Future conceptual architecture only. Not current app behavior. Not accepted as final implementation design.

## Figure 1 - Closed-Loop Training Intelligence System

Purpose: explain the full loop:

Plan Methodology & Phase Goals -> Exercise Domain Profiles -> Prescribed Day / Week Plan -> Actual Completed Work -> Domain Load Analytics -> KPI Results -> Readiness & Recovery Context -> Interpretation & Recommendation Engine -> Parent Approval -> Plan Adjustment.

Governance:

- No silent plan rewrites.
- Recommendations are reviewable.
- One day, one truth.

U12 safety:

- No heavy axial loading.
- Readiness overrides analytics.
- Camp/taper weeks suppress aggressive changes.

## Figure 2 - Example Exercise Domain Matrix

Purpose: show candidate 12-domain scoring on a 0-10 scale for selected exercises.

Important:

- The 12-domain model is conceptual and not accepted as final.
- Scores are standardized expert/rule heuristics, not direct instrument measurements.
- `DOMAIN-DECISION-001` is required before selecting the final model.

Candidate A domains:

- speed_linear
- speed_lateral
- power_elastic
- strength_force
- core_pillar
- deceleration_absorption
- agility_cod
- reactive_agility
- aerobic_recovery
- anaerobic_shift
- hockey_skill
- hockey_iq_cognition

Candidate B domains:

- speed_velocity
- neuromuscular_load
- deceleration_absorption
- agility_maneuverability
- core_pillar
- aerobic_recovery
- anaerobic_shift
- technical_skill
- cognitive_load

## Figure 3 - Weighting, Math, and Derived Analytics

Purpose: show how exercise data becomes domain analytics.

Inputs:

- Domain scores.
- Duration / volume.
- Intensity factor.
- Completion percentage.
- Fatigue cost.
- Impact level.

Derived analytics:

- Daily Domain Load.
- Weekly Domain Load.
- Phase Alignment Coefficient.
- Elastic Skating Transfer Score.
- Risk-Adjusted Transfer Load.

## Figure 4 - Example Weekly Domain Heatmap

Purpose: show planned vs actual exposure across a sample week. The heatmap is a future visualization candidate; it must not imply the current app already computes domain load.

## Figure 5 - Phase Target vs Actual Domain Profile

Purpose: show radar/table comparison of target vs actual domain exposure for a phase. This requires accepted phase targets, domain model, scoring rules, and actual-work mapping before implementation.

## Figure 6 - KPI Trend, Exposure Overlay, and Adjustment Use Case

Purpose: show how KPI trend, domain exposure, readiness, and recommendation logic connect. Recommendations require parent approval, source/explanation trace, and safety suppression before any plan adjustment.
