# Risk Register

Status: Initial design-governance risk capture.

| Risk | Initial mitigation direction |
| --- | --- |
| Current app disruption | Require transition plan and bounded current-app scopes. |
| Production data loss | Require no-data-loss plan and no destructive migration. |
| Supabase schema drift | No schema changes before accepted technical design. |
| Unverified exercise-domain scores | Deterministic scoring, provenance, confidence, and review gates. |
| Prematurely locking 12 domains | `DOMAIN-DECISION-001` required. |
| Prematurely adopting 9 domains | `DOMAIN-DECISION-001` required. |
| Overfitting to hockey-only labels | Compare hockey-specific and generalized domain models. |
| Unsafe U12 recommendations | U12 safety constraints, readiness overrides, adversarial QA. |
| Silent plan rewrites | Parent approval and append-only recommendation audit. |
| Recommendation hallucination | No direct LLM recommendation authority; rule/explanation gates. |
| Misclassified load | `AUDIT-LOAD-CLASSIFICATION-001`, load functional design. |
| Multiple rendering paths | Audit and canonical projection governance. |
| Source JSON vs projection mismatch | Preserve v8.4 source; make projection rules explainable. |
| Technical stack overreach | Stack candidates only until technical design proves need. |
| Graph/vector/ML adoption before need is proven | Architecture evaluation before selection. |
| QA combinatorial explosion | Contract-driven QA and bloat controls. |
| User trust loss | Product QA acceptance separate from technical checks. |
| LLM hallucinated exercise-domain scores | LLM cannot assign final domain scores. |
| LLM extracts plausible but wrong biomechanical attributes | Confidence/provenance/review gates. |
| Deterministic scoring rules encode bad assumptions | Validation, review, versioning, rollback. |
| Adult/elite biomechanics data misapplied to U12 athlete | Youth transfer review and safety constraints. |
| Hockey-specific movement transfer not validated | Research validation and manual review. |
| Sensor noise creates false load estimates | Future signal confidence and fallback behavior. |
| Athlete-specific scaling mutates baseline matrix by mistake | Separate personalized effective load vector. |
| Source licensing prevents production use | Licensing review before source adoption. |
| Overclaiming precision from incomplete data | Parent-visible confidence/explanation language. |
| Recommendation engine adjusts plan from weak signals | Parent approval, confidence thresholds, readiness override. |
| Commercial API metadata mistaken for validated biomechanics data | Commercial APIs are metadata candidates only. |
| Research repository links rot or become unavailable | Preserve exact links and future citation snapshots. |
| Matrix scoring appears more precise than it really is | Explain heuristic nature and confidence. |
| Future AI Coach trusts unvalidated methodology outputs | AI Coach gated behind validated methodology and safety governance. |
