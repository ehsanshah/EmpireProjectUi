# Phase 09 — Intake, plan DAG and human approval

Source delivery mapping: U5. Relevant reference sections: 2, 7.2, 10–11, 14.

## Entry and scope
Use the previous phase foundation through Phase 08. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Build Intake list/detail for ideas, objectives, links, ready files and voice refs; triage and clarifying questions lead to a versioned ExecutionPlan. Reuse contextual composer and source provenance.
Build Plan editor/review with task DAG, roles, dependencies, scope, cost/budget, tests, DoD, simulation and before/after diff. Show cycles, unknown costs, missing permissions and unready dependencies explicitly.
Implement human approval tied to plan hash/revision, source revisions, selected tasks, budget ceiling/currency/unit and policy revision. Editing materially relevant content invalidates the previous approval. Execution is a separate explicit command using approval_id.
Implement waiting_input, rejection and request_changes with resumable context. Do not automatically launch live agents when the UI merely draws a plan.

## Acceptance
Intake → plan → clarification → approval → execution request is traversable with honest Demo/Live evidence. Cycles and stale hashes block execution. Approval does not mark work Done. Reapproval after change is required by the adapter/engine policy.

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
