# Phase 06 — separate UI and UX review

Environment: local **Demo**. Start `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 5177`; open [Backlog & Sprints](http://127.0.0.1:5177/o/demo/p/empire/planning). Classic/light is the default. The starting Store checkout fixture has 14 issues; the older 12/6/2 acceptance fixture remains separate. **Reset demo** restores the starting issues and planning state. Use a fresh browser profile or reset first.

## UI review journey

| Journey | Steps | Expected visible result | Observed in Chrome automation | User feedback |
|---|---|---|---|---|
| Planning composition | Open Backlog & Sprints; compare Backlog, Sprint 12, Sprint 13 and Deferred tabs | Active and planned states clearly differ; unknown estimates/capacity are labeled; Goal, DoD, baseline, scope log and report are readable | PASS | Pending |
| Hierarchy and rank | On Sprint 12 select **New Epic**, create one, then **Add child**; use up/down controls | Parent and indented child appear, with distinct type tags, rank controls and parent excluded from capacity | PASS; screenshot captured | Pending |
| Previews and reports | Open settings, scope, start and completion previews; inspect unfinished disposition rows and receipt message | Preview summary, versions, controls, destinations, deferred reason and Demo receipt remain legible | PASS | Pending |
| Responsive and language | Set 390px width, Persian RTL and light/dark; scroll tree and panels | Controls remain reachable; no document overflow; text and data surfaces retain contrast | PASS for RTL/mobile; light/dark inherited from approved shell | Pending |
| Review correction: tabs and default | Open the planning route without a design parameter at 680px width; inspect all four tabs, then compare Glass and Persian RTL | Tabs stay fully visible above summary chips; Classic/light is selected initially; the old label reads Classic | PASS in Chrome; [680px capture](../docs/screenshots/phase06-tabs-classic-light.png) | Pending |

**UI checklist:** composition and information hierarchy; typography and density; active/planned/deferred distinction; readable Goal/DoD/baseline/report; preview dialog and reason fields; rank and hierarchy indentation; glass contrast in dark/light; English/Persian and RTL; 390px layout; visible defects. Screenshots: `docs/screenshots/phase06-planning-desktop.png`, `docs/screenshots/phase06-planning-mobile-fa.png`, `docs/screenshots/phase06-hierarchy.png`.

## UX review journey

| Journey | Steps | Expected visible result | Observed in Chrome automation | User feedback |
|---|---|---|---|---|
| Unknown fit | In Sprint 12 select **Simulate fit** with unchanged fixture | `fit_unknown`, missing estimates and capacity remain explicit; no invented commitment | PASS | Pending |
| Goal and baseline | Move an issue to Sprint 13; set a Goal through **Preview settings** and Apply, then **Preview start** and Apply | Start needs an entered Goal; baseline captures membership/known leaf estimates once and remains visible after later scope changes | PASS | Pending |
| Scope and rank | Select a destination on an issue; enter a reason before Deferred. Use up/down rank buttons | Preview before change; versioned Demo receipt; rejected deferral without reason; rank revision protects stale order | PASS in browser/unit | Pending |
| Completion and recovery | In Sprint 12 select **Preview completion**; choose destination for every unfinished issue, give each deferred item a reason, Apply; then Preview reopen | No unfinished item silently disappears; scope log records disposition; receipt appears; reopen does not silently restore previous scope | PASS | Pending |
| Metrics and truth | Inspect report after completion and compare parent/child estimates in two Sprints | Baseline/current/scope changes separated; parent estimate excluded; points and hours separate; Goal remains unassessed and delivery unclaimed | PASS in unit and UI checks | Pending |
| Context and history | Open an issue from the planning tree, close drawer, use Back/project switcher; revisit Board/Calendar/Timeline | Project scope, drawer and prior approved views remain available | PASS in full browser regression | Pending |
| Review correction: agent | Reload planning; click **Agent** beside the command field, open its clarification preview, then close it | Agent starts collapsed, opens on click, retains its actions, and returns keyboard focus to the trigger on close | PASS in Chrome | Pending |

**UX checklist:** discoverability of tabs, rank and destination controls; keyboard access/focus; preview clarity; one apply and one receipt; no duplicate effects; draft retention on 412/422; capacity unknown; explicit unfinished-work disposition; baseline visibility after scope change; Goal/DoD truth; drawer/Back and project context; AI clarification continuity; loading/error honesty. Actual Engine/Live Sprint work remains blocked and separate from this Demo acceptance.

UI decision: **pending**. UX decision: **pending**. Actual Phase 06 approval message(s): **not received**. Both must be explicitly approved before Phase 07. Live readiness and deployment are separate from UI/UX acceptance.
