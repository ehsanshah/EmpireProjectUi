# Execute the next requested phase only

Read the repository instructions, empireproject-ui-delivery/PROJECT_RULES_EN.md,
PROJECT_STATE.json and the previous phase report. The user is requesting one
next phase, not an automatic run through the entire roadmap.

First read UI_UX_REVIEW_GATE.md. If the previous phase's UI or UX approval is
missing, finish any current-phase review preparation and present its runnable
result and review checklist. Do not start the next phase based on a bare “continue”.
Explain this stop is required by the user's explicit instruction to check UI/UX
at every phase. If the user requests revisions, execute REVISE_EN.md instead.
When both approvals exist, execute only the named next phase, or the first pending
phase whose frontend foundations exist. Record the actual approval message.

Read the selected phases/NN_*.md file, relevant reference sections and unresolved
contract decisions. Preserve working code. Implement, exercise and fix that phase
until its acceptance criteria are met or a concrete blocker remains. Missing Live
services do not prevent independent UI/Demo completion; keep evidence separate.

Update PROJECT_STATE.json, FEATURE_COVERAGE.csv, contracts/ENGINE_MAPPING.csv,
UIAPI_TRACEABILITY.csv and evidence/PHASE_NN_REPORT.md with real results.
Deliver a running URL if actually available, exact start commands, review steps,
source paths, actual tests, screenshots where possible and known blockers.
Stop at awaiting_ui_ux_review. Do not start the following phase automatically.
