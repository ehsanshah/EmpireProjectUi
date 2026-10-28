# Phase 04 — Board, Kanban behavior and dependency Work Flow

Source delivery mapping: U3. Relevant reference sections: 4–5, 9–10, 14.

## Entry and scope
Use the previous phase foundation through Phase 03. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete the audited Board using workflow mappings, shared query and swimlanes. Keep an unmapped-status tray, count reconciliation, aging/blocker and explicit WIP policy. Implement the five Kanban reference behaviors, including true-height placeholders, lifted preview, WIP rejection, intentional column collapse and one board with multiple lanes.
All drags and keyboard/menu equivalents request a permitted transition, required fields, versioned command and receipt; handle 409/412 and rollback. Reorder uses rank anchors/revision, not alphabetic priority or arbitrary filtered index.
Implement/complete the dependency Work Flow projection described in REFERENCE_INTERACTIONS.md, including valid edges, two converging paths, selected-node drawer, blocker explanation, pan/zoom/fit and accessibility. Readiness derives from authorized dependencies; hidden dependencies remain redacted. Do not auto-change business status when a dependency finishes unless the engine explicitly implements that rule.
Support explicit WIP policy scope across swimlanes, collapsed-column recovery, resettable fixtures and authoritative Live counts.

## Acceptance
WIP violations are rejected in every interaction path. Filters do not undercount WIP; pending/rejected transitions remain honest. Four-node flow renders correct edges and shows blocked versus ready without claiming accepted/shipped. Board workset equals rendered plus unmapped.

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
