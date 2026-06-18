# Next Build Priorities

1. Document Supabase staging baseline and environment handoff.
2. Wire Vercel Preview to staging.
3. Keep Vercel Production on production.
4. Create explicit staging KPI cloud-sync test plan.
5. Reapply KPI cloud-sync stash only after staging test plan is explicit.
6. Test KPI cloud sync against staging.
7. Commit KPI cloud-sync only after staging validation.
8. Plan recovered June 16 real production KPI backfill.
9. Fix Homepage stale Next Session card DEF-017.
10. Fix History Week -> Day -> Evidence.
11. Add readiness fields including resting HR.
12. Add blank/rest/recovery day explicit states DEF-019.
13. Continue QA/Testing epic: test status, Playwright plan, regression flows.
14. Add advanced KPI roadmap items after core sync is safe.
15. Add AI Coach only after data model is trustworthy.

## Immediate Guardrail

Do not apply the KPI cloud-sync stash during staging-baseline documentation work. Do not add `.wip/` to git. Do not display or commit `.env.local`, `.env.local.production-backup`, or any Supabase keys.
