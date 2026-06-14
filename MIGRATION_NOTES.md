# Persistence Migration Notes

Supabase is the source of truth for completed training history. Browser local storage remains the active-session draft store and a fallback backup when Supabase is unavailable or not configured.

Completed sessions are saved as immutable snapshots. Each snapshot contains the workout template, planned drills, completed drill logs, KPI results, reflection, and completion timestamps as they existed when the session was finished.

Future database and snapshot schema changes must be additive and backward-compatible. Readers must continue supporting older `schema_version` values.

Historical completed-session snapshots must not be rewritten when workout plans, drill instructions, KPI definitions, or other templates change.

External load logs also use `session_logs`, with `source = external_load` and a snapshot containing `kind = external_load`. Each submission or edit creates a new immutable row. Training-session snapshots retain their existing shape and meaning.

The current implementation assumes one private family user and uses a stable Maddox athlete ID. Authentication and stronger row-level access control are required before expanding beyond that private-use assumption.
