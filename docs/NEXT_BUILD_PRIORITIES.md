# Next Build Priorities

1. Commit/check this production-hardening documentation update if accepted.
2. Decide explicitly whether to push local `main`; pushing will likely trigger Production from `bec6008` or later.
3. Keep Vercel Production on production.
4. After push/deploy, run production smoke tests without fake/test records.
5. Confirm KPI cloud sync production behavior using only real/intended records.
6. Plan recovered June 16 real production KPI backfill.
7. Keep remaining KPI edge scenarios tracked: Puck-Control Weave deferred state, Plank Quality time plus form score, duplicate/update, offline fallback.
8. Fix Homepage stale Next Session card DEF-017.
9. Fix History Week -> Day -> Evidence.
10. Add readiness fields including resting HR.
11. Add blank/rest/recovery day explicit states DEF-019.
12. Continue QA/Testing epic: test status, Playwright plan, regression flows.
13. Add advanced KPI roadmap items after core sync is safe.
14. Add AI Coach only after data model is trustworthy.

## Immediate Guardrail

Do not apply additional KPI cloud-sync stash/patch content. Do not add `.wip/` to git. Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys. Production app testing has not passed until the `bec6008` production deployment is pushed and smoke-tested.
