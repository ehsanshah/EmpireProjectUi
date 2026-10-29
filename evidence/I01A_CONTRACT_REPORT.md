# I01-A contract reconciliation report — 2026-10-29

## Scope and status

**Contract drafting:** complete for the I01 browser-to-Engine slice. **Approved Demo UI:** unchanged. **BFF implementation:** not started. **Live integration:** BLOCKED / NOT RUN. **Production readiness:** BLOCKED. This report is the submitted I01-A review artifact under the user's stated approval rule; it does not approve or verify Live behavior.

Delivered:

- `contracts/BFF_I01_PROPOSED.openapi.yaml` — OpenAPI 3.1, every browser operation labeled proposed and every local Engine operation labeled with its source status.
- `contracts/I01_EVENT_MAPPING.json` — machine-readable Engine SSE-to-UI metadata mapping, replay and revocation actions.
- `contracts/I01_ENGINE_BROWSER_MAPPING.md` — actual Engine operation/schema → browser contract → typed UI mapping for all seven steps, with the exact next slice.
- `contracts/validate_i01_contracts.rb` — structural and mapping checks, plus optional local Engine OpenAPI shape checks.
- `src/core/httpClient.ts` — removed fixed `sprint-12` Live key search and incompatible Live transition resource/receipt casts; both now fail closed pending real contracts. Demo adapter and appearance are unchanged.

## Inspected sources and revision

- Frontend checkout at start: clean `main`, `ca1ebefd8348644b62d6218688ea42bb6079b51f`; read `INTEGRATION_I01_PLAN.md`, `ENGINE_INTEGRATION_BACKLOG.md`, `src/core/{contracts,httpClient,demoClient,eventReducer}.ts`, and the prior proposed contract tests.
- Sibling Engine checkout: clean `main`, **`96776c8ef8f444c6a3872e2f592c56363c66f004`**. The earlier `957e346...` inventory is superseded. Read its `CLAUDE.md`, `services/{project-access,work-core}/*/routes.go`, work-core `sse.go`, transition implementation, current OpenAPI, Spec v2.5, adversarial plan v1.4 and backend API compatibility evidence. `scripts/verify-sources.sh` was inspected but not run because it writes `docs/source-manifest.json` in the sibling checkout; read-only SHA-256 verification was performed instead.
- SHA-256: `project-access.v1.yaml` `085e827e8626dc3c0b1f3b5b4a09fbb37ac11de46ae4941472079db6761b73c3`; `work-core.v1.yaml` `8c2af3110ca44176a06966bcfa744003d26d68ab6f7f41ebee41b6bfbdd30686`; Spec v2.5 `9d9d152b1fa5bce0a360fe234a3865921d7dc93ae97927c535fe231bec4caf94`; adversarial plan v1.4 `a1eb19edc6ea6b824d5bdb9a0d2a2a1e7b3e5a1cf24ee70850f9ea4c1c4342b5`.
- Relevant product rules: Spec `IAM-012`, `WI-001/002/016`, `WF-001/002/011`, plus authorization/idempotency and reference-only event payload principles. Test oracles: adversarial `DOM-01`, `DOM-08`, `RES-06`, `VIEW-01/02/06/08`, `SCL-03`. Their prior absence claim (CD-05) was corrected in `CONTRACT_DECISIONS.md` and removed from the unresolved list in `PROJECT_STATE.json`. Historical Phase 15 report was left as a dated historical report.

## Actual reconciliation findings

| Step | Local Engine contract | Browser gap / disposition |
|---|---|---|
| Session/logout | No browser session, logout, real identity exchange or CSRF/Origin BFF route found. Engine service bearer is dev-only. | Same-origin cookie BFF proposed only. IAM must choose provider, session binding, logout, token exchange and CSRF policy. Never expose service bearer to browser. |
| Project/capabilities | `listProjects`, `getProject` and `Project` with allowed_actions and permission_revision exist locally. | BFF route and capability source absent. Existing UI project presentation type omits authoritative membership, method, timezone and revision; map rather than cast. |
| Workset | `listWorkItems` exact count; `queryView` typed QueryNode, snapshot counts, cursor, watermark and snapshot_changed. | UI `/work-items/search` payload/path do not match. Free text, `remaining`, `blocked`, arbitrary grouping and archive controls lack a verified query mapping. Count must use Engine workset metadata, not loaded rows. |
| Detail/key | `getWorkItem` uses ID; `listAvailableTransitions` exists but has no screen schema. | The previously proposed Live `resolveWorkItemKey` fixed `sprint-12` lookup was removed in I01-A; it now fails closed. Authorized key/alias resolver is missing. UI `source: Issue` and transition IDs are not present on Engine item. |
| Transition | Engine strict body `{transition_id, reason?}`, `If-Match`, `Idempotency-Key`; 200 resource+receipt. | The previously proposed Live method sent `fields`, which Engine rejects, and cast incompatible objects. It now fails closed. Required-field schema/atomic field-bearing command absent. Nonempty fields/required screen fail closed; no 202 branch. Preserve draft on 409/412/422. |
| Receipt/activity/recovery | `Receipt`, `workItemHistory`, `wcCommandByKey` exist locally. | UI expects flattened activity and bare receipt/null recovery, while Engine sends HistoryEntry and stored `{route,status,response}`. Route/project/status must be checked; `audit_ref` linkage needs non-production proof. No operations endpoint. |
| Scoped updates | `projectEventStream` with metadata-only frames, opaque SSE cursor and reset/revoke/unavailable controls exists locally. | UI event names/casing differ and no BFF session proxy exists. Mapping, cursor replay, permission revision purge, stream close and bounded retry proposed. Events are invalidation, not receipts. |

The OpenAPI draft preserves Engine required fields in WorkItem and Project projections and includes `ViewRow` and workset metadata. Some Engine nested data (`dependencies`, `resolved_windows`, custom values) remains opaque in the proposed browser schema pending a full BFF schema publication; the BFF must pass authorized data through without unreviewed normalization or silent deletion. UI types must be extended where Engine semantics cannot fit.

## Verification actually performed

1. `ruby contracts/validate_i01_contracts.rb /Users/ehsanshahbakhti/GolandProjects/EmpireProject` — **PASS**: proposed status/security/CSRF/Origin/path checks, no false key resolver or 202 claim, transition-field fail-closed declaration, synthetic event field/type/revocation/cursor mapping, and local Engine operation/body/SSE shape checks against the current checkout. This is a **local contract test**, not a server request.
2. `shasum -a 256` on the four Engine sources — **PASS**: hashes recorded above, at the verified checkout revision.
3. `npm run typecheck` — **PASS**; `npm test` — **PASS, 26 files / 125 tests**; `npm run build` — **PASS**. Vite reports an existing large chunk warning; no new UI bundle dependency was added. `git diff --check` and JSON syntax checks — **PASS**.
4. No BFF server, authorized staging endpoint, real identity, cookie session or Engine test principal was provided. **Real non-production integration tests: NOT RUN.** Backend's prior PostgreSQL reports are background evidence only and were not rerun or claimed as I01 verification.

## Decisions and remaining inputs

**Critical path:** IAM/Security real identity/session choice, BFF-to-Engine credential exchange, secure cookie/CSRF/Origin/logout and authorized test principals; Backend/Engine key/alias resolver and versioned required-field transition screen plus atomic field-bearing command; Backend/Product exact support or capability-gated unavailability for UI search/group/blocked/remaining controls; DevOps same-origin non-production BFF and Engine routing with isolated fixtures. Also supply redacted session/project/query/detail/transition/receipt/history/by-key/SSE examples, error shapes, permission revision semantics and release-tested CORS/CSP behavior.

**Next implementation slice, separately authorized:** (1) same-origin session/logout and authorized project/capability bootstrap; (2) typed workset query and detail/key mapping; (3) field-safe validated transition with receipt/history/by-key recovery; (4) scoped SSE proxy and reducer cleanup. Run independent expected-value tests at each step, including 401/403/409/412/422/428/503, duplicate key, stale version, denied project, revoked access, cursor reset and cross-scope late response. Keep Live disabled until this complete path passes actual staging tests. Do not implement a parallel backend.
