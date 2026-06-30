# Open-Source Research Repositories

Purpose: track candidate open-source and research-backed sources for validating domain-scoring assumptions, biomechanical variables, load-classification thresholds, and future methodology design.

No source is selected as authoritative in this docs-only task.

## OpenBiomechanics Project

Primary links:

- Official site: https://www.openbiomechanics.org/
- GitHub repo: https://github.com/drivelineresearch/openbiomechanics

Role in architecture:

- Candidate source for elite-level athletic motion capture, force variables, time-series biomechanics, and Python tooling.
- Candidate validation source for joint torque, velocity, ground reaction force, and movement mechanics.

Potential data:

- Motion capture variables.
- Force and kinematic variables.
- High-performance movement mechanics where comparable movement patterns exist.

Limitations / U12 transfer concerns:

- Likely adult/elite-specific.
- Not automatically transferable to a 2015 birth-year U12 athlete.
- Exact overlap with Maddox Training OS exercises must be studied.

Licensing/access questions:

- Confirm license, citation, redistribution, and production-use restrictions before using outputs.

Status: Candidate only. Not selected as authoritative.

## Stanford AddBiomechanics Dataset / AddBiomechanics Tooling

Primary links:

- Dataset download: https://addbiomechanics.org/download_data.html
- Stanford/Mobilize software page: https://mobilize.stanford.edu/software/addbiomechanics/
- FAIR Center dataset page: https://faircenter.stanford.edu/resources/datasets/

Role in architecture:

- Candidate source for processed biomechanics, position data, physics/dynamics outputs, and large-scale motion data.
- Candidate validation source for joint kinematics, kinetics, inverse dynamics, and normalized motion variables.

Potential data:

- Processed kinematics and kinetics.
- Musculoskeletal dynamics.
- Force plate and normalized motion variables where available.

Limitations / U12 transfer concerns:

- Adult, clinical, or general movements may not transfer directly to youth hockey development.
- Outputs can inform deterministic thresholds but must not become unquestioned truth.

Licensing/access questions:

- Confirm dataset license, citation obligations, data-use limits, and production restrictions.

Status: Candidate only. Not selected as authoritative.

## OpenCap / Smartphone-Video Biomechanics Ecosystem

Primary links:

- Official site: https://www.opencap.ai/
- Get started page: https://www.opencap.ai/get-started
- OpenCap paper: https://pmc.ncbi.nlm.nih.gov/articles/PMC10586693/
- Stanford engineering article: https://engineering.stanford.edu/news/opencap-sophisticated-human-biomechanics-smartphone-video

Role in architecture:

- Future athlete-output capture candidate.
- Possible long-term path for smartphone-video-based kinematic estimation.

Potential data:

- Smartphone-video-derived movement estimates.
- Future athlete-output signals if accuracy, privacy, and safety requirements are accepted.

Limitations / U12 transfer concerns:

- Home-training accuracy thresholds must be defined.
- Child-athlete video privacy risk is material.
- The system must avoid overclaiming precision and must work when video capture is unavailable.

Licensing/access questions:

- Confirm terms, data retention, child-data handling, and production-use constraints.

Status: Future candidate only. Not current implementation.

## SPORTDiscus / Sports Medicine Literature Databases

Primary links:

- SPORTDiscus official EBSCO page: https://about.ebsco.com/products/research-databases/sportdiscus
- SPORTDiscus with Full Text: https://about.ebsco.com/products/research-databases/sportdiscus-full-text

Role in architecture:

- Literature discovery for sports medicine, exercise science, injury prevention, training physiology, load metrics, and youth-athlete safety.

Potential data:

- Literature-derived rules, safety constraints, physiology references, and validation context.

Limitations / U12 transfer concerns:

- Not a raw movement dataset.
- Access/licensing constraints may apply.
- Adult/elite findings may not apply to U12 athletes.

Licensing/access questions:

- Confirm access rights, citation rules, and whether literature-derived rules can be used in production.

Status: Research/literature candidate only. Not a direct scoring dataset.

## Commercial Exercise APIs / Databases

Candidate examples:

- ExerciseDB API: https://exercisedb.io/
- Zyla Labs Exercise Database API: https://zylalabs.com/api-marketplace/data/exercise+database+api

Role in architecture:

- Candidate metadata sources for exercise names, muscle groups, equipment, movement categories, and animation/video metadata.

Potential data:

- Seed metadata for feature extraction.
- Muscle/equipment/category labels.

Limitations / U12 transfer concerns:

- Useful metadata does not equal validated biomechanics.
- These sources do not directly provide Maddox Training OS domain scores.

Licensing/access questions:

- Confirm cost, license, redistribution, production use, API stability, and provenance preservation.

Status: Candidate metadata sources only. Not selected.

## Current Research Notes

- OpenBiomechanics and AddBiomechanics appear to be the strongest open-source validation candidates for biomechanical variables.
- OpenCap is a future athlete-output capture candidate, not current scope.
- SPORTDiscus is literature grounding, not raw biomechanical scoring data.
- Commercial APIs may seed metadata, but deterministic scoring and validation are still required.
