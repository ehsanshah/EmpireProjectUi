# Phase 01 — Consolidate design system, shell and project switching

Source delivery mapping: U1. Relevant reference sections: 1–4, 14.

## Entry and scope
Use the previous phase foundation through Phase 00. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Preserve usable existing composition and audited interactions. Consolidate shared blue/Slate tokens, visible restrained glass chrome, opaque readable data surfaces, English/LTR default and Persian/RTL, light/dark, fonts, responsive shell, keyboard/focus and reduced motion. Replace rejected hero/KPI-heavy patterns only where still present; do not repaint every screen gratuitously.
Consolidate project switcher, organization context, route structure, search, recent/pinned projects and restore valid per-project views. Implement the reference resizer behaviors in REFERENCE_INTERACTIONS.md. Retain an intentional compact icon rail when the panel is closed.
Keep role lenses distinct from permissions. Compose the default navigation from capability flags: Project, Work, Backlog, Inbox, Agents, Knowledge, More; avoid dead destinations. Implement manual navigation and contextual AI entry points across the shell. Inventory missing views for later phases rather than building empty placeholders.
Create or update the route/role matrix and reusable component inventory. Provide actual screenshots of the current UI in both themes and directions if browser access exists.

## Acceptance
Project switching changes actual project data and assistant context, cancels/ignores stale responses, and preserves scoped drafts safely. Resize clamps/snaps/persists preferences and releases overlays. At 390/768/1440 widths, essential actions and focus are usable. Blue identity survives; provisional teal in the API document is not applied as a redesign mandate.

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

## New screenshot interaction — include in this phase
Implement the reusable clarification card from AI_CLARIFICATION_UX_EN.md in the
actual contextual composer. Include a clearly labeled deterministic preview of
numbered options, Other, direct answer and required/optional Skip behavior.
This is a real interactive UI for immediate user review; engine continuation is
wired in Phase 07. Do not claim the preview has real AI decision-making.
