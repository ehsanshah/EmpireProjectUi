# Phase 08 — File transport, DataCart and import recovery

Source delivery mapping: U4. Relevant reference sections: 7.1, 10, 13–15.

## Entry and scope
Use the previous phase foundation through Phase 07. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete upload-ticket flow, progress/cancel, completion checksum and scan state; bytes only to authorized upload hosts with ticket-specific headers, never app session credentials. Downloads use fresh scoped access tickets. Sanitize/sandbox previews.
Implement the DataCart state machine and resumable deep links: Uploaded → Scanning → Parsing → Mapping → Needs input → Validated → Preview → Approved → Committing → Completed/Partial/Failed. Reflect server states, not animation timers in Live.
Build source/row grid, field mapping, questions anchored to rows, type/priority/label proposals, duplicate detection, source locators and backlog-draft graph. Support CSV/XLSX/text/PDF only when capability exists; Sheets must use a configured connection. CSS is content/source only unless an explicit import contract supports it; do not interpret a stylesheet as task rows.
Implement revision-bound validation/approval/commit, row receipts and targeted retry. Preserve source-row uniqueness across retries and reloads. Scan-pending files cannot enter parsing/RAG prematurely. Recover unknown commit outcomes before issuing a new intent.

## Acceptance
Checksum/MIME/scan failures are actionable and never bypassed. Partial import shows created/updated/skipped/failed per row, and retry produces no duplicates. Reload resumes the actual job. Malicious HTML preview and imported instructions cannot execute trusted actions.

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
