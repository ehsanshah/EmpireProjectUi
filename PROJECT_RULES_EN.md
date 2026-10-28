# Shared execution rules — read before every phase

## Authority and scope
The latest user request authorizes completion of the ENTIRE UI in explicit phases,
building on existing work. Earlier prototype-only instructions are superseded for
the phase the user has now requested. Do not delete or rewrite old instruction
files to force this outcome: record the conflict and follow the user's newer scope.
Implement one requested phase per run and deliver concrete evidence. The user
clarified on 2026-10-28 that each **submitted phase-completion report** constitutes
their UI and UX approval for its **reported Demo scope**; they communicate
rejections directly during implementation. Phases 00–15 have been approved on
that basis. An internal draft, screenshot view, test pass, silence or bare
“continue” does not create approval. A report's approval does not authorize the
next phase by itself. Read UI_UX_REVIEW_GATE.md for the current rule and scope.

Read UI_UX_REVIEW_GATE.md and AI_CLARIFICATION_UX_EN.md.
Read the repository's applicable instructions. Read this pack's current state,
requested phase, CONTRACT_DECISIONS and relevant source sections. The attached
reference defines engine/transport semantics; this pack defines sequencing and
records newer visual/interaction requirements. Actual engine mismatches require
an explicit adapter/ADR, not silently changing either contract. Referenced but
missing documents are not evidence of requirements already implemented.

## Existing code and bounded effort
Audit before extending. Preserve working sources, lockfile, compatible stack,
user edits and verified interactions. Do not re-scaffold the app or swap its
framework to follow a preferred template. If the folder contains only this pack,
record that there is no application; prepare a minimal runnable compatible shell
in Phase 01 rather than claiming existing prototypes were inspected.
Use repository-relative evidence paths. Do not invent Git commits, URLs or paths.
Read the full reference once in Phase 00; subsequently use indexed relevant
sections. Run focused checks on changed behavior plus required gates; avoid
repeated full-suite runs that do not resolve a remaining risk.

## Truth and transport
Core owns permissions, versions, workflow rules, history and receipts. UI policy
is presentation, not authorization. Every write source (manual, drag, voice, AI)
goes through a common validated command boundary. No direct status PATCH.
Use opaque If-Match and stable intent idempotency; keep command/operation/receipt
separate. A 202, a toast, an optimistic row or a Run ACK is not committed success.
Reconcile outcome_unknown before a new write intent. Preserve drafts on conflicts.
Manual access to all essential flows must remain possible without AI.

## Demo and Live
Represent each adapter capability as available / unavailable / proposed / verified.
Demo uses deterministic schema-faithful data with a visible badge and separate
state. Live never falls back to synthetic data, fake transcripts or timer-based
job success. Missing services block that Live path, not unrelated frontend work.
Session credentials and provider keys never enter localStorage, URLs, logs or
source. Proposed auth uses same-origin BFF; do not substitute SPA bearer silently.
Only use non-production environments authorized by the user for live tests.
No production deployment, external messages or real provider dispatch is implied.
Do not create a parallel Go backend or EKS observability infrastructure in UI work.

## Design and context
Blue/Slate identity, restrained visible glass chrome, readable work/data surfaces.
English/LTR default; Persian/RTL, light/dark and calendar/timezone adapters remain.
Default navigation is task-focused, not a landing page or oversized KPI dashboard.
Current code needs inspection; no earlier screenshot is a design approval.
Keyboard/form alternatives for drag; restore focus, scope and history.
Prompt-to-View must actually update the MAIN workspace. Read-only navigation is
reversible and should not solicit a confirmation for each request. Approval is
for writes according to engine policy, not for opening a list.

## Data and safety
Shared workset/query/scope across views. Totals come from the engine snapshot,
not the currently loaded page. Respect rendered/unmapped/unscheduled/outside-window
accounting and distinguish unknown/estimated/partial. Hidden objects must not leak
through citations, counts, graphs, export or events. Permission changes purge data.
Persist private drafts only in memory unless a separately approved secure policy
exists. Demo preferences/data may be stored locally in a clearly separate namespace.
Date-only is not midnight UTC; schedule is not deadline; estimate is not duration.
Approval is not execution, submitted is not accepted, accepted is not shipped.
Project removal is archive/tombstone under the contract, not destructive deletion.

## Phase completion
Use statuses pending / in_progress / awaiting_ui_ux_review / revising / accepted /
blocked for implementation, and NOT_RUN / PASS / FAIL / BLOCKED / UNVERIFIED
for each test. Track Demo and Live independently. Record approval only from the
user's direct decision or their confirmed submitted-report rule, with the exact
reported scope and evidence. A rejected or undelivered report remains open; a
locally passing draft can remain awaiting_ui_ux_review while Live is blocked.
Start another phase only on the user's request, even after a report is approved.
If a future phase depends on unavailable Live infrastructure, implement its
reviewable Demo/UI seam and record the blocker with an owner and exact input.
Do not label the product production-complete with unresolved required integration.
Update PROJECT_STATE.json, evidence report, coverage and endpoint mapping each run.
Only claim tests actually executed. Browser screenshots must be real. Include
source paths, exact commands, modes, outcomes, blockers and how to review.
