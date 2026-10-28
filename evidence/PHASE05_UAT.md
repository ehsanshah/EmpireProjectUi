# Phase 05 — separate UI and UX review

Environment: local **Demo**. Start with `npm ci` and `npm run dev -- --host 127.0.0.1 --port 5177`; open the printed URL at `/o/demo/p/empire/work?design=glass&view=timeline`. The current fixture contains 14 Store checkout issues. The historical 12/6/2 fixture remains separate. **Reset demo** restores the current fixture and schedule. Use a fresh browser profile or reset first.

## UI review journey

| Journey | Steps | Expected visible result | Observed in Chrome automation | User feedback |
|---|---|---|---|---|
| Calendar grid | Open Calendar; inspect Week, Day and Month; scroll vertically and horizontally | Sticky date header, pinned all-day row and time gutter; now line; category stripes; duration-based heights; readable overlapping columns | PASS for existing Week/Day/Month, overlap and pinned row; time gutter CSS inspected | Pending |
| Date meaning | Open EMP-101 in Calendar; compare Deadline, Planned start, Scheduled work, Estimate and Worklogs | Separate labeled values; due/planned dates are all-day markers, not midnight appointments | PASS for drawer and date/domain tests | Pending |
| Timeline | Open Timeline; inspect bars, date headers, dependencies and unscheduled section; navigate two weeks | Clear range bars, single-date marker shape when present, off-window accounting, authorized dependency labels and redaction; no critical-path claim | PASS for ranges, accounting, navigation and drawer; marker shape unit-tested because default visible fixture has no due-only item | Pending |
| Responsive and language | Set 390px width and Persian RTL; compare Calendar and Timeline; switch light/dark and Gregorian/Persian | No page overflow, legible labels, usable horizontal scroll and correct date display | PASS for mobile RTL screenshots; existing light-theme Calendar regression passed | Pending |

**UI checklist:** hierarchy and text contrast; stripe and event tint readability; three overlapping event targets; 5-minute event affordance; sticky gutter/header/all-day geometry; all-day and overnight labels; date-only markers; timeline bar density; Persian/Gregorian labels; RTL and 390px layout; glass/light/dark consistency. Screenshots: `docs/screenshots/phase05-timeline-en.png`, `docs/screenshots/phase05-calendar-fa-mobile.png`, `docs/screenshots/phase05-timeline-fa-mobile.png`, `docs/screenshots/calendar-week-glass.png`.

## UX review journey

| Journey | Steps | Expected visible result | Observed in Chrome automation | User feedback |
|---|---|---|---|---|
| Shared workset | In Calendar compare accounting with List; filter status to To do; return to Timeline | Same matching workset metadata, with explicit rendered/undated/outside partition; no count from only loaded List page | PASS: 14 matching then 3 matching for To do | Pending |
| Schedule and Undo | Drag a selection; cancel then create once. Move an event by pointer or Alt+arrow; resize at bottom edge or Alt+Shift+arrow; use drawer Reschedule form and Undo | 15-minute snap, exact duration, Demo receipt after accepted write, Undo restores block; deadline unchanged | PASS in existing/new browser tests and Demo boundary tests | Pending |
| Overnight and DST | In drawer Reschedule, set end date to next day. Try a nonexistent local DST-gap time in a supported timezone | Overnight end is accepted; nonexistent time is rejected with a visible error and no write | PASS in domain tests; manual timezone selector is not exposed in Phase 05 | Pending |
| Timeline context | Open an item from a bar or unscheduled section, close drawer, navigate window, use Back and project switcher | Drawer returns to prior query/window; project scope and browser history preserved | PASS in browser regression | Pending |
| Failure honesty | Review Demo receipt and CD-03; inspect Live scheduling availability | Demo clearly labeled; unavailable Live scheduling never reports success | PASS in typed boundary; no real Live staging available | Pending |

**UX checklist:** discoverability of drag and keyboard/form alternatives; schedule preview and receipt clarity; deadline preservation; Undo and rejected-input recovery; explicit unscheduled/outside counts; dependency privacy; drawer/Back context; touch scrolling; keyboard focus; no silent business-status change. Resource overlap is advisory in Demo because no Engine conflict policy is supplied. Screen reader and reduced-motion manual audit remain open.

UI decision: **pending**. UX decision: **pending**. Actual Phase 05 approval message(s): **not received**. Both must be explicitly approved before Phase 06. Live readiness and deployment are separate from UI/UX acceptance.
