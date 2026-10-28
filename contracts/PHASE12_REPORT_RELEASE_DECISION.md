# Phase 12 — report, export and release contract decision

Date: 2026-10-28. Status: **Demo implementation; Live contract unverified**.

The supplied Engine reference sections 1–2, 6.4, 10 and 14–15 propose project reports (`POST/GET P/reports/{type}/runs`), exports (`POST/GET P/exports`), and release scope, preview, approval and delivery routes (`GET/POST P/releases`, `GET/PATCH P/releases/{id}`, `POST .../{previews|approvals|deliveries}`). These are design inputs, not reconciled wire contracts. No OpenAPI response examples, event schemas, staging URL, auth session, permission matrix, export ticket policy, delivery receipt evidence or release gate policy were available. `HttpCoreClient` therefore remains fail-closed in Live mode. Phase 12 adds no claimed Live endpoint.

`DemoPhase12Adapter` is mounted on `DemoCoreClient` as a local, explicitly labeled seam. Flow reports count current WorkItem statuses in a frozen project/Sprint/filter snapshot. Sprint reports count completed, remaining and cancelled issues from that same query; completed points use leaf estimates and remain unknown where estimates are missing or in a different unit. No historical burndown, cycle/lead time, aging, throughput trend, Sprint Goal achievement or delivery metric is inferred from current records. Rows, chart and issue citations share one query and source versions. An in-memory Demo CSV ticket freezes that report and checks current project, permission revision, query versions and expiry on read. This is not server ACL or secure export transport.

A Demo release stores explicit issue and Phase 10 artifact IDs, a fixed Demo preview environment, versioned scope and independent review evidence. Gates require accessible completed scope, no recorded blockers, completed dependencies, latest accepted artifact revision linked to a scoped issue, and a current approved plan. Preview binds issue, artifact, plan and policy fingerprints to a short expiry. Human approval is separate from delivery request. A delivery request creates a queued operation only; a separate deterministic reconciliation yields a simulated failure or a Demo receipt. Gallery projects `simulated_shipped` only from a succeeded operation with an applied receipt. This is not deployment or external delivery. Approval and pending/failed operations never imply shipping.

The Demo policy fingerprint includes the core permission revision and independent review policy revision. A changed scope, issue version, latest artifact revision, plan hash/approval, policy revision or expired approval blocks delivery. Idempotency keys and version checks guard commands within the local adapter; a queued request replays safely after reload by its intent key. Release drafts are persisted in a `local-demo` browser namespace. Unknown/failed operation state can be re-read after reload. No server command retention or external side effect is claimed.

Organization program releases, shared dashboard widgets, WBS, critical path, EVM and portfolio metrics remain capability-gated. Their required authorized aggregation, dependency, cost and policy contracts are unavailable. Current WIP is already handled by the Board, but this phase does not claim a historical WIP report without a complete event history or a report snapshot contract.

## Live exit inputs

| Owner | Needed evidence |
|---|---|
| Backend / Reporting | Reconciled report run schemas, metric definitions, source snapshot/citation identities, completeness and freshness semantics, operation/event examples. |
| Backend / Export / Security | Frozen-query export schema, current ACL recheck, access-ticket/download expiry and revocation policy, signed URL behavior, authorized test principals. |
| Release service / Product | Release gate policy, environment authority, version/approval binding, delivery operation status and valid shipped receipt semantics. |
| IAM / DevOps | BFF session/CSRF, permission revisions and roles, staging URL, network reachability and test identities. |
| Organization service | Authorized program release aggregation, hidden-count behavior and cross-project permission tests. |
| PM analytics | Valid cost, effort, dependency and history inputs plus explicit WBS/critical-path/EVM/portfolio calculation contracts. |

Prior Phase 07–11 speech, storage, scan, import, indexing, Agent, review and artifact-access Live blockers remain open. No Demo test closes them.
