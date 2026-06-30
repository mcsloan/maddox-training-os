# Design Gate

## Purpose

`DESIGN-GATE-001` governs the future Closed-Loop Training Intelligence work. It prevents conceptual methodology ideas from being converted directly into Codex prompts or retrofitted into the current app before product, functional, technical, research, transition, data-retention, QA, and safety designs are accepted.

Closed-Loop methodology work is future architecture, not current app behavior.

## Gate Sequence

Conceptual Design -> Functional Design -> Technical Design -> Research / Validation Design -> Current-App Transition Plan -> Data-Retention / No-Data-Loss Plan -> QA / Safety Design -> Build Readiness -> Implementation.

Forbidden shortcut:

Conceptual Design -> Codex prompt -> retrofit into app.

## Required Design Packages

- Conceptual design package.
- Functional design backlog and accepted functional specs.
- Technical design backlog and accepted technical specs.
- Research and validation strategy.
- Current-app transition and integration/retrofit strategy.
- Data-retention, provenance, and no-data-loss plan.
- QA, adversarial safety, and regression design.
- Build-readiness checklist.
- Role/RACI ownership model.

## Designer Roles

- Project Owner / Product Manager
- Performance Methodology Designer
- Product / UX Designer
- Data / Analytics Designer
- Knowledge Engineer / Ontologist
- Data Engineer
- Data Scientist
- Biomechanics / Research Analyst
- AI/ML Engineer
- MLOps Engineer
- Systems Architect
- AI/Web Developer
- AI-Enhanced UX/UI Designer
- Agentic QA Engineer
- Governance / Safety Designer

## Build Readiness Criteria

No Closed-Loop methodology Epic may enter implementation until all of these are accepted:

- Conceptual design accepted.
- Functional design accepted.
- Technical design accepted.
- Research/validation strategy accepted.
- Current-app transition strategy accepted.
- Data-retention/no-data-loss plan accepted.
- Integration/retrofit strategy accepted.
- QA/test design accepted.
- Build readiness approved.

## Current-App Protection

- Current Maddox Training OS remains the production system.
- v8.4 remains authoritative for current daily execution, sport loads, sessions, drills, video map, KPI data, and locked Gantt model.
- No `imports/v8.4/data/*.json` edits without explicit source-update phase.
- No Supabase schema changes without accepted technical design.
- No destructive data migration.
- No hidden mutation of saved sessions, KPI results, sport-load logs, reflections, or parent-entered data.
- Future methodology layer must be designed as parallel architecture before integration.
- Existing tactical defects may be fixed separately as bounded current-app work, but those fixes must not become stealth implementation of the future methodology layer.

## Data Retention

Implementation requires a rollback-capable no-data-loss plan. Production training history remains immutable unless corrected through an approved process. Recommendations must be append-only/auditable and parent-approved before plan adjustment.
