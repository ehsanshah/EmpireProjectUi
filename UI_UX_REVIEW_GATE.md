# Mandatory user UI and UX review — every phase

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
Only an explicit user decision can set approved. One explicit message may approve
both: “UI and UX of Phase 03 approved; start Phase 04.” Record its actual text.
A test pass, an agent's design opinion, silence or a bare continue is not approval.

The coding agent must finish reviewable authorized work before asking for this
decision. Do not stop prematurely with a plan or a broken app. If browser access is
missing, deliver runnable source, disclose unverified visual checks and give the
user precise review steps; never claim that a screenshot was inspected.

If the next phase is requested while either approval is missing, present the
current review result and explain the user-required gate. Do not silently bypass it.
If later the user explicitly changes this gate, record the new instruction.

UI/UX acceptance does not turn a blocked API integration into Live verified.
No approval in this pack authorizes production deployment or external messaging.
