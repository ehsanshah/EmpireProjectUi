# Phase 03 — Complete WorkItem, List, forms and scoped search

Source delivery mapping: U3. Relevant reference sections: 2, 4–5, 9–10, 14.

## Entry and scope
Use the previous phase foundation through Phase 02. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete schema-driven work item forms, full-page and drawer routes, issue types/hierarchy, priority, labels/components, human/Agent assignment, dates, estimates/units and custom_data. Preserve unknown/migrated custom fields and use server IDs/schema revisions. Add comments, files entry points, activity, links and worklogs with allowed actions; upload transport is delivered in phase 08.
Implement quick create/edit, configurable columns, stable sort/group, cursor pagination/virtualization and saved personal/shared views under capabilities. Selection must distinguish visible IDs from server snapshot selection tokens. Add bulk preview and per-item results without silently targeting unseen data.
Implement allowed moves/clones/archive/restore through preview/versioned commands. Archive is not destructive delete and restore cannot restore obsolete grants. Search/semantic-key resolution must use authorized identities and canonical IDs.
Wire the shared workset/query state used by all subsequent views. Render unknown/estimated totals correctly instead of counting loaded rows as total. Preserve deep links and drawer Back/Forward.

## Acceptance
Create/edit/transition/partial bulk and conflict recovery work. Forbidden actions expose no sensitive metadata. Custom-field validation preserves drafts. Cursor expiry retains query and restarts safely. A drawer deep link survives refresh and closes to the correct underlying view.

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
