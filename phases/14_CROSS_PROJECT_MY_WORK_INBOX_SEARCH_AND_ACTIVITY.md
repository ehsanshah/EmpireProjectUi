# Phase 14 — Cross-project My Work, Inbox, search and activity

Source delivery mapping: U5/U6. Relevant reference sections: 1–2, 9–10, 12, 14.

## Entry and scope
Use the previous phase foundation through Phase 13. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete organization project directory, My Work, notification/decision/review Inbox, global authorized search and project/organization activity. Support read/snooze/respond with dedup/revision and context links. Poll organization Inbox where no org stream is available.
Compose these screens from the same resources and capabilities; do not create duplicate task stores. My Work includes assigned human/Agent context only if authorized. Search supports canonical IDs, semantic keys/aliases and safe ambiguity handling.
Implement deep-link return paths, responsive navigation, per-project state restoration, session expiry/logout and organization-switch cleanup. Audit views show actor/time/before-after/resource version/receipt with no secret or forbidden metadata.
Omnichannel threads may display authorized linked provider events only when a connector supplies them. Sending requires an explicit authorized action and provider receipt. No real email/Slack/WhatsApp send is part of this UI test phase.

## Acceptance
Inbox links open correct context; stale/revoked items reveal no metadata. My Work/search remain ACL-scoped. Project switch/Back/reload works across all completed views. Audit distinguishes pending request from committed change. Unsupported notification providers do not show successful delivery.

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
