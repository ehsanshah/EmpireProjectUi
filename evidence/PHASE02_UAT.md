# Phase 02 — user review journeys

Environment: local Demo at `http://127.0.0.1:5175/?design=glass` while `npm run dev -- --port 5175` is running. Start from repository root after `npm ci`. Use **Reset issue data** if the browser has prior local changes. The Store checkout project then shows the current 14-issue fixture. The historical 12/6/2 fixture is separate and does not replace the current review data. This is a local browser Demo; Live mode deliberately shows unavailable.

| Journey | Steps | Expected visible result | Observed in browser test | User feedback |
|---|---|---|---|---|
| Session → project → issue | Open Store checkout, enter `EMP-102` in Command, run it | Issue drawer opens; Demo session, project read count, issue version and ETag appear in Transition evidence | PASS, Chrome | Pending |
| Valid transition → receipt → activity | In EMP-102 choose **In review** from its status menu | Status changes in the main list and drawer; applied Demo receipt and one activity entry appear | PASS, Chrome | Pending |
| Conflict recovery | Choose **Simulate concurrent version**, then another status | 412 conflict card keeps requested target; current status remains. Review and select **Use latest version and retry** | PASS, Chrome | Pending |
| Async operation | Choose **Simulate 202 operation** under Next status change, then change status | Pending state appears, then a single receipt and activity entry; no early success from event | PASS, Chrome | Pending |
| Unknown response | Choose **Simulate lost response**, then change status | Same intent key is reconciled; a single Demo receipt/activity entry appears | PASS, Chrome | Pending |
| Project with human Owner | Project browser → New project; choose human Owner, fill name/key/team, Create project | Created panel shows Demo creation receipt; Open project shows empty new project. No memberships or external account created | PASS, Chrome | Pending |
| Preservation | Use project switcher, browser Back, clarification preview and list/board/timeline | Approved Phase 01 navigation and card still work; current fixture counts come from data | PASS in serial regression | Pending |
| Live boundary | In a separate shell run `VITE_CORE_MODE=live npm run dev -- --port 5176` | Explicit Live unavailable page, no Demo issue fixture | PASS, Chrome client gate only | Pending |

Screenshots: `evidence/phase02-demo-drawer.png` and `evidence/phase02-mobile-fa-light.png`.

## UI review checklist — decision pending

- [ ] Desktop dark: drawer hierarchy, title, status control, evidence card, receipt and activity are legible.
- [ ] Mobile Persian RTL light: title, controls, card, IDs and receipt remain legible without clipping; light drawer contrast is acceptable.
- [ ] English LTR and Persian RTL labels, typography, density and glass shell match the approved Phase 01 design.
- [ ] Project creation Owner and receipt are visually clear; the current 14-issue count is derived from data.
- [ ] Loading, conflict, pending, error and empty states have clear visual priority. Note any remaining visual defects.

UI decision: **pending**. Please record explicit approval or requested changes.

## UX review checklist — decision pending

- [ ] Open EMP-102 and complete a status transition from its drawer; confirm main workspace and drawer agree.
- [ ] Reproduce 412 conflict; the desired status stays in the draft and retry is an explicit choice.
- [ ] Observe 202 pending and lost-response reconciliation; success appears only with a receipt, never solely from an SSE event.
- [ ] Switch projects, use browser Back, and reopen the Phase 01 clarification card; context and focus remain usable.
- [ ] Create a project with a human Owner; confirm it opens once and no membership or outside service is implied.
- [ ] Try keyboard controls and mobile layouts; review error/refresh behavior and whether recovery instructions are understandable.

UX decision: **pending**. No Phase 02 approval message received. Both UI and UX approval are required before Phase 03. Live readiness and deployment are separate from this review.
