# Phase 03 — actual implementation report

Date: 2026-10-27. Branch/commit: current working tree; no commit created. Authorization: the user explicitly approved Phase 02 UI and UX, then requested Phase 03 only. Status: **awaiting_ui_ux_review**. Demo: **PASS** for the tested scope. Live: **BLOCKED / unverified**. Phase 03 user acceptance: **pending**.

## Outcome and source changes

- `src/core/contracts.ts`, `src/core/workItemSchema.ts`, `src/core/demoClient.ts` and `src/core/httpClient.ts` extend the shared typed boundary with project schema, WorkItem drafts/writes, workset query metadata and cursors, saved views, selection tokens, bulk previews/per-item results, sensitive-action previews and scoped entries. The Live transport mapping is proposed and disabled; `contracts/PHASE03_BOUNDARY_DECISION.md` separates this proposal from actual server evidence.
- `src/WorkItemForm.tsx` renders type, hierarchy, priority, human/Demo Agent assignment, dates, estimate/unit, labels, components and project custom fields. It validates locally and through the typed command, retains unknown custom data, and keeps a draft visible on field errors or 412 conflicts until an explicit retry succeeds.
- `src/App.tsx`, `src/WorkList.tsx`, `src/ListWorkspaceControls.tsx`, `src/Modal.tsx`, `src/WorkItemCollections.tsx`, `src/domain.ts` and `src/routes.ts` add drawer/full-page routes, quick/full create and edit, list filters, stable sorting/grouping, configurable columns, cursor paging, personal/shared Demo views, scoped key lookup, visible-ID versus snapshot selection, bulk preview/results, comments/links/worklogs, activity and previewed archive/restore/clone/move. File, Agent run and review tabs state their current unavailability. `src/phase03.css` keeps the controls compact by default and adapts them to RTL/mobile.
- The default displayed fixture remains the current 14-issue `fixtures/sprint12.json`; the older 12/6/2 scenario remains separate in `fixtures/sprint12-historical-acceptance.json`. Workset totals come from `ReadEnvelope.meta.count`, not page row length. No displayed count is hard-coded. Phase 01 project navigation, browser history and clarification card, and Phase 02 transition/receipt/activity flows remain in place.

## Run and review

From `/Users/ehsanshahbakhti/GolandProjects/EmpireProjectUi`: `npm ci`, then `npm run dev -- --port 5176`. Open `http://127.0.0.1:5176/?design=glass` while the server is running. `evidence/PHASE03_UAT.md` gives exact UI and UX journeys. Reset local Demo issue changes with the existing **Reset issue data** control if needed. Saved Demo views use a separate browser-local key; clear site storage to reset them.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Typecheck/build | Local | `npm run typecheck`; `npm run build` | PASS; production bundle built, with Vite's >500 kB chunk advisory | command output, `dist/` |
| Unit behavior | Local Demo | `npm test` | PASS: 12 files, 53 tests, including seven Phase 03 boundary cases | `tests/phase03Core.test.ts` |
| Browser Phase 03 | Chrome, local Demo | `npm run test:e2e -- --workers=1 tests/browser/phase03.spec.ts` | PASS: seven journeys covering cursor totals, saved views, full-page refresh, validation, bulk explicit/snapshot selection, scoped lookup, archive/restore, 412 draft recovery and visual captures | `tests/browser/phase03.spec.ts` |
| Browser regression | Chrome, local Demo | `npm run test:e2e -- --workers=1` | PASS: 40/40 browser tests | Playwright output; `tests/browser/` |
| Contract fixture | Local Demo | `npm test -- tests/phase03Core.test.ts` | PASS: seven tests; no actual Engine contract conformance asserted | `tests/phase03Core.test.ts` |
| Live isolation | Chrome, local `VITE_CORE_MODE=live` preview on 5181 | Started Vite, opened page in Chrome, checked unavailable heading and absence of EMP-101 | PASS: unavailable heading visible; no Demo issue visible. This is client gating, not Engine integration | `src/main.tsx`; browser check output |
| Real staging | None available | No authenticated Engine request performed | BLOCKED / UNVERIFIED | `contracts/PHASE03_BOUNDARY_DECISION.md` |

Screenshots captured by Chrome and visually inspected: `evidence/phase03-list-desktop.png`, `evidence/phase03-full-page-top.png`, `evidence/phase03-full-page-form.png`, `evidence/phase03-mobile-fa-light.png`. The expanded controls reduce visible rows while open; collapsing them restores list space. The full-page view is a wide, scrollable dialog route with a deep link and explicit return to the drawer.

## Gaps and risks

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| Actual Engine OpenAPI, event schemas and operation IDs absent | Every Live route, schema, count/cursor, saved view, preview and receipt envelope | Backend | Demo/client proposal complete | Generated client plus contract tests against actual definitions |
| BFF session/CSRF and least-privilege identities absent | Live authorization, scoped search, forbidden metadata, revoke | IAM/Backend | Fail-closed UI and Demo scope tests complete | Authenticated staging 401/403/CSRF/revoke journeys |
| Staging URL/reachability absent | End-to-end Live verification | DevOps | Local Demo verified | Non-production host and successful test run |
| Selection-token, bulk atomicity, per-item receipt, cursor expiry and action mapping unverified | Live bulk and sensitive actions | Backend | Explicit Demo behavior implemented | Wire examples and staging conflict/partial-result tests |
| File transport absent | File tab | Phase 08/Backend | Honest entry point shown | Upload/scan transport and receipt verification |

The Demo is deterministic client behavior and browser-local storage. It does not deliver durable audit, enterprise ACL, real membership lookup, file transport or server-side saved-view sharing. Unknown/estimated count rendering is supported by the typed UI but actual Engine responses have not been exercised. A cursor expiry in Demo restarts the same query at page one with a visible message. The Live application remains explicitly unavailable rather than mounting Demo data.

## Contract changes

`contracts/ENGINE_MAPPING.csv` and `contracts/PHASE03_BOUNDARY_DECISION.md` record the proposed, unverified route mapping. No actual Engine operation ID was inferred. The existing Phase 02 proposed OpenAPI/event artifacts remain proposals. Enabling Live requires contract reconciliation and a separate staging verification.

## Separate user approvals

UI review: **pending**; no Phase 03 UI approval received. UX review: **pending**; no Phase 03 UX approval received. Both are required before Phase 04.

## Next phase

After explicit UI and UX approval, Phase 04 may begin under its own scope. No Phase 04 implementation was performed here.
