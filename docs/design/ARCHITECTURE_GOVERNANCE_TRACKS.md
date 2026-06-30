# Architecture Governance Tracks

Status: Future design only. Nothing in this file authorizes current-app implementation, source JSON edits, Supabase changes, package installs, scoring-engine work, sensor integration, or recommendation behavior.

## TRANSITION-001 - Current App Protection

Purpose: ensure the existing Maddox Training OS app is not destabilized while future Closed-Loop methodology architecture is designed.

Requirements:

- Current app remains the production system.
- v8.4 remains authoritative for current daily execution, sport loads, sessions, drills, video map, KPI data, and Gantt model.
- No source JSON edits without explicit source-update phase.
- No Supabase schema changes without approved technical design.
- No destructive data migration.
- No hidden mutation of saved sessions, KPI results, sport-load logs, reflections, or parent-entered data.
- New methodology layer must be designed as parallel/future architecture before integration.
- Integration/retrofit strategy must define compatibility with current projections and data.
- Rollback and no-data-loss plan required before implementation.
- Existing tactical defects may be fixed separately as bounded current-app work, but must not become stealth implementation of the future methodology layer.

## DATA-GOV-001 - Data Retention, Provenance, And Integrity

Purpose: define how future methodology, analytics, domain scoring, recommendations, and plan adjustments preserve data integrity.

Requirements:

- Version every exercise-domain profile.
- Version every methodology model.
- Version every scoring rule set.
- Preserve source provenance for domain scores and rules.
- Track confidence and validation status.
- Preserve audit trail for recommendations.
- Preserve parent approval/rejection/defer decisions.
- No silent plan rewrites.
- Production training history remains immutable unless explicitly corrected through approved process.
- Future migrations must be reversible or safely replayable.
- Current Supabase data must not be changed by docs-only work.
- Athlete-specific effective load adjustments must not mutate global baseline matrix scores.
- Child-athlete data privacy and safety must be considered in any future sensor/video/AI pipeline.

## SOURCE-VALIDATION-001 - Exercise Domain Scoring Source And Validation Strategy

Purpose: determine how exercise-domain scores can be sourced and validated without an in-house sports science staff.

Design candidates, not accepted decisions:

- commercial exercise databases / APIs for exercise metadata
- open-source biomechanics datasets
- research/literature review
- manual expert review where available
- deterministic heuristic scoring engine
- LLM-assisted attribute extraction

Rule: LLMs may extract structured biomechanical attributes, but must not directly assign final 0-10 exercise-domain scores without deterministic rules and validation.

Future design questions:

- Which sources are credible enough?
- How are source licenses handled?
- How are scores validated?
- How are conflicts between sources handled?
- How is confidence recorded?
- Who approves a score for production use?
- Which data sources are usable for validation versus production scoring?
- Which sources are adult/elite and may not transfer directly to a U12 athlete?
- How is hockey-specific movement handled when exact source data does not exist?

## KNOWLEDGE-INGESTION-001 - Programmatic Exercise Attribute Ingestion

Core principle: the LLM extracts raw structured attributes only. A deterministic scoring engine computes domain scores.

Conceptual pipeline:

`[New Exercise Text / Video / Source Material] -> LLM-assisted attribute extraction -> validated JSON schema -> deterministic heuristic logic -> 0-10 exercise-domain vector -> confidence / provenance / review status -> human/expert/parent approval status -> versioned Exercise Matrix entry`

Required concepts:

- LLM extracts biomechanical attributes.
- LLM does not directly assign final matrix values.
- Extracted attributes conform to a strict schema.
- Attribute extraction includes confidence scores and provenance.
- Low-confidence extraction enters review state.
- Exercise matrix rows are versioned.
- Source trace identifies where attributes came from.
- Human/expert approval is required before production use.

## ATHLETE-PERSONALIZATION-001 - Personalized Effective Load Vector

Purpose: define how actual athlete output can temporarily scale expected exercise load for a specific athlete/session/day without mutating the expert baseline matrix.

Critical governance rule: do not overwrite the expert baseline exercise-domain matrix based on one athlete's performance. Compute a separate personalized effective load vector.

Conceptual model:

Expert Baseline Matrix -> athlete actual output data -> readiness/recovery context -> effective load scaling -> personalized day/session load estimate -> recommendation engine.

Example: baseline Skater Bound may have `agility_cod = 8`. If Maddox is fatigued and actual velocity/change-of-direction quality drops, the effective load for that session may behave like `agility_cod = 5`. The baseline matrix remains 8.

Required concepts:

- baseline_domain_vector
- expected_load_vector
- actual_output_vector
- personalized_effective_load_vector
- deviation_from_baseline
- readiness_modifier
- fatigue_modifier
- confidence_score
- explanation
- parent-visible interpretation

## SENSOR-FEEDBACK-001 - Wearable / IMU / Video Feedback Integration

Purpose: document future ways athlete output could be measured instead of relying only on subjective completion logs.

Candidate signal sources:

- heart rate
- RPE
- accelerometer / IMU
- phone video analysis
- wearable velocity/change-of-direction metrics
- future OpenCap-style video capture
- manual coach/parent observation

Design questions:

- What signals are realistic now?
- What signals are future-only?
- What accuracy is acceptable for a U12 home-training app?
- How does the system behave when sensors are absent?
- How does it avoid overclaiming precision?
- How does it protect privacy and child-athlete data?
- How does it prevent unsafe recommendations from noisy sensor data?

Important: no wearable, IMU, or video integration is current scope.

## MODEL-GOVERNANCE-001 - Baseline Matrix Versioning And Human Approval

Purpose: govern how domain matrices, scoring rules, personalized scaling, and recommendations are approved, versioned, audited, and changed over time.

Requirements:

- Baseline exercise-domain matrix is versioned.
- Scoring engine rules are versioned.
- Domain model is versioned.
- Human/expert approval status is tracked.
- Recommendation records are append-only.
- Parent approval is required before plan adjustment.
- No silent plan rewrites.
- Athlete-specific scaling must not mutate global baseline scores.
- Every recommendation cites the input signals that produced it.
- Every future model/rule change is reviewable and rollback-capable.

## STACK-EVOLUTION-001 - Technical Stack Evolution Strategy

Purpose: evaluate how the future methodology layer should evolve technically without prematurely changing the current app stack.

Current stack:

- Next.js app
- Vercel hosting
- Supabase/Postgres data layer
- v8.4 JSON import package

Future candidates to evaluate:

- Postgres relational model
- JSONB domain profile storage
- graph-style relational modeling
- vector/similarity search
- deterministic rule engine
- offline scoring pipeline
- future ML/recommendation service
- future MLOps monitoring
- current-stack compatibility

Important: no graph database, vector database, ML service, commercial API, or optimization engine is selected by this docs task.
