# Engine integration backlog — post Phase 15 UI handoff

**Status 2026-10-28:** the final local Demo UI/UX is approved. The reference contract (`reference/EmpireProject_UI_Engine_API_Contract_FA_v1.0.md`), `contracts/PHASE02_PROPOSED_OPENAPI.json` and all 48 `contracts/ENGINE_MAPPING.csv` entries are **proposals**, not verified Engine operations. No authorized staging integration, server authorization test or production deployment has occurred. `src/core/httpClient.ts` must remain fail-closed for Live until reconciliation; Demo responses must never substitute for Live responses.

## P0 — proposed first integration slice

Use one authorized non-production organization and project, independent server fixtures and a same-origin BFF. The order below is the intended vertical slice, not a claim that these APIs exist. Backend/Engine supplies actual operation IDs, paths, schemas and examples before client binding.

| Step | Required backend and policy input | Acceptance test against real staging |
|---|---|---|
| 1. Session | BFF cookie/session bootstrap, org scope, expiry/logout, CSRF/Origin rules, identity and effective permission/capability revisions. Reconcile proposed `GET /api/session`. | Authorized and expired sessions have distinct results; logout clears scoped state; a forbidden project is absent and cannot be fetched by guessed ID. No token is exposed in browser assets. |
| 2. Project | Authorized project directory/detail, stable canonical IDs and aliases, membership and permission lineage, project-switch semantics. | The fixture project appears exactly once; restricted project is absent; switching org/project invalidates prior selection, cache and stream; late responses cannot repopulate the old scope. |
| 3. Issue list | Workset query/filter/sort/cursor schema, total and completeness metadata, permission-scoped counts, ETag or revision, stable issue keys. | Independent seeded records reconcile to the displayed total across pages and filters; no count is derived only from the loaded page; denied records/snippets never appear. |
| 4. Drawer | Authorized WorkItem detail, schema/custom fields, allowed transitions/actions, activity revision and not-found/forbidden distinction. | Opening a key preserves list context and Back; detail matches list revision; denied detail exposes no content or relationship metadata. |
| 5. Transition | Actual transition preview/write contract, required fields, workflow/WIP policy scope, `If-Match`/version, CSRF, permission revision, idempotency retention and conflict payload. | Required fields and policy rejection leave the source unchanged; stale version preserves the user's draft; one valid transition creates one logical effect even with duplicate submission. |
| 6. Receipt and activity | Committed receipt schema, resource version, actor/time, before/after data policy, `202` operation status and lookup by idempotency key for unknown outcomes. | Only a committed receipt shows success; queued/pending remains pending; retry or recovery after timeout resolves to the same effect and receipt; activity reconciles with the authoritative resource. |
| 7. Scoped updates | Project-scoped event schema, event IDs/replay cursor, reset semantics, permission-change events, reconnect bounds and polling fallback if streams unavailable. | Event replay has no duplicate logical effect; stream reset triggers authorized snapshot; revoked grants close the stream and clear affected cache; old-scope events cannot mutate the new project. |

**Entry inputs/owners:** Backend/Engine: current OpenAPI/AsyncAPI or equivalent, schema versions, operation IDs, error/receipt/operation examples and idempotency rules. IAM/Security: BFF/session/CSRF design, least-privilege test identities, grant/revocation fixtures and redaction policy. DevOps: reachable non-production URL, same-origin routing, CSP/preview origins and isolated test data. QA/Product: independent expected workset/transition fixtures and sign-off criteria. These inputs are currently unavailable or unverified.

**Exit gate:** contract tests and the seven staging journeys above pass with real non-production responses and independent expected results; Demo/Live separation is inspected; failures, permission loss and unknown outcomes are exercised. Until then, the P0 slice is **blocked**.

## Remaining contract and capability backlog

| Priority | Gap and affected UI | Required input and acceptance test | Owner |
|---|---|---|---|
| P1 | WorkItem schema, bulk, Board settings/WIP/rank/dependency and Sprint lifecycle | Versioned schema and migration/preview contracts; test mapping, full-scope WIP, rank anchors, per-item bulk results, lifecycle and active-Run protection against server fixtures. | Backend/Engine, Product |
| P1 | Timed Calendar/Timeline scheduling (CD-03) | Separate `ScheduleBlock` schema/endpoints, date-only vs timed semantics, timezone/DST and overlap rules; verify move/resize never silently changes deadlines. | Backend/Scheduling, Product |
| P1 | Storage, malware scan, import/DataCart and Knowledge access | Upload/download tickets, checksum/scan state, parse/mapping/commit recovery, source-version access and revocation contract; test unsafe files, partial import and fresh tickets. | Storage, Import, Knowledge, Security |
| P1 | Agent readiness, Run, independent Review, Gallery | Membership/grant/probe policy, approved-plan references, attempts, artifacts, review decisions and receipt/event schemas; verify self-approval denial, revisions and no implied shipping. | Agent platform, IAM, Backend |
| P2 | AI clarification, proposals and real voice (CD-07) | Typed output/continuation/proposal schemas, provider and consent policy, authorized transcription and provenance; test stale clarification, proposal expiry and microphone cleanup with a real configured provider. | AI/Voice, IAM, Product |
| P2 | Reports, exports and release delivery | Historical event/snapshot source, metric units/completeness, frozen-query export ticket, release gates and delivery receipt; reconcile chart/table/drill-down and distinguish accepted, queued and shipped. | Reporting, Release, Backend |
| P2 | Organization directory, My Work, Inbox, search, activity, People/settings | Authorized cross-project aggregation, event or polling cadence, membership and policy revision, settings publication/migration and redacted search; test org switch, revoked grants and stale responses. | Organization service, IAM, Backend |
| Gated | External channels, Google Sheets, SSO/SCIM, Memory Galaxy/Obsidian, WBS/critical path/EVM/portfolio (CD-08) | Explicit capability contracts, configured authorized services and test data before enabling. No Demo simulation counts as Live evidence. | Relevant service owner, Product |

## Cross-cutting decisions and validation

- Reconcile CD-01 through CD-08 in `CONTRACT_DECISIONS.md`. CD-03, CD-05 (missing referenced adversarial plan v1.4 and Spec v2.5), CD-07 and CD-08 remain material gaps. Do not edit the reference contract to hide a mismatch.
- `UIAPI_TRACEABILITY.csv`, `FEATURE_COVERAGE.csv`, `contracts/ENGINE_MAPPING.csv` and the Phase 15 evidence matrices are the row-level traceability inventory. Mark a row Live-verified only with a real contract, environment, test identity and observed result. Demo tests establish UI behavior only.
- Before any Live enablement: test 401/403/409/412/429/503, bounded retries, idempotency replay, `202` operation recovery, stream replay/reset, session expiry, permission revocation, stale approval and cross-project data isolation. Verify accessibility and performance with actual devices, assistive technology and production-like non-production data; do not infer them from local synthetic fixtures.
- Use scoped access tickets for protected files and exports, and ensure CSP/sandbox policy blocks untrusted HTML/SVG from executing on the application origin. Previously issued signed-URL revocation depends on the real storage mechanism and must be tested rather than assumed.

**Current gates:** Demo UI/UX **approved**; Engine contract readiness **blocked**; Live integration **blocked/not run**; production readiness **blocked**. No backend implementation, external Agent dispatch or deployment is authorized by this handoff.
