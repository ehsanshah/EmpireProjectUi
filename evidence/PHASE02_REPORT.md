# Phase 02 — actual implementation report

Date: 2026-10-27. Branch/commit: working tree; no commit created. User authorization: “I explicitly approve both the UI and UX of Phase 01. Execute Phase 02 only …”. Phase 01 approval is recorded in `PROJECT_STATE.json` exactly as supplied. Phase 02 implementation status: **awaiting_ui_ux_review**. Demo: **PASS** for the tested vertical slice. Live integration: **BLOCKED / unverified**. User acceptance for Phase 02: **pending**.

## Outcome and source changes

- Inspected existing application and the source reference contract before deriving a boundary. No actual Engine OpenAPI, event schema, BFF session endpoint, staging URL, auth configuration or test identities are present in this repository. `contracts/PHASE02_BOUNDARY_DECISION.md` records proposed vs verified status; `contracts/PHASE02_PROPOSED_OPENAPI.json` and `contracts/PHASE02_PROPOSED_EVENT.schema.json` are explicitly proposed, not server generated or verified.
- `src/core/contracts.ts` defines the typed session, capabilities, project creation, WorkItem read envelope, transition, receipt, activity, operation, Problem Details and event boundary. `src/core/demoClient.ts` provides a deterministic local implementation with project scope, opaque ETags, CSRF envelope check, one effect per idempotency key, validation errors, conflict and WIP handling, 202 polling, unknown-outcome reconciliation, receipts and activity. The project form now selects a human Owner and shows its Demo creation receipt. All receipts are local Demo values, not Engine audit evidence.
- `src/core/httpClient.ts` contains the proposed same-origin `/api/session` and `/api/ep/v1` adapter. It is inactive because the server contract is unverified. `VITE_CORE_MODE=live` renders an explicit unavailable state from `src/main.tsx`; it does not mount Demo data or silently fall back. Its proposed endpoints and response mapping require actual contract reconciliation before activation.
- The existing list, project switcher, clarification card, browser history, current 14-issue fixture and separately labeled historical 12/6/2 fixture remain in place. `src/App.tsx` now bootstraps the Demo session, reads project items and drawer/activity through the typed client, and sends status changes from issue controls, Kanban and Payment Work Flow through the same transition command. `src/core/TransitionDetails.tsx` shows scope/read count, current version and ETag, Demo scenario controls, pending state, receipt, activity and a conflict draft with explicit retry. `src/core/eventReducer.ts` scopes, deduplicates and detects version gaps and permission/stream resets. SSE metadata is treated as an invalidation prompt; it never confirms a write. A scoped refresh control rereads the project snapshot. The light glass drawer received a contrast fix after screenshot review.
- Other pre-existing local edits and fixture content were preserved. The Phase 02 unit tests were added as `tests/coreBoundary.test.ts`; the existing `tests/core.test.ts` remains intact.

## Run and review

From repository root: `npm ci`, then `npm run dev -- --port 5175`. Observed review URL during this run: `http://127.0.0.1:5175/?design=glass`. If that port is occupied, use the port printed by Vite. This is a localhost Demo link, available on the machine running the server. Clear or reset browser-local Demo data with **Reset issue data** for the canonical 14-issue project fixture; the historical acceptance dataset is only `fixtures/sprint12-historical-acceptance.json` and is not displayed by default. Review steps and separate checklists are in `evidence/PHASE02_UAT.md`.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Build + typecheck | Local | `npm run build` | PASS; TypeScript and Vite build completed | command output, `dist/` |
| Unit behavior | Local Demo/contract fixture | `npm test` | PASS: 11 files, 46 tests | `tests/coreBoundary.test.ts` and existing tests |
| Proposed JSON syntax | Local | `python3 contracts/validate_phase02_contracts.py` | PASS: JSON parsed and proposed route/parameter, response and event metadata structure checked; server conformance unverified | proposed contract files and validator |
| Browser slice | Chrome, local Demo | `npx playwright test tests/browser/coreSlice.spec.ts --workers=1` | PASS: transition, 412/retry, 202, unknown reconciliation, Owner/receipt journeys | `tests/browser/coreSlice.spec.ts`; screenshots below |
| Browser regression | Chrome, local Demo | `npm run test:e2e -- --workers=1` | PASS: 33/33. Earlier five-worker run: 30/32 with two timing/context failures; each passed in isolation and serial run | Playwright output; `tests/browser/` |
| Live fail closed | Chrome, local Live-mode preview | `VITE_CORE_MODE=live npm run dev -- --port 5176`; Chrome assertion on body | PASS: “Live integration unavailable” shown; `EMP-101` absent. This is a client gating check, **not** Engine integration | `src/main.tsx`; Chrome assertion |
| Real Engine staging | None available | No actual endpoint/auth test performed | BLOCKED / UNVERIFIED | `contracts/PHASE02_BOUNDARY_DECISION.md` |

Screenshots inspected: `evidence/phase02-demo-drawer.png` (desktop dark with Demo receipt/activity), `evidence/phase02-mobile-fa-light.png` (mobile Persian light). The initial light screenshot exposed poor drawer contrast; fixed in `src/glass-preview.css`, then reviewed again. Dynamic session, project read count, version and ETag are from the Demo client; no displayed issue count is hard-coded.

## Gaps and risks

| Gap | Affected capability | Owner/input | Exit evidence |
|---|---|---|---|
| Actual OpenAPI, event schema, operation IDs and response examples absent | All Live request/response mappings, transition schema and SSE | Backend | Definitions and generated client/contract tests against the Engine |
| BFF session, cookie/CSRF/Origin policy and least-privilege test identities absent | Live bootstrap, write authorization and revoke | IAM/Backend | Authenticated staging smoke including 401/403/CSRF/revoke |
| Staging URL/network unavailable | End-to-end Engine proof | DevOps | Reachable non-production service and test run |
| ETag, idempotency retention, async receipt and command-key wire details unverified | 412, duplicate suppression, 202 and unknown-outcome recovery | Backend | Server examples and staging conflict/retry tests with one audit effect |
| SSE cursor/replay, permission revision and reset behavior unverified | Scoped event recovery | Backend | Staging replay/gap/revoke tests with authoritative re-read |
| Existing list and non-status local edits still use the pre-existing repository model | Full Live data ownership and all mutation paths | Product/Backend, later scoped phases | Reconciled server read/write adapters and UIAPI scenarios in later phases |

The Demo is a client simulation; it does not provide durable audit, real ACL, real login/logout, cross-tab consistency or production security. Existing legacy local create/edit/reset controls remain Demo behavior. The `CoreClient` transport should not be enabled against a real service until wire schemas and security topology are reconciled. Phase 03 work has not started.

## Separate user approvals

UI review: **pending**; no Phase 02 UI approval message received. UX review: **pending**; no Phase 02 UX approval message received. Both must be explicitly approved before Phase 03.

## Next suggested delta

After both Phase 02 approvals, reconcile the actual Engine contract and staging inputs if supplied; then implement only the user-authorized next phase. No automatic continuation.
