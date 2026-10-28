# Phase 13 — People, organization administration and versioned Settings

Source delivery mapping: U5/U6. Relevant reference sections: 2, 4, 9–10, 14, 18.

## Entry and scope
Use the previous phase foundation through Phase 12. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Complete Human/Agent/Group membership, role bindings, effective grants/lineage, allowed actions and grant revisions. Project template setup cannot clone credentials or grants. Implement controlled archive/restore and permission-change consequences.
Build modular Settings: issue types/hierarchy, fields/custom_data, priorities, workflow versions/transitions, working calendar/timezone, board mappings/WIP, project templates, connections, model/voice policies, notification preferences and available organization controls.
Build workflow draft/validate/publish/migration preview. Explain required mappings and active Run implications; retain versioned approvals. Connections expose health/capabilities/probes with credential refs only. Provide API/MCP integration setup UI under capabilities.
SSO/SCIM, retention/residency, quotas, organization billing and provider-specific configuration require actual capability and contracts; record unsupported surfaces as gaps, never pretend a toggle enables a backend service. Respect member visibility and independent authorization.

## Acceptance
Role lens does not grant authority. Workflow publication/migration is versioned and blocked on invalid mappings. Existing Runs are not silently migrated. Secret fields never echo stored credentials. Revoking access purges restricted views and streams. Administrative writes use the common command/receipt path.

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
