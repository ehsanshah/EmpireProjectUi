# Phase 10 — Agent readiness, Runs and independent Reviews

Source delivery mapping: U5. Relevant reference sections: 1, 4, 7.2, 10–12, 14.

## Entry and scope
Use the previous phase foundation through Phase 09. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete Agent membership, capability and connection readiness including MCP/API-backed connection metadata, available tools and actual probe results. Configured/connected/authorized/ready are distinct. Never expose credentials or interpret a configured connector as a passed probe.
Implement human/Agent assignment with approved brief, dependencies and plan reference. Build Run list/detail: attempt, checkpoint, progress, waiting_input, blocker, cost/unit, events, artifacts and explicit pause/cancel/resume controls for that Run. ACK, running, submitted, accepted and shipped are distinct.
Build Review Inbox/detail with artifact version/diff, test evidence, DoD and independent decisions by an authorized Lead/Reviewer/SM. Producer cannot accept their own output. Request changes creates a new revision/attempt as appropriate; report status accurately in Board and drawer.
Handle cancellation requested versus acknowledged, execution timeout/unknown, reconnect and persisted server jobs. Revalidate changed plans, grants or budgets before continuing.

## Acceptance
A simulated end-to-end Run can submit evidence, be rejected and resubmitted, then independently accepted. No self-approval, premature Done/Shipped or forged readiness. Live agent dispatch requires real endpoints and approval. Network disconnect does not cancel an engine job.

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
