# Phase 12 — Overview, evidence-based Reports and Releases

Source delivery mapping: U5. Relevant reference sections: 1–2, 6.4, 10, 14–15.

## Entry and scope
Use the previous phase foundation through Phase 11. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete role-relevant Overview and Attention with goal, blockers, pending decisions, Sprint/Release and budget only where data exists. Counts/actions open their actual worksets. Distinguish observation, interpretation and hypothesis.
Build natural-language reports with query plan/run, metric definitions, as-of, completeness, data table/chart and citations. Include Sprint/flow/WIP/aging/burndown and dependency information only when the required data is available. Dashboard widget preferences can compose existing reports; shared changes require permission. Do not fabricate historical trends or metrics from a fixture's current state.
Implement frozen-query export with current ACL and expiry. Build release scope/gates/environment, preview, approval and delivery status/receipt. Cover organization program-releases route using supported aggregation. Accepted artifact is not automatically shipped; delivery needs actual evidence.
Advanced WBS/critical-path/EVM or portfolio calculations need explicit engine contracts and valid inputs; expose capability boundaries and record extension gaps.

## Acceptance
Reports reconcile counts with a source snapshot and show unknown/partial truthfully. Export respects current access. Release gate failure retains actionable reasons. Delivery pending/failed does not show shipped. Overview routes users into evidence rather than decorative KPI boxes.

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
