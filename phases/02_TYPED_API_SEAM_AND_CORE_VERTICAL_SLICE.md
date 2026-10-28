# Phase 02 — Typed API seam and core vertical slice

Source delivery mapping: U0/U2. Relevant reference sections: 4, 8–14.

## Entry and scope
Use the previous phase foundation through Phase 01. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Build or reconcile a single typed client, domain adapters and strict Demo/Live boundary. Inspect real OpenAPI before deriving proposed contract slices. Generate/validate only the core OpenAPI/event subset needed now; mark proposed versus server-verified operations and record adapters/ADRs. Preserve the source endpoint semantics.
Implement session bootstrap, capabilities/schema, project creation with human Owner, project list, WorkItem list and drawer, one valid transition, receipt and activity/history. All interaction sources use the same command path. Create the project before adding memberships.
Use same-origin /api/ep/v1 and /api/session as the proposed boundary; actual topology must be reconciled. Add CSRF/session handling, opaque strong ETags, stable idempotency key per intent, Problem Details, 202 operation polling and unknown-outcome reconciliation. Do not PATCH status directly. Preserve drafts on 412.
Add scoped SSE adapter, dedup/version-gap handling and snapshot/reset flow using contract test fixtures. Connect real dev/staging only if available and authorized; otherwise complete the slice with schema-faithful Demo handlers and mark Live blocked. Do not implement the Go engine as a side effect.
Record the first contract and integration proof with exact commands and sample non-sensitive receipts.

## Acceptance
The slice is usable end to end in Demo. In Live it runs only against verified endpoints with no mock fallback. Double submit/timeout/retry has one intended effect, 412 retains the draft, and SSE does not declare command success. A Demo test pass is not reported as an engine integration pass.

## Mandatory delivery
Use templates/PHASE_REPORT_TEMPLATE.md and templates/UAT_TEMPLATE.md.
Run the phase's meaningful checks plus build/typecheck where source changes occur.
Report Demo, contract-fixture, real-staging and manual/browser evidence separately.
Update phase state, feature coverage, UIAPI mapping and endpoint mapping accurately.
Record source paths, commands, errors, screenshots if available, exact review steps,
unresolved inputs/owners and the next suggested delta. Do not fabricate receipts.
Stop at awaiting_ui_ux_review. Provide a runnable UI, exact review journey and
separate UI/UX review checklists. Wait for explicit user approval of BOTH before
starting the next phase. Follow UI_UX_REVIEW_GATE.md; tests do not replace review.
