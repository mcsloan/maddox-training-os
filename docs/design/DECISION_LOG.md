# Decision Log

## Decisions

- Current app remains production system.
- No implementation of Closed-Loop methodology until design gate passes.
- No silent plan rewrites.
- Parent approval required for future recommendations.
- LLMs may assist with attribute extraction, summarization, and source normalization.
- Final domain scores must come from deterministic, testable scoring rules plus approval gates.
- Expert/rule-derived baseline domain vectors and athlete-specific effective load vectors are separate concepts.
- Athlete-specific output may adjust a session/day's effective load estimate, but must not silently mutate the global exercise-domain matrix.
- Open-source/research repositories can inform validation and thresholds, but do not automatically generate final domain scores.

## Non-Decisions

- No final domain count has been selected.
- The 12-domain model is not final.
- The 9-domain model is not final.
- Graph DB/vector DB/ML service not selected.
- External exercise data source not selected.
- Open-source biomechanics dataset not selected as authoritative.
- Commercial API not selected.
- Recommendation engine implementation strategy not selected.
- Sensor/wearable/video feedback implementation not selected.
- LLM extraction provider/model not selected.
- Rule-based scoring language/runtime not selected.
