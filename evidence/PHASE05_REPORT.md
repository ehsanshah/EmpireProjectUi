# Phase 05 — actual implementation report

Date: 2026-10-27. Branch/commit: current working tree; no commit created. Authorization: user explicitly approved both Phase 04 UI and UX, then requested Phase 05 only. Implementation status: **awaiting_ui_ux_review**. Demo: **PASS for tested scope**. Live: **BLOCKED / unverified**. Phase 05 user acceptance: **pending**.

## Outcome and source changes

- `src/CalendarView.tsx`, `src/calendarDomain.ts`, `src/App.tsx` preserve the existing Day/Week/Month Calendar, pinned date/all-day rows, time gutter, now line, readable category stripes, 60px/hour duration, overlap subcolumns, drag select/move/resize, Undo, drawer and commands. The Calendar now takes the shared filtered project workset and shows **rendered + unscheduled + outside window = matching workset count** using query metadata. A date-only planned start or deadline appears as an all-day marker, never an invented midnight appointment. Overnight end dates can be entered in the form. Keyboard Alt+arrow moves by 15 minutes or one day; Alt+Shift+arrow resizes by 15 minutes. The form and keyboard paths preserve the issue deadline. DST-gap local times are rejected with a visible error. The time gutter is sticky on horizontal scroll. Month now shows planned-start date-only chips as well as deadline chips.
- `src/TimelineView.tsx`, `src/timelineDomain.ts`, `src/phase05.css` replace the fixed sample Timeline with a navigable, date-only two-week projection of the same workset. Bars represent planned start through due date; a single date becomes a marker. It includes explicit rendered/unscheduled/outside accounting, authorized dependency labels with redaction, an undated section and issue drawer/Back context. The view states that it is not a critical-path engine.
- `src/core/contracts.ts`, `src/core/demoClient.ts`, `src/core/httpClient.ts` add a typed Demo ScheduleBlock read/preview/apply path. Demo validates project and block scope, version, timed/all-day shape, preview expiry, CSRF and idempotency, then produces a labeled Demo receipt. Rejected writes do not move a block. Live hourly scheduling fails explicitly and does not fall back to Demo. `contracts/PHASE05_SCHEDULING_DECISION.md` records the extension boundary under CD-03.
- The current 14-issue fixture and separate historical 12/6/2 fixture remain unchanged. Earlier project navigation, browser history, Board, Work Flow, drawer, clarification card and typed transition behavior were preserved.

## Run and review

From `/Users/ehsanshahbakhti/GolandProjects/EmpireProjectUi`: `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 5177`. The existing Vite server at port 5177 returned HTTP 200 and served the updated Timeline source at handoff. Use the printed Vite URL if the port is occupied. Open `/o/demo/p/empire/work?design=glass&view=timeline`, or use the Calendar sidebar control. **Reset demo** restores the current fixture and local schedule. Review journeys are in `evidence/PHASE05_UAT.md`.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Typecheck/build | Local | `npm run typecheck`; `npm run build` | PASS; Vite produced `dist/`, with a >500 kB chunk advisory | command output |
| Unit behavior | Local Demo | `npm test` | PASS: 14 files, 63 tests. Phase 05 focused: 4/4 | `tests/phase05.test.ts`; command output |
| Existing Calendar browser | Chrome, local Demo | `npm run test:e2e -- tests/browser/calendar.spec.ts` | First run 4/5; end-date sync defect fixed; targeted regression 1/1; subsequent full run includes all 5/5 | `tests/browser/calendar.spec.ts` |
| Phase 05 browser | Chrome, local Demo | `npm run test:e2e -- tests/browser/phase05.spec.ts` | Initial 1/3 due test fixture/selector assumptions; after correction 3/3 across focused runs and full regression | `tests/browser/phase05.spec.ts`; screenshots |
| Cross-view regression | Chrome, local Demo | `npm run test:e2e -- tests/browser/flows.spec.ts -g 'remaining work stays consistent'` | PASS 1/1 after undated Timeline entries retained the shared `data-issue` identity and `.unscheduled` section | `tests/browser/flows.spec.ts` |
| Full browser regression | Chrome, local Demo | `npm run test:e2e -- --workers=1` | PASS: 46/46 | Playwright output |
| Contract fixture | Local Demo | `npm test -- --run tests/phase05.test.ts` | PASS 4/4: accounting, date-only markers, overnight/DST/short duration, preview/version/idempotency/deadline/project scope | `tests/phase05.test.ts` |
| Real staging | None available | No authenticated Engine request performed | BLOCKED / UNVERIFIED | `contracts/PHASE05_SCHEDULING_DECISION.md` |

After the final Month marker edit, `npm run typecheck`, the Phase 05 focused 4/4 unit checks, and the existing Calendar Week/Month browser journey 1/1 passed. Chrome screenshots were captured and inspected: `docs/screenshots/phase05-timeline-en.png`, `docs/screenshots/phase05-calendar-fa-mobile.png`, `docs/screenshots/phase05-timeline-fa-mobile.png`, plus existing Calendar screenshots. The Timeline fixture has date ranges and undated issues; it has no due-only issue in the visible default window, so the single-date marker is unit-tested rather than claimed as visually reviewed in that default screen.

## Gaps and risks

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| Actual ScheduleBlock schema, routes, preview/receipt/version semantics absent | Live hourly scheduling and multiple blocks | Backend/Product | Explicit Demo adapter and UI complete | Reconciled OpenAPI, fixtures and authenticated staging tests |
| Working calendar, DST ambiguity and resource-overlap policy absent | Valid scheduling decisions | Backend/Product | Demo rejects nonexistent local times and shows advisory overlap | Policy fixture and contract tests |
| Actual Engine workset/date query metadata and authorized dependency projection unavailable | Live counts and Timeline dependency visibility | Backend/IAM | Local Demo projection verified | Server schema, permission cases, staging tests |
| Same-origin BFF session/CSRF and least-privilege identities unavailable | Live writes/read scope | IAM/Backend | Demo session only | Authenticated staging setup |
| Non-production staging URL/reachability unavailable | Real Live journeys | DevOps | Local build/browser checks complete | Reachable URL and test run |
| Screen reader and reduced-motion manual audit not performed | Accessibility acceptance | Product/QA | Keyboard/RTL/mobile browser checks complete | Human audit notes |

No actual Engine operation ID or successful Live schedule call was inferred. `CONTRACT_DECISIONS.md`, `contracts/ENGINE_MAPPING.csv`, `FEATURE_COVERAGE.csv` and `UIAPI_TRACEABILITY.csv` record the Demo evidence and blocked Live scope.

## Separate user approvals

UI review: **pending**; no Phase 05 UI approval received. UX review: **pending**; no Phase 05 UX approval received. Both are required before Phase 06.

## Next phase

Record the user's separate Phase 05 UI and UX decisions. Phase 06 has not started.
