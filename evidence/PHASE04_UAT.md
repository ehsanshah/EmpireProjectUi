# Phase 04 — user UI and UX review

Environment: local **Demo**. At handoff, open [the running Board](http://127.0.0.1:5177/o/demo/p/empire/work?design=glass&view=board). To reproduce: `npm ci`; `npm run dev -- --host 127.0.0.1 --port 5176`; use Vite's printed URL if the port is occupied. The current fixture has 14 Store checkout issues; the older 12/6/2 fixture is separate. **Reset demo** restores the current fixture and default WIP cap 4. Review in a fresh browser profile or reset first.

## UI review journey

| Journey | Steps | Expected visible result | Observed in Chrome automation | User feedback |
|---|---|---|---|---|
| Board composition | Open Board in Glass, expand/collapse Backlog and Done, inspect Web/Mobile lanes and bottom tray | Workflow columns, readable cards, shared 3/4 WIP, 13 rendered + 1 unmapped = 14; cancelled EMP-112 remains in tray | PASS | Pending |
| Drag and responsive visual | Drag EMP-104 above EMP-102, pause before drop; view at desktop and 390px; switch Persian RTL and light theme | Lifted preview, source ghost, placeholder matching card height; RTL column direction and mobile horizontal board remain usable | PASS for drag geometry, RTL/mobile; light theme covered by existing UI regression | Pending |
| Required-field and conflict surfaces | In **Board settings**, load the clearly labeled EMP-102 required-field Demo scenario; move EMP-102 to Done without a note, inspect the form, retry with a note; open another card drawer and use **Simulate concurrent version**, then attempt a Board move | Clear error, readable field and buttons; source card stays visible; conflict draft stays reviewable | PASS in browser journey | Pending |
| Work Flow composition | Open Work Flow from sidebar; inspect four PAY nodes and connectors; show blockers/paths, zoom/Fit; switch Persian and narrow viewport | PAY-38 branches to PAY-42/PAY-46 and converges on PAY-51; attached curves, hierarchy and mobile stacked order remain readable | PASS | Pending |

**UI checklist for your decision:** composition and hierarchy; typography/card density; glass/data contrast in dark and light; English/Persian labels and RTL order; desktop and 390px layouts; connector clarity; visible defects. Screenshots: `docs/screenshots/kanban-03-wip-full.png`, `docs/screenshots/workflow-desktop-dark.png`, `docs/screenshots/workflow-mobile-fa.png`, `evidence/phase04-required-field.png`, `evidence/phase04-conflict-draft.png`.

## UX review journey

| Journey | Steps | Expected visible result | Observed in Chrome automation | User feedback |
|---|---|---|---|---|
| WIP and counts | Move EMP-102 into In Progress, then attempt EMP-104 by drag, menu and Alt+ArrowRight; apply a List priority filter and switch Board | Fourth card accepted, fifth rejected without source movement; WIP remains full-project 4/4 while filtered workset count changes | PASS | Pending |
| Reordering and alternatives | Reorder To Do by drag; move between lanes with menu; use Alt+arrows on the grip; reload; Reset demo | Rank persists after versioned Demo receipt; keyboard/menu use same validator; reset restores baseline | PASS | Pending |
| Validation/recovery | In **Board settings**, load the EMP-102 required-field Demo scenario; attempt Done without a note, enter one and retry; simulate concurrent version in another card's drawer and attempt a move | Draft retained on 422/412; successful retry shows receipt and activity, rejected move remains in source | PASS for Board UI, typed receipt/activity unit checks | Pending |
| Dependency meaning | Show blockers and both paths, open PAY-51 drawer, mark PAY-42 then PAY-46 Done via validated status command, inspect PAY-51 | Derived readiness changes to Ready only after both prerequisites; PAY-51 business status, review acceptance and release state are not silently changed | PASS | Pending |
| Navigation and states | Use project switcher, browser Back, AI clarification card; try keyboard focus on graph edges and Fit view | Approved Phase 01–03 context/history/clarification remains; graph controls are focusable and usable | PASS in regression; screen reader audit remains open | Pending |

**UX checklist for your decision:** discoverability of drag/menu/keyboard actions; WIP explanation; count truth under filters; task completion and receipt clarity; source-position recovery; required field and conflict handling; drawer/history context; keyboard/focus; AI clarification continuity; loading/error honesty. Actual Engine/Live behavior remains blocked and separate from this Demo acceptance.

UI decision: **pending**. UX decision: **pending**. Actual Phase 04 approval message(s): **not received**. Both must be explicitly approved before Phase 05. Known open issue: true time-in-column aging cannot be shown without status-entry history and policy; no such value is fabricated.
