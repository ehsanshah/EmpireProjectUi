# User UI and UX review — reported Demo scope

## User clarification recorded 2026-10-28

The user confirms that **all submitted phase-completion reports constitute their
UI and UX approval for the scope reported in each local Demo**. They communicate
rejections directly during implementation. Phases 00–15 are approved on that
basis, in addition to the individual approvals already recorded. A completed
report must actually be delivered to the user; an internal draft or a test pass
alone is not a submitted report. Record the report path and the user's stated
scope in `PROJECT_STATE.json`. Do not request a second UI/UX confirmation for a
submitted report unless the user specifically requests a new review or rejects
the result. Approval never extends beyond the report's tested Demo scope.

The historical gate below explains how the phased reviews were conducted. This
clarification supersedes its requirement for a separate approval message after
each submitted phase report. It does not authorize another phase, Live service,
external message or production deployment.

This gate was explicitly requested by the user during preparation of this pack.
It applies to every phase, including Phase 00's runnable baseline. In Phase 00
approval means the baseline inspection and next delta are acceptable to proceed;
it does not approve every pre-existing screen or reject the need for later fixes.

## Required handoff
1. Working local URL when actually running, or exact reproducible start commands.
2. A short user journey with actions and expected VISIBLE results.
3. Screenshots of real changed UI if browser access exists; they supplement a
   usable build and never replace interaction review.
4. Separate UI checklist: composition, typography, density, glass/readability,
   light/dark, English/Persian, responsive states and visual defects.
5. Separate UX checklist: discoverability, task completion, context/history,
   keyboard/focus, AI clarification, loading/error/conflict/recovery.
6. Known gaps and truthful Demo/Live distinction.

## State
pending → in_progress → awaiting_ui_ux_review → accepted.
If feedback arrives: revising → awaiting_ui_ux_review.
ui_review and ux_review independently track pending / approved / changes_requested.
The user's recorded clarification makes delivery of a phase-completion report
their UI and UX approval for its reported Demo scope. A direct approval message
may also approve both; record its actual text. A test pass, an agent's design
opinion, an undelivered draft, silence or a bare continue is not approval.

The coding agent must finish reviewable authorized work before asking for this
decision. Do not stop prematurely with a plan or a broken app. If browser access is
missing, deliver runnable source, disclose unverified visual checks and give the
user precise review steps; never claim that a screenshot was inspected.

If the next phase is requested, check the actual submitted report and any direct
rejection or scope limit. Do not infer acceptance of work absent from that report.
If later the user changes this gate again, record the new instruction.

UI/UX acceptance does not turn a blocked API integration into Live verified.
No approval in this pack authorizes production deployment or external messaging.
