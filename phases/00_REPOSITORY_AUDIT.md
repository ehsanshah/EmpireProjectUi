# Phase 00 — Repository audit and executable baseline

Source delivery mapping: U0. Relevant reference sections: 0–2, 8, 16–18.

## Entry and scope
No prior phase; inspect the actual repository.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Inspect the actual frontend repository, instruction hierarchy, branch, dirty tree, package manager, lockfile, framework, route tree, tests and run commands. Read the attached reference in full once and record a short indexed summary; later phases should read only relevant sections and deltas. Search this repository for Spec v2.5, adversarial plan v1.4, real OpenAPI/event schemas, BFF and current backend configuration. Record missing references without inventing their content.
Inventory every current screen, adapter and behavior as verified-working / partial / absent / incompatible / unverified, with source paths and evidence. Specifically inspect project switching, List, Board, Calendar, Timeline, Work Flow, contextual AI and Voice-to-Form. Earlier chat prompts are requirements, not proof of implementation or acceptance.
Run the existing app and its current build/typecheck and relevant baseline checks. Record actual failures before changing them. Fix only launch-blocking reversible setup problems needed to produce a reviewable baseline. Do not redesign everything in this phase.
Produce evidence/REPOSITORY_AUDIT.md, evidence/BASELINE_REPORT.md, contracts/ENGINE_MAPPING.csv from its template, and evidence/NEXT_PHASE_PLAN.md. Fill concrete run commands and implementation paths into PROJECT_STATE.json. Identify live integration blockers while allowing UI work to continue.

## Acceptance
A reviewer can start the current app using the documented commands. Each claimed existing feature has a path and verification status. Source absence or environment limitations are explicitly recorded. No user code or instruction file is overwritten. The next implementation phase is named and its changes are concrete.

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
