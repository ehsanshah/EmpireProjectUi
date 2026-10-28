# Phase 11 — Gallery, Knowledge, citations and source lineage

Source delivery mapping: U5. Relevant reference sections: 7.3, 10, 12–14.

## Entry and scope
Use the previous phase foundation through Phase 10. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete Gallery cards/list/detail with draft/accepted/shipped distinctions, artifact type/version/hash, reviewer, preview and lineage. Resolve live preview only from valid authorized deployment metadata. Unsafe HTML must not execute on the session origin.
Build Knowledge source list/create, version history, decision documents, search and authorized citation viewer. Show source locator/version, freshness and unavailable/revoked source states. Structured numeric results come from QueryPlan, not RAG guesswork.
Implement fresh access-ticket acquisition and expiry recovery; explain signed-ticket revocation limits according to actual backend policy. Clear restricted cached content on permission change.
Add a bounded derived relationship graph if supported. Memory Galaxy and Obsidian integration are extension UI behind verified capability; document unavailable APIs instead of drawing a fake working integration.

## Acceptance
Gallery reflects review and release truth. Citation deep links open the right authorized version. Revoked source content is not leaked through snippets/counts/graph/export. Sandboxed artifacts cannot access application cookies. Optional graph/connectors are explicitly capability-gated.

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
