# Phase 07 — AI and speech contract decision

Status: **proposed Demo boundary; Live unreconciled** (2026-10-27). Source: `reference/EmpireProject_UI_Engine_API_Contract_FA_v1.0.md` sections 6 and 11, `CONTRACT_DECISIONS.md` CD-07, and `AI_CLARIFICATION_UX_EN.md`.

## Implemented local boundary

`src/aiDomain.ts` defines scoped context and the six typed output kinds. The renderer in `src/AIResponseCard.tsx` accepts bounded text and fields only; unknown or malformed top-level outputs become an unsupported state. The Demo adapter generates interaction IDs, versioned question IDs, continuation tokens and five-minute proposals. It binds continuations and approvals to project, query revision, page, explicit selection, input references, target versions and expiry. The existing main workspace applies read intents. A write proposal requires a click and is sent through `core.writeWorkItem` with CSRF, schema revision, If-Match, stable per-item idempotency key, permission validation and receipt reconciliation. The UI counts only applied receipts as committed.

This is a deterministic **Demo** protocol, not a verified server protocol. Link input is a context reference only: no fetch, retrieval or citation is claimed. Ready-file references and mentions remain unavailable until the authorization contract exists.

`src/speechCapture.ts` uses an explicitly initiated browser SpeechRecognition capability plus `getUserMedia`, with English/Persian language selection. The browser may use its own speech service. `src/NewProjectForm.tsx` exposes an editable transcript, source-labeled field changes, ambiguity choices, manual-edit protection and Undo. Final project creation still requires the ordinary Create button. No Empire speech provider, upload route, transcription job or retention policy is configured; unsupported browsers show an unavailable state and retain manual and typed-test input. Mocked SpeechRecognition tests prove UI wiring and track cleanup, **not real microphone capture or provider accuracy**.

## Live contract inputs needed

| Owner | Required input | Exit evidence |
|---|---|---|
| Backend/AI | Actual OpenAPI for interaction creation/read/answers, typed output schema, query-run references, continuation expiry, revision and replay rules | Generated/validated client and authenticated contract fixture |
| Backend/AI/IAM | Proposal preview, approval/rejection/commit wire format, effective permission and version binding, operation/receipt reconciliation | Staging approval, stale/duplicate, permission and partial-result tests |
| Speech/Backend/Privacy | Authorized audio upload/transcription capability, file limits, provider, locale/segment/provenance schema, retention and deletion policy | Real provider handshake and consented hardware test in staging |
| DevOps/IAM | Staging URL, same-origin BFF session, CSRF and least-privilege test identities | Authenticated end-to-end Live run |

No Live request falls back to the Demo adapter. Engine operation IDs and endpoints in the reference remain proposals until reconciled with the actual backend. CD-07 stays open: speech can fill a visible draft, and any write uses a separate human approval boundary. No legal consent is inferred.
