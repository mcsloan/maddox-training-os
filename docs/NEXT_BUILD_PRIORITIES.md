# Next Build Priorities

1. Run and record final checks for KPI cloud-sync WIP.
2. Decide whether remaining KPI staging scenarios are required before commit.
3. Wire Vercel Preview to staging.
4. Keep Vercel Production on production.
5. Commit KPI cloud-sync only after accepted staging validation scope is complete.
6. Plan recovered June 16 real production KPI backfill.
7. Prepare production deploy checklist; do not deploy until explicitly approved.
8. Fix Homepage stale Next Session card DEF-017.
9. Fix History Week -> Day -> Evidence.
10. Add readiness fields including resting HR.
11. Add blank/rest/recovery day explicit states DEF-019.
12. Continue QA/Testing epic: test status, Playwright plan, regression flows.
13. Add advanced KPI roadmap items after core sync is safe.
14. Add AI Coach only after data model is trustworthy.

## Immediate Guardrail

Do not apply additional KPI cloud-sync stash/patch content. Do not add `.wip/` to git. Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys. Production is not deploy-ready until explicitly approved.
