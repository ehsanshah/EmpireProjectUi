# Phase 06 — actual implementation report

Date: 2026-10-27. Branch/commit: current working tree; no commit created. Authorization: user explicitly approved both Phase 05 UI and UX, then requested Phase 06 only. Implementation status: **awaiting_ui_ux_review**. Demo: **PASS for tested scope**. Live: **BLOCKED / unverified**. Phase 06 user acceptance: **pending**.

## Outcome and source changes

- `src/SprintWorkspace.tsx`, `src/phase06.css`, `src/App.tsx`, `src/domain.ts`, `src/routes.ts` add a project-scoped Backlog & Sprints workspace at `/o/demo/p/empire/planning`. It shows the Epic/Issue tree, parent and child creation through the typed WorkItem command, versioned rank controls, Backlog, active Sprint 12, planned Sprint 13 and Deferred areas. A destination change opens a preview; deferral requires a reason. The original 14-issue fixture and separate historical acceptance fixture were not edited. Review-created items are explicit Demo changes and Reset demo restores the starting fixture.
- `src/sprintDomain.ts`, `src/core/contracts.ts`, `src/core/demoClient.ts`, `src/core/httpClient.ts` add typed planning snapshot, sprint-fit, lifecycle preview/apply and rank commands. Demo checks project scope, returned role capabilities, Sprint/issue version, rank revision and anchors, preview expiry, CSRF and idempotency before a receipt. Rejections preserve the preview/draft. Live methods explicitly fail; no Demo response is substituted in Live.
- A planned Sprint needs a human-entered Goal before start. Start captures an immutable commitment baseline. Scope changes remain visible separately. Completion requires an explicit destination for every unfinished issue, plus a reason for each deferred item. Reopen changes lifecycle state without silently restoring scope. DoD is editable and displayed; the Demo does not claim per-item DoD evidence was verified.
- Fit simulation returns `fits`, `does_not_fit` or `fit_unknown` with Demo graph/capacity snapshot refs. Missing leaf estimates or capacity remain unknown. Points, hours and available capacity are shown separately. A parent estimate is excluded whenever that parent has a child in the project hierarchy, including across Sprints. The Sprint report defines current scope, completed issues, completed leaf points, baseline and added/removed scope. Goal assessment remains `unassessed`; completed points do not imply Goal achievement or delivery.
- Approved Phase 01–05 work, navigation, Board, Work Flow, Calendar, Timeline and clarification behavior remain in place.

## Run and review

From `/Users/ehsanshahbakhti/GolandProjects/EmpireProjectUi`: run `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 5177`. The existing local Vite server served the updated Phase 06 source at handoff. Open [the planning UI](http://127.0.0.1:5177/o/demo/p/empire/planning?design=glass). Use **Reset demo** for the current 14-issue fixture. See `evidence/PHASE06_UAT.md` for separate UI and UX journeys.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Typecheck/build | Local | `npm run typecheck`; `npm run build` | PASS; Vite built 1,629 modules with a >500 kB chunk advisory | command output; `dist/` |
| Unit behavior | Local Demo | `npm test` | PASS: 15 files, 67 tests; Phase 06 focused 4/4 | `tests/phase06.test.ts` |
| Browser journeys | Chrome, local Demo | `npm run test:e2e -- tests/browser/phase06.spec.ts` | PASS: 3/3, including unknown fit, settings/scope/start previews and receipts, explicit completion disposition and deferred reason, reopen, typed Epic/child creation, RTL mobile | `tests/browser/phase06.spec.ts`; screenshots |
| Full browser regression | Chrome, local Demo | `npm run test:e2e -- --workers=1` | PASS: 49/49, including Phase 01–05 journeys | Playwright output |
| Contract fixture | Local Demo | `npm test -- --run tests/phase06.test.ts` | PASS: parent/child and cross-Sprint double-count prevention; fits/does_not_fit/fit_unknown; baseline/scope; 412 conflict; idempotency; rank revision; unfinished disposition | `tests/phase06.test.ts` |
| Real staging | None available | No authenticated Engine request performed | BLOCKED / UNVERIFIED | `contracts/PHASE06_PLANNING_DECISION.md` |

Captured and inspected actual Chrome screenshots: `docs/screenshots/phase06-planning-desktop.png`, `docs/screenshots/phase06-planning-mobile-fa.png` and `docs/screenshots/phase06-hierarchy.png`. The hierarchy capture shows a review-created Epic and child; they are not part of the untouched starting fixture.

## Gaps and risks

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| Actual Sprint schema, operation IDs, response/receipt/operation envelopes unavailable | Live lifecycle, rank, fit and reports | Backend/Product | Typed Demo path verified | Reconciled OpenAPI and contract tests |
| Role grants and BFF session/CSRF/test identities unavailable | Live Scrum Master/Lead permission policy | IAM/Backend | Demo adapter enforces returned capability | Authenticated least-privilege staging tests |
| Staging URL/reachability unavailable | Real Live journeys | DevOps | Local UI/browser verified | Non-production endpoint and test run |
| Goal/DoD evidence and working-calendar/capacity policy not specified | Actual Goal attainment, completion gate and resource fit | Product/PM/Backend | Demo keeps Goal unassessed and DoD visible | Policy fixture, evidence schema and acceptance tests |
| Async Sprint operation contract absent | Pending job polling/reconciliation | Backend | Demo returns immediate receipts; UI displays operation state if supplied | Server operation envelope and reconciliation tests |
| Screen reader and reduced-motion human audit not performed | Accessibility acceptance | Product/QA | Keyboard controls, focus styling, RTL/mobile browser checks | Human audit notes |

`contracts/PHASE06_PLANNING_DECISION.md` records proposed behavior and exact Live blockers. `contracts/ENGINE_MAPPING.csv`, `FEATURE_COVERAGE.csv` and `UIAPI_TRACEABILITY.csv` record Demo evidence without claiming Engine verification. No deployment, external service connection, Phase 07 work or real release action occurred.

## Separate user approvals

UI review: **pending**; no Phase 06 UI approval received. UX review: **pending**; no Phase 06 UX approval received. Both are required before Phase 07.

## Next phase

Record the user's separate Phase 06 UI and UX decisions. Phase 07 has not started.

## Review corrections — 2026-10-27

The user reported that the planning tabs collapsed into a narrow strip at approximately 680px and asked for Classic/light defaults and a collapsed Workspace agent. The tab strip now resists flex shrink and retains a 44px minimum height. The design switch says **Classic / Glass** while keeping `?design=current` as the compatible Classic route. A URL with no design parameter now opens Classic; the theme starts light. The Workspace agent starts closed and opens from the labeled **Agent** button next to the command field; closing it restores focus to that button. The 14-issue fixture, historical fixture and Phase 06 command behavior were not changed.

The actual 680px Chrome capture is [phase06-tabs-classic-light.png](../docs/screenshots/phase06-tabs-classic-light.png). Final verification: build/typecheck **PASS**, unit tests **67/67**, and the complete Chrome suite **51/51**. Browser coverage includes tab geometry at 680px, Classic/light defaults, the closed Agent panel and its click/focus behavior, clarification, planning commands and prior Phase 01–05 journeys. The existing port 5177 preview returned HTTP 200 and served the final **Workspace agent** wording. Separate UI and UX approval remains pending; Phase 07 has not started.
