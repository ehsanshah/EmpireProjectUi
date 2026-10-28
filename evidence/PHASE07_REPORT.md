# Phase 07 — actual implementation report

Date: 2026-10-27. Branch/commit: current working tree; no commit created. Authorization: user explicitly approved Phase 06 UI and UX, including planning-tab fixes, and requested Phase 07 only. Implementation status: **awaiting_ui_ux_review**. Demo: **PASS for tested scope**. Live: **BLOCKED / unverified**. Phase 07 UI and UX acceptance: **pending**.

## Outcome and source changes

- `src/aiDomain.ts`, `src/AIResponseCard.tsx`, `src/ai.css`, `src/App.tsx` provide a project-scoped Demo AI boundary with typed `answer`, `clarifying_question`, `insight_case`, `action_proposal`, `execution_progress` and `outcome_review` outputs plus a safe unknown-kind state. Explicit selection, page, query, mode, locale, timezone and link references are included in context. Links are not fetched or used as evidence; ready files and mentions have no authorized integration.
- Read prompts change the main workset through existing typed intents: current fixture 14 total, 8 remaining and 2 blocked; refinement retains the query across Calendar and drawer, while Back restores view state. The historical 12/6/2 fixture remains separate. Counts are computed from the current workset, not hard-coded display values or a loaded page. The AI panel opens through **Agent** and starts closed. Classic/light remain defaults; planning tabs remain readable.
- `src/ClarificationCard.tsx` now carries contract-style question ID, field path, numbered options, required/optional status, Other/direct answer, answer correction, revision and continuation token. The Demo adapter checks project/query/selection scope, question version and token before continuing. Ambiguous Sara and relative Tuesday remain unresolved until a person or exact date is chosen. A date-only deadline produces no timed appointment.
- A proposal shows scope, before/after, evidence basis, permission, missing fields and expiry. **Approve and apply** uses the shared validated WorkItem client, target version/ETag, schema revision, CSRF, per-item idempotency keys and applied receipts; unknown outcomes reconcile by key. Rejected, expired, stale or conflicted proposals do not get a committed-success message. Demo assignment targets are existing fixture work only; two Demo member choices were added without changing issue records.
- `src/NewProjectForm.tsx`, `src/speechCapture.ts` expose explicit browser microphone start, English/Persian recognition choice, editable transcript, visible source-labeled draft fields, ambiguity handling, manual-edit protection and Undo. Stop, Cancel, unmount and page navigation release tracks. Dictated “create” wording fills a draft only; the normal Create button is required. Typed-transcript mode is labeled as a test. Browser speech may use its own service and no Empire transcription provider or upload endpoint is configured.
- No Phase 08 behavior was added. The current 14-issue fixture, separate historical fixture and approved Phase 01–06 journeys remain in place.

## Run and review

From `/Users/ehsanshahbakhti/GolandProjects/EmpireProjectUi`: `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 5177`. The existing local preview returned **HTTP 200** after the final build at [Phase 07 UI](http://127.0.0.1:5177/o/demo/p/empire/planning). Use **Reset issue data** to restore the current Demo fixture; review-created local projects remain in local browser storage until cleared separately. See `evidence/PHASE07_UAT.md` for the distinct UI and UX review journeys.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Typecheck | Local | `npm run typecheck` | PASS | TypeScript exit 0 |
| Build | Local | `npm run build` | PASS; 1,632 modules, 581.40 kB JS chunk advisory | Vite output, `dist/` |
| Core behavior | Deterministic Demo | `npm test -- --run` | PASS: 16 files, 71 tests; Phase 07 typed boundary 4/4 | `tests/phase07.test.ts`, `tests/voiceForm.test.ts` |
| Full browser regression | Chrome, local Demo | `npm run test:e2e -- --workers=1` | PASS: 55/55 in 1.2 minutes; earlier phases and Phase 07 | `tests/browser/phase07.spec.ts`, `tests/browser/clarification.spec.ts`, `tests/browser/voiceForm.spec.ts` |
| Prompt-to-View | Chrome, current fixture | Remaining → blocked → Calendar → issue drawer → Back | PASS: 8 then 2 in main view, drawer/history restored | `docs/screenshots/phase07-prompt-to-view.png` |
| Proposal and write | Chrome, current fixture | Resolve Sara → Skip optional reason → approve | PASS: 8 applied Demo receipts; assignees changed only after approval | `docs/screenshots/phase07-proposal-outcome.png` |
| Date ambiguity | Chrome, current fixture | Tuesday → reject ambiguous reply → exact `2026-11-03` → approve | PASS: date-only deadline with receipt | `tests/browser/phase07.spec.ts` |
| Speech UI and cleanup | Mocked browser speech API, typed transcript fixtures | Finalize/Stop, Cancel/navigation, editable draft, Undo | PASS: mocked final transcript fills fields; tracks stopped; spoken create does not submit | `tests/browser/voiceForm.spec.ts` |
| Real microphone/provider | Hardware/service not available to the test run | No real microphone transcription or Empire upload attempted | **NOT VERIFIED**; mocked API is not hardware evidence | `contracts/PHASE07_AI_VOICE_DECISION.md` |
| Live Engine/staging | No reconciled backend or staging | No authenticated AI/proposal/speech request | **BLOCKED / UNVERIFIED**; no Demo fallback claimed | `contracts/PHASE07_AI_VOICE_DECISION.md` |

Actual Chrome captures were inspected: the Classic/light workset with two blocked issues and the receipt outcome after applying eight assignments. The proposal screenshot shows a narrower list while Agent is open; the underlying workset stays project scoped. A screen-reader and real-hardware microphone audit were not performed.

## Gaps and risks

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| Actual AI interaction/answer/query-run schema and continuation rules unavailable | Live contextual outputs and clarification | Backend/AI | Deterministic Demo verified | Reconciled OpenAPI plus authenticated contract tests |
| Proposal approval, permission and receipt wire contract unavailable | Live AI writes | Backend/IAM/AI | Shared Demo command path verified | Staging stale/duplicate/partial-result run |
| Empire speech provider, upload route, retention and language capability unavailable | Real provider voice-to-form | Speech/Backend/Privacy | Browser capability and honest unavailable state | Consented hardware/provider test and policy |
| Staging URL, BFF session, CSRF and test identities unavailable | All Live journeys | DevOps/IAM/Backend | Local UI and Demo verified | Authenticated non-production run |
| Ready-file and mention authorization contracts absent | Contextual retrieval | Backend/IAM | Link reference is visible but never fetched | Scoped reference and access-ticket fixture |
| Screen reader and real microphone human audit not performed | Accessibility and speech acceptance | Product/QA | Keyboard, focus, RTL/mobile browser checks | Human audit notes |

## Contract changes

`contracts/PHASE07_AI_VOICE_DECISION.md` documents the proposed typed Demo boundary and unreconciled Live interfaces. `contracts/ENGINE_MAPPING.csv`, `FEATURE_COVERAGE.csv` and `UIAPI_TRACEABILITY.csv` distinguish Demo test evidence from Live status. CD-07 remains open. No endpoint, operation ID or transcription job is claimed as verified.

## Separate user approvals

UI review: **pending**; no Phase 07 UI approval received. UX review: **pending**; no Phase 07 UX approval received. Both are required before Phase 08.

## Next phase

Collect explicit UI and UX review decisions. Phase 08 has not started.

## Recorded review decision — 2026-10-27

The user explicitly approved **UI and UX of the tested Phase 07 Demo flows**. This changes Phase 07 implementation status to accepted for that reviewed Demo scope. Real microphone transcription and Live Engine integration remain **BLOCKED / unverified**, exactly as the user specified. The Phase 08 request was authorized separately after this decision.
