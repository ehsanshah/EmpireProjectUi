# Phase 01 — actual implementation report

Date / branch: 2026-10-27 / `main` (pre-existing dirty tree preserved). Authorization: user's explicit Phase 00 UI and UX approval, then request to start Phase 01 only. Implementation status: `awaiting_ui_ux_review`. Demo status: `PASS` for tested flows. Live status: `UNVERIFIED`. User acceptance: pending.

## Outcome and source changes

- Added `src/ClarificationCard.tsx` and `src/clarification.css`. The contextual assistant now offers a clearly labeled interactive Demo card with two ID-bound sample Saras, numbered choices, Other, editable direct reply, required/optional mode, Skip only when optional, edit answer, close/reopen, keyboard focus and Persian RTL/light styling. A command, `Assign remaining tasks to Sara`, opens the same card. It records an answer locally and never assigns work or sends a request. Project switching clears its scoped state.
- `src/routes.ts` and `src/App.tsx` give the implemented project/work views local `/o/demo/p/:id/…` deep links and browser Back behavior. `demoNavigationCapabilities` displays only implemented Demo destinations. This is URL/UI state, not auth. Existing project switcher, work views, calendar, Work Flow, voice form and user edits were preserved. `src/glass-preview.css` makes the existing theme control visible on desktop glass.
- The running `fixtures/sprint12.json` still contains its 14 issues; its stale `expected` summary now matches the records (14 total, 8 remaining, 2 blocked). `fixtures/sprint12-historical-acceptance.json` separately preserves the older 12/6/2 acceptance scenario and labels its purpose. Counts shown by the app continue to derive from records in `src/App.tsx`/`src/domain.ts`, not fixture metadata or literals.
- Route and role/component inventory: `evidence/PHASE01_ROUTE_ROLE_MATRIX.md`. No user source was replaced wholesale, no API key/service was added, and no Phase 02 client was implemented.

## Run and review

From repository root: `npm ci`; `npm run dev -- --port 5173`; open the printed URL with `?design=glass`. During this run, a live Vite instance remained at `http://127.0.0.1:5174/?design=glass`. The app normalizes the URL to a local `/o/demo/p/empire/work?design=glass&view=list` route. No external service is needed. Reset demo before comparing counts. Review steps are in `evidence/PHASE01_UAT.md`.

| Check | Mode/environment | Exact command or interaction | Result | Evidence |
|---|---|---|---|---|
| Build | Local Demo | `npm run build` | PASS, 1611 Vite modules, output in `dist/` | command output this phase |
| Typecheck | Local Demo | `npm run typecheck` | PASS | command output this phase |
| Unit | Local Demo | `npm test` | PASS, 10 files / 39 tests; current and historical fixture and route tests included | `tests/fixtures.test.ts`, `tests/routes.test.ts` |
| Browser | Local Chrome | `npm run test:e2e` | PASS, 31 tests / 33.6s | `tests/browser/clarification.spec.ts`, `tests/browser/routes.spec.ts` and existing suite |
| Manual visual capture | Chrome, 1440 dark EN, 768 light EN, 390 light FA | opened card and captured actual UI | Captured; user visual decision pending | `phase01-desktop-en-dark.png`, `phase01-tablet-en-light.png`, `phase01-mobile-fa-light.png` |
| Contract-fixture | Proposed v1.0 source | Mapping reviewed | No executable schema; UNVERIFIED | `contracts/ENGINE_MAPPING.csv` |
| Real staging | Not supplied | No request attempted | UNVERIFIED | Backend/DevOps/IAM inputs still missing |

The first route browser test assertion incorrectly expected PAY-38 text inside a collapsed Done column. It failed once; the test was corrected to assert visible PAY-42, and the focused rerun plus full suite passed. No application defect was identified in that failure.

## Gaps and risks

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| No actual OpenAPI, event schemas, backend implementation or non-production staging/auth inputs | Live BFF/session/API, permissions, receipts and SSE | Backend/DevOps/IAM | Continue UI review and proposed mapping | actual schemas, authorized staging connection and integration tests |
| Clarification is deterministic local presentation | AI continuation, identity lookup and approval | AI/Backend; Phase 07 | Review the interaction grammar now | real interaction schema, continuation response and tests |
| `/o/demo` routes carry local state only | Server-backed org routing, authorization, refreshable drafts | Backend; Phase 02/14 | Review current shell | server session/ACL and route reconciliation |
| Historical 12/6/2 differs from current 14/8/2 | Acceptance oracle | Product/QA | Keep both fixtures explicit | revised acceptance decision for future phases |
| Prior screens not final | Visual/product acceptance | User/Designer | Review Phase 01 delta | explicit separate UI and UX decisions |

## Contract changes

None. The source v1.0 catalog is still proposed; `contracts/ENGINE_MAPPING.csv` has no actual operation IDs or staging results. The card does not invent an `/answers` payload, and the route prefix is explicitly Demo-only.

## Separate user approvals

Phase 00 UI and UX were explicitly approved by the user's message in this phase's request. Phase 01 UI review: pending; approval message not received. Phase 01 UX review: pending; approval message not received. Phase 02 must wait for both.

## Next phase

Phase 02 is the typed API seam and core vertical slice described by the delivery pack. It was not started. The current result is ready for separate Phase 01 UI and UX review.
