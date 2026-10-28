# Phase 09 — separate UI and UX review

Environment: local Demo at [Intake & plan](http://127.0.0.1:5178/o/demo/p/empire/intake?design=current). Start with `npm run dev -- --port 5178` if it is no longer running. Clear browser localStorage key `empire-phase09-intake-plan-v1:local-demo` to reset Phase 09 data only. The 14-issue current fixture and historical 12/6/2 fixture remain separate.

## UI review journey

1. Open Intake & plan in Classic/Light. Check Intake kinds, readable title/status, opaque detail cards and closed Agent panel.
2. Open the objective, choose “Checkout web and mobile,” and create the plan. Check the two-task hierarchy and dependency, budget unknown state, simulation, before/after area, approval controls and receipt styling.
3. Switch English/Persian and desktop/mobile widths; check RTL, wrapping, visible controls and vertical scrolling. See [desktop screenshot](../docs/screenshots/phase09-plan-desktop.png) and [Persian mobile screenshot](../docs/screenshots/phase09-intake-mobile-fa.png).

UI checklist for user: [ ] composition/readability [ ] typography/density [ ] Classic/Light default [ ] dark theme [ ] English/Persian [ ] mobile/RTL [ ] no clipping or visual defect. Screenshots were inspected in Chrome, but user review remains pending.

## UX review journey

1. Objective → required clarification → plan. Confirm the card’s numbered choices, direct answer and correction. Idea and link require explicit scope triage. Ready-file references remain unresolved until a Phase 08 local Demo scan-ready DataCart exists; voice references remain unavailable without a verified transcript.
2. Edit task scope, role, dependencies, acceptance, tests, DoD, cost or budget; save a new revision and compare before/after. Enter `task-2` as task-1’s dependency to see the cycle warning and blocked approval; remove it to continue.
3. Simulate a concurrent edit, make another local change, try Save, then load latest for comparison. Confirm the editable draft survives.
4. Request changes or Reject; verify approval is blocked until a new revision is saved. Select tasks, explicitly acknowledge unknown budget, Approve plan, then separately Request execution. Confirm the result is only a Demo simulated request and no task becomes Done.
5. Repeat the execution request and reload; confirm one logical request. Use keyboard Enter/Tab and browser Back/forward; verify the same Intake detail and project context are restored.

UX checklist for user: [ ] discoverability [ ] clarification/triage [ ] DAG edit and simulation [ ] conflict/draft recovery [ ] approval vs execution distinction [ ] idempotent retry/reload [ ] keyboard/focus [ ] context/history [ ] honest unavailable states. Browser tests passed for the listed technical paths; human UX acceptance remains pending.

UI decision: approved for tested local Demo. UX decision: approved for tested local Demo. Actual user message: “I explicitly approve both the UI and UX of the tested Phase 09 local Demo flows. Preserve all existing Live blockers and unverified capabilities; this approval does not verify actual agent execution.” Real agent execution, Live Engine, ready-file/voice source binding and real microphone transcription remain blocked or unverified. The user explicitly approved both for the tested local Demo, permitting Phase 10. This does not verify real agent execution.
