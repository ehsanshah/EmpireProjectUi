# Phase 15 — Live reconciliation, hardening and final UI acceptance

Source delivery mapping: U6. Relevant reference sections: 8–18.

## Entry and scope
Use the previous phase foundation through Phase 14. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Reconcile every proposed endpoint/schema with actual backend operations and record all differences. Expand generated client/event schemas only for implemented surfaces. Resolve remaining contract gaps with owners/ADRs; never silently redefine the engine. Connect available non-production staging services and run real integration tests for auth/CSRF/ETag/idempotency/operations/SSE/uploads/AI/voice/Agents.
Execute UIAPI-01 through UIAPI-20 and the available adversarial plan, with separate Demo, mocked contract, real staging, browser and manual UAT evidence. Do not report server security as proven by browser mocks. Test no gaps in snapshot/replay, revoke cleanup, partial jobs, unknown outcomes and malicious previews.
Run focused performance/scalability, access control, accessibility, locale/timezone/DST, mobile and visual checks. Use cursor/window/virtualization and bounded fixtures rather than loading million-object datasets into the browser. Measure against declared environment and budgets; no unsupported production RPS claims.
Deliver Dockerfile and UI-only deployment configuration, health route if appropriate, .env.example without secrets, CSP/session topology notes, redacted telemetry, startup/build/test commands, route/capability matrix, contract mapping, known gaps and UAT checklist. Do not deploy production or add EKS/Go-service infrastructure as part of this UI completion.
Issue a final completion matrix and release recommendation. If engine access is absent, label UI demonstration ready and Live integration blocked, not production complete.

## Acceptance
Every planned UI feature is implemented, explicitly capability-blocked or recorded with an owner and unresolved acceptance status. No S0/S1 issue is waived silently. User UAT and backend readiness are separate gates. Production-ready is never claimed from Demo tests. All reported passes link to evidence.

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
