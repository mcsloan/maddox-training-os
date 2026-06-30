# Rule-Based Scoring Engine Approach

Purpose: document the step-by-step approach to a deterministic exercise-domain scoring engine. Future design only; not implemented.

Final scoring path:

Raw metadata -> extracted attributes -> deterministic scoring rules -> constraints/caps -> confidence/provenance -> review/approval -> versioned domain vector.

Open-source and research repositories inform validation and thresholds. They do not automatically generate final domain scores.

## Step 1 - Raw Exercise Metadata Ingestion

Input sources may include:

- v8.4 exercise/drill/source data.
- Exercise text descriptions.
- Video descriptions/transcripts.
- Commercial API exercise metadata.
- Manually reviewed source-library exercises.
- Future biomechanics-derived metadata.

## Step 2 - Feature Extraction Into JSON Schema

Extract structured attributes such as:

- force vector
- plane of motion
- movement direction
- primary joint actions
- primary and secondary muscle groups
- contraction type
- movement velocity
- duration
- work/rest ratio
- equipment
- implement/puck/stick involvement
- cognitive/reactive demand
- impact level
- axial loading
- U12 safety flags

The LLM may extract and normalize attributes, but must not assign final 0-10 domain scores.

## Step 3 - Conditional Scoring Logic

Use deterministic rules to assign scores.

Conceptual pseudo-code:

```text
initialize all domains to zero

if plane_of_motion is frontal and velocity_class is high:
  increase speed_lateral
  increase agility_cod

if primary_muscles include rectus abdominis or obliques and contraction_type is isometric:
  increase core_pillar

if hockey_implement_present or puck_or_ball_present:
  increase hockey_skill

if hockey implement is present and cognitive_load is dynamic/reactive:
  increase hockey_iq_cognition

if duration_seconds > 120 and intensity_class is low:
  increase aerobic_recovery
  cap power_elastic

if axial_loading is true:
  attach U12 restriction flag
```

## Step 4 - Constraints, Caps, And Sanity Checks

Rules must prevent impossible or unsafe profiles.

Examples:

- Total domain points per exercise may have a configurable cap.
- High-speed explosive short-duration movement should not also score high for aerobic_recovery.
- Low-intensity aerobic work should cap power_elastic.
- Axial loading attaches a U12 restriction flag.
- High neuromuscular or deceleration load requires age/safety verification.
- Scores far from similar exercises are flagged for review.

## Step 5 - Normalization To 0-10

Thresholds to define:

- 0 = none
- 1-2 = incidental
- 3-4 = secondary
- 5-6 = moderate
- 7-8 = major
- 9-10 = primary

## Step 6 - Explanation, Confidence, Provenance, And Audit Output

Each computed score should output:

- score
- triggered rule(s)
- source attributes used
- confidence
- validation status
- reviewer status
- model/rule version

## Step 7 - Human / Expert / Parent Review Gate

New or changed exercise-domain vectors must be reviewable before production use. Low-confidence or anomalous rows remain locked pending review.

## Step 8 - Versioning And Rollback

Exercise-domain vectors, scoring rules, domain models, and recommendation logic must be versioned. Future changes must be reviewable and rollback-capable.

## Step 9 - Future Athlete-Specific Effective-Load Scaling

Baseline domain matrix remains stable. Athlete-specific output may produce a personalized effective load vector for that session/day. Personalized vectors must not mutate the baseline matrix.

## Step 10 - QA / Fuzz / Adversarial Testing

Scoring rules require:

- synthetic tests
- malformed metadata tests
- unsafe U12 recommendation tests
- domain-boundary tests
- hallucinated metadata tests
- noisy sensor input tests

## Repository Usage In This Approach

- OpenBiomechanics: candidate validation source for high-performance movement mechanics, force variables, kinematics, and sport-relevant motion capture.
- AddBiomechanics: candidate validation source for processed biomechanics, musculoskeletal dynamics, force plate data, kinematics, and kinetic baselines.
- OpenCap: future candidate for athlete-output capture through smartphone video, not current scoring input.
- SPORTDiscus: literature support for training, injury prevention, load metrics, and youth-athlete safety.
- Commercial exercise APIs: metadata candidates only unless later validated; they may identify muscles, equipment, and categories, but not final domain scores.

## Initial Design Questions

- How many domains are final: 12, 9, or another model?
- What raw attributes map to each domain?
- What thresholds define 0 through 10?
- Which domains can coexist?
- Which domains cap or suppress others?
- How are duration and intensity separated from inherent exercise-domain profile?
- How is source confidence represented?
- How are conflicting sources resolved?
