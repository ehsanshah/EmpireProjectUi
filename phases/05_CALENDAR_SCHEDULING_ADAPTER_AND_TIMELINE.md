# Phase 05 — Calendar, scheduling adapter and Timeline

Source delivery mapping: U3. Relevant reference sections: 5, 9.4, 10, 14.

## Entry and scope
Use the previous phase foundation through Phase 04. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Consolidate Calendar Day/Week/Month and Timeline using the shared workset. Apply the calendar video behaviors: pinned headers/all-day row, now line, duration height, stripe/tint, overlap subcolumns, drag-to-select, move/resize with snap and keyboard/form alternatives.
First implement the source contract's date-based due/start projections and explicit rendered/unscheduled/outside-window counts. Preserve date-only semantics, timezone/DST, working calendars and Persian/Gregorian display. Window is display state unless explicitly promoted into the query.
Keep deadline, planned start/due range, timed schedule block, effort estimate and worklog separate. Hourly scheduling and scheduling multiple blocks are an extension gap: record schema/endpoints/owner in CONTRACT_DECISIONS.md and ENGINE_MAPPING. Implement an explicit Demo ScheduleBlock adapter for interaction review; Live scheduling is disabled with reason until its engine contract is agreed. Never silently write a moved work block into the deadline.
Timeline has proper bars/markers/dependencies and an unscheduled section; do not label a simple timeline a critical-path engine. Preserve drawer context and Back. Add date/timezone/calendar edit previews and receipts through the shared client.

## Acceptance
Same query explains all counts across views. Three overlapping blocks stay selectable. Moving a timed Demo block preserves duration and deadline. Due-only dates never become invented midnight appointments. All-day row remains pinned; DST/overnight cases work; unavailable Live scheduling never reports a successful save.

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
