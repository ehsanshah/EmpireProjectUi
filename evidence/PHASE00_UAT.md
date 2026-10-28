# Phase 00 — user UI and UX review

Mode: local deterministic Demo. Run `npm ci` then `npm run dev -- --port 5173` from repository root. Open the printed local URL with `?design=glass` (this audit used port 5174). Use installed Chrome for the same browser as the automated suite. Click `Reset demo` before checking counts.

| Journey | Actions | Expected visible result | Audit observation | User feedback |
|---|---|---|---|---|
| Main workset | `Show remaining work`, then `Only blocked`, then Board and Timeline | Main workspace changes; 8 then 2 issues; the two blocked IDs remain across views; EMP-104 is undated | Browser suite passed; fixture and source confirm 14/8/2 baseline | Pending |
| History and details | Open EMP-104, close drawer, use Back | Drawer closes, prior workspace/query returns; no issue edit | Browser suite passed | Pending |
| Contextual work | `Why is delivery at risk?`, open a blocker, `Help me unblock this` | Investigation and local follow-up draft appear in main workspace; no external send | Browser suite passed | Pending |
| Project scope | Open project browser, select Payment Platform, then Back to previous project | Different PAY data/counts/context; prior project state restored | Browser suite passed | Pending |
| Scheduling | Open Calendar, change view, inspect undated issue, try drag and Undo | Timed blocks and due dates remain distinct; local change can be undone | Browser suite passed | Pending |
| Voice form | New project → Typed transcript test mode → Extract; optionally test mic in supported Chrome | Actual form fields update; ambiguous lead asks for choice; creation requires explicit action | Typed/mock browser tests passed; human mic test unverified | Pending |

## UI checklist — user decision pending

- Composition and hierarchy: workspace width, project identity, assistant density, narrow viewport.
- Typography and density: Persian labels, issue keys/Latin text in RTL, table scanning and touch targets.
- Glass/readability: foreground contrast over the image; table/form surfaces in dark and light.
- Themes/directions: English LTR, Persian RTL, light/dark and calendar labels.
- Responsive states: 390, 768 and 1440px; toolbar horizontal scrolling, menus, drawers and visual defects.

## UX checklist — user decision pending

- Discoverability: project switcher, views, command examples, manual actions and reset.
- Task completion: remaining → blocked → Board/Timeline, detail edit/Undo, calendar reschedule, project form.
- Context/history: Back, selected issue, per-project view state and switching.
- Keyboard/focus: Ctrl/Cmd+K, Escape, drawer focus return, drag alternatives and RTL keys.
- AI clarification: current build has only limited deterministic parser/unsupported state; requested numbered choice card is proposed for Phase 01.
- Loading/error/conflict/recovery: local scenario menu and project Demo modes; real network conflict, unknown outcome, revoke and receipts are absent.

Known Demo/Live distinction: all issue/project writes are local browser state; no real Engine, AI, voice provider, auth, SSE or receipt is connected. Screenshots: `phase00-baseline-desktop.png` and `phase00-baseline-mobile-fa-light.png` are captures of the running app. UI decision: pending. UX decision: pending. Actual approval message: not received.
