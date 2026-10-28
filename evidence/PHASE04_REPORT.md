# Phase 04 — actual implementation report

Date: 2026-10-27. Branch/commit: current working tree; no commit created. Authorization: user explicitly approved both Phase 03 UI and UX, then requested Phase 04 only. Implementation status: **awaiting_ui_ux_review**. Demo: **PASS** for tested scope. Live: **BLOCKED / unverified**. Phase 04 user acceptance: **pending**.

## Outcome and source changes

- `src/core/contracts.ts`, `src/core/demoClient.ts`, `src/core/httpClient.ts` add a typed Board snapshot and placement boundary. Demo workflow mapping supplies five columns, two swimlanes, exact project count, project-wide In Progress WIP policy and rank revision. A placement checks CSRF, idempotency, item ETag, rank revision/anchors, mapped target, required transition fields and full-project WIP before changing a card. A successful placement returns a Demo receipt, activity entry and scoped event. The Live write fails explicitly; it never uses Demo fallback.
- `src/App.tsx` routes pointer, keyboard and menu Board moves through the same typed placement command and applies the new issue only after a receipt. WIP rejection leaves the source position. 422 fields open a retained move draft; 409 rank and 412 version conflicts refresh the scoped Demo snapshot and preserve the draft for review/retry. Drawer and Work Flow status edits continue through the shared transition path, which validates the same required field and WIP rule.
- `src/KanbanBoard.tsx`, `src/kanban.ts`, `src/kanban.css`, `src/phase04.css` use the workflow column/swimlane mapping, keep the lifted drag/actual-height placeholder/collapse and manual alternatives, show policy-wide WIP, reconcile the filtered workset with an unmapped-status tray, and show required-field/conflict recovery without optimistic card movement. Board settings can load a clearly labeled browser-local required-field review scenario for EMP-102; Reset demo restores the canonical fixture.
- `src/paymentGraph.ts`, `src/WorkFlow.tsx` retain the four-node PAY graph with four attached edges and two converging paths. The view supports blocker/path highlighting, issue drawer, pan/zoom/Fit and mobile stacked order. Hidden prerequisite labels are redacted; readiness is derived without changing business status, review acceptance or release state.
- The default current 14-issue fixture and separate historical 12/6/2 fixture remain intact. Phase 01 project navigation/history/clarification and Phase 02–03 typed flows remain in place. Board counts come from workset metadata and the Board policy snapshot, never the loaded List page.

## Run and review

From `/Users/ehsanshahbakhti/GolandProjects/EmpireProjectUi`: run `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 5176`. At delivery, a Vite server started from this checkout responded with HTTP 200 at **http://127.0.0.1:5177/o/demo/p/empire/work?design=glass&view=board** because port 5176 was already occupied by another responding local server. Use the 5177 link for this review, or the printed Vite URL after your own start. Reset browser-local Demo state with **Reset demo**. See `evidence/PHASE04_UAT.md` for separate UI and UX journeys.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Typecheck/build | Local | `npm run typecheck`; `npm run build` | PASS; Vite built 1,623 modules, with an existing >500 kB chunk advisory | command output; `dist/` |
| Unit behavior | Local Demo | `npm test` | PASS: 13 files, 59 tests; Phase 04 checks full-scope WIP, required fields shared by Board/drawer, 409/412, rank anchors/revisions, idempotent receipt, graph paths/redaction/readiness | `tests/phase04BoardFlow.test.ts` |
| Focused browser | Chrome, local Demo | `npm run test:e2e -- --workers=1 tests/browser/kanban.spec.ts tests/browser/workflow.spec.ts`; `npm run test:e2e -- --workers=1 tests/browser/phase04.spec.ts` | PASS: 5/5 existing Board/Flow and 3/3 added Phase 04 journeys, including successful keyboard move and conflict retry | `tests/browser/kanban.spec.ts`; `tests/browser/workflow.spec.ts`; `tests/browser/phase04.spec.ts` |
| Full browser regression | Chrome, local Demo | `npm run test:e2e -- --workers=1` | PASS: 42/42 at the time of the full run, including Phase 01–03 journeys; the later added keyboard case passed in the focused run | Playwright output; `tests/browser/` |
| Contract fixture | Local Demo | `npm test -- --run tests/phase04BoardFlow.test.ts` | PASS: 6/6 focused tests | `tests/phase04BoardFlow.test.ts` |
| Real staging | None available | No authenticated Engine request performed | BLOCKED / UNVERIFIED | `contracts/PHASE04_BOUNDARY_DECISION.md` |

Chrome screenshots were captured and visually inspected: `docs/screenshots/kanban-03-wip-full.png`, `docs/screenshots/workflow-desktop-dark.png`, `docs/screenshots/workflow-mobile-fa.png`, `evidence/phase04-required-field.png` and `evidence/phase04-conflict-draft.png`. The screenshots support composition checks; automated browser tests cover the actual interactions. A human UI and UX decision is still pending.

## Gaps and risks

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| Actual Engine OpenAPI/event schemas and Board wire operations unavailable | Live Board config, placement/transition atomicity, WIP scope, rank anchors, receipt and conflict semantics | Backend | Demo typed path verified | Reconciled operation IDs/schemas plus contract tests |
| BFF session/CSRF, least-privilege identities and dependency redaction policy unavailable | Live authorization and hidden prerequisite projection | IAM/Backend | Demo redaction behavior verified | Authenticated staging 401/403/revoke/hidden-node tests |
| Staging URL/reachability unavailable | Real Live journeys | DevOps | Local Demo verified | Non-production endpoint and successful authenticated test run |
| Fixture has no status-entry timestamp or authoritative aging policy | True time in column | Backend/Product | Blocker indicator and due dates remain available | Status-history field/policy and aging acceptance fixture |
| Dependency read model and workflow revision mapping unverified | Live four-node projection and workflow columns | Backend | Demo graph and mapping verified | Server authorized graph/workflow examples and permission tests |

The Demo is deterministic, browser-local behavior; its receipts/activity are simulated. No Live response was substituted. No deployment, external service connection, Phase 05 work or real release action occurred.

## Contract changes

`contracts/PHASE04_BOUNDARY_DECISION.md` and `contracts/ENGINE_MAPPING.csv` record proposed/unverified Board operations and the unresolved atomic move/rank question. No actual Engine operation ID or hidden-dependency response was inferred. `FEATURE_COVERAGE.csv` and `UIAPI_TRACEABILITY.csv` reflect Demo evidence and continuing Live blockers.

## Separate user approvals

UI review: **pending**; no Phase 04 UI approval received. UX review: **pending**; no Phase 04 UX approval received. Both are required before Phase 05.

## Next phase

Record the user's separate Phase 04 UI and UX decisions. Phase 05 may start only after both are explicitly approved and the user requests it; it has not started.
