# Phase 06 — Backlog, Sprint and capacity planning

Source delivery mapping: U3. Relevant reference sections: 4–5, 10, 14.

## Entry and scope
Use the previous phase foundation through Phase 05. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete Epic/Issue tree, rank, parent/subtask handling, planned Sprint areas and active Sprint workspace. Add goal, baseline, commitment, capacity/unit, scope changes, DoD and deferred reasons.
Implement server actions and previews for start/complete/reopen/scope change. Incomplete work at completion needs explicit disposition under engine policy. Do not infer delivery from closed issues or point totals.
Implement sprint-fit simulation presentation for fits/does_not_fit/fit_unknown, including graph/capacity snapshot refs and unavailable estimates. Avoid double-counting parent and child effort. Estimation and capacity are not auto-filled as facts by AI.
Render sprint reports with metric definitions, baseline and scope changes. Respect Scrum Master/Lead role capabilities rather than hard-coding unlimited administration.

## Acceptance
Lifecycle actions return receipt/operation or honest blockers. Unknown capacity stays unknown. Scope changes preserve baseline visibility. Parent/child double-counting and version conflicts are tested. Sprint goal attainment is not fabricated from completed points.

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
