# Phase 09 contract decision — Intake and ExecutionPlan

Status: Demo adapter implemented; Live contract unreconciled. This document proposes no verified Engine endpoint.

The source contract advertises `GET/POST P/intakes`, `GET P/intakes/{id}`, `POST .../plans`, `GET/PATCH P/plans/{id}`, and `POST .../{simulations|approvals|executions}` (sections 10 and 11.3). The actual OpenAPI, schemas, ETag examples, operation/receipt envelopes, permission policy, source revision rules, and staging environment have not been supplied.

The local Demo adapter is mounted on the existing `DemoCoreClient` as `intakePlan`. It validates version preconditions and idempotency keys, simulates typed receipts, and persists only in a local Demo namespace. Its plan hash is a deterministic Demo fingerprint plus an explicit revision and ETag; it is not a server signature or security boundary. The approval records the plan revision/hash, selected task IDs, source revisions, budget ceiling/currency/unit, explicit unknown-budget acknowledgment, policy revision, expiry, and a Demo receipt. A subsequent material plan edit changes the revision/hash and invalidates the approval. A separate request using `approval_id` returns `simulated_accepted` with a Demo receipt; it creates no Run, agent assignment, review, completed work, or release state.

A ready-file reference may bind to the latest Phase 08 local Demo scan-ready DataCart and then requires a scope answer; this is still a simulated scan, not verified malware scanning. Voice references remain unresolved until an authorized transcript exists. Typing a reference cannot assert readiness. Live mode has no fallback to this adapter. Real agent execution requires reconciled membership/capability, authorization, approval, and execution contracts; none was dispatched.

## Inputs to reconcile

| Owner | Needed input | Exit evidence |
|---|---|---|
| Backend | OpenAPI and examples for Intake, plan DAG, simulation, version/hash, approval, execution operation and receipt | Contract fixture and authenticated staging tests |
| IAM/Backend | BFF session, CSRF, plan/approval/execute permissions and policy revision semantics | Allowed and denied staging identities |
| Agent platform | Actual membership, capability probe and Run creation behavior | A nonproduction request with operation/Run evidence |
| Storage/Speech | Authorized ready-file and verified transcript refs with source revisions | Source link/deny/revoke tests |
| DevOps | Nonproduction URL and access | Reachable staging environment |

Do not map the local Demo receipt to a real audit record. Do not infer a cost, identity, task outcome, or execution from a plan approval.
