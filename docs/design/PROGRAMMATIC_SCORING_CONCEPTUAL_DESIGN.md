# Programmatic Scoring Conceptual Design

Purpose: capture the conceptual design for automated exercise-domain scoring. Future design only; not implemented.

## Programmatic Heuristic Ingestion Pipeline

`[New Exercise Text / Video] -> LLM extracts biomechanical attributes -> JSON schema -> deterministic heuristic logic -> computes 0-10 scores -> exercise matrix`

Expanded path:

New Exercise Text / Video / Source Material -> LLM-assisted attribute extraction -> validated JSON schema -> deterministic heuristic logic -> 0-10 exercise-domain vector -> confidence / provenance / review status -> human/expert/parent approval status -> versioned Exercise Matrix entry.

## LLM Role

- Extract raw biomechanical attributes.
- Normalize source descriptions.
- Produce structured JSON.
- Provide confidence and provenance.
- Enter review state for low-confidence extraction.
- Do not assign final domain scores.

## Deterministic Scoring Engine Role

- Apply explicit rules.
- Compute domain scores.
- Apply constraints and caps.
- Output explanations.
- Produce versioned score records.
- Support domain-count alternatives until `DOMAIN-DECISION-001` is complete.

## Validation Role

- Use open-source datasets and literature where possible.
- Use commercial APIs only as metadata sources unless later approved.
- Require review for low-confidence or anomalous rows.
- Preserve source provenance, license status, confidence, validation status, reviewer status, and scoring-rule version.

## Baseline vs Personalized Distinction

- Expert/rule-derived baseline matrix remains versioned and stable.
- Athlete-specific output creates a personalized effective load vector for a session/day.
- Personalized vectors do not mutate global baseline domain vectors.

## Example Raw Attributes To Design For

- plane_of_motion
- movement_direction
- force_vector: vertical / lateral / horizontal / rotational
- primary_joint_actions
- primary_muscles
- secondary_muscles
- contraction_type: isometric / eccentric / concentric / ballistic
- velocity_class
- acceleration_demand
- deceleration_demand
- ground_contact_type
- impact_level
- balance_stability_demand
- reactive_component
- cognitive_load
- hockey_implement_present
- puck_or_ball_present
- energy_system: ATP-PC / glycolytic / aerobic
- duration_seconds
- work_rest_ratio
- intensity_class
- external_load
- axial_loading
- age_safety_flags
- required_equipment
- source_type
- source_confidence
