# Kanban prototype review — 2026-10-22

Status: `awaiting_prototype_review`. The running local prototype is [http://127.0.0.1:5173/?design=glass](http://127.0.0.1:5173/?design=glass). No backend, external upload, real message, deployment, or Stage 2 module was added.

The Kanban board was added inside the existing Sprint workspace while retaining the List, Timeline, issue drawer, assistant journeys, current-design fallback, and local issue repository. The reference video `/Users/ehsanshahbakhti/Downloads/6729630176286881453.MP4` was inspected in actual sampled frames. The board reproduces the lift/tilt/shadow drag feel, faded source, measured-height drop slot, WIP at 3/4 then 4/4 and refusal of a fifth card, collapsed Done rail, and Web/Mobile lanes. The user clarified that “upload” means local CSV/JSON upload to create cards, which was added separately from the video reference.

After the user's visual correction, the glass board's saturated blue fill was removed. Its shell, swimlanes and columns now show the blurred courtyard backdrop through translucent neutral surfaces with bright fine borders. Cards remain dark and sufficiently opaque for issue text. Actual screenshot inspected after this correction: [desktop glass board](screenshots/kanban-01-desktop.png). The shell and card surfaces remain intentionally different for contrast.

The fixture was expanded from 12 to **14 issues** with two explicit synthetic Kanban cards, EMP-113 and multiline EMP-114, and Web/Mobile areas on the existing issues. The initial state is 3/4 In Progress globally, 8 remaining, 2 blocked. Existing browser data is migrated without dropping edits. The expanded fixture changes prior 12/6 counts in historical report entries below; they describe earlier versions.

| Acceptance | Actual Chrome result |
| --- | --- |
| A. Reorder within To Do | Passed: EMP-104 moved above EMP-102; order was stored. Multiline source and slot heights differed by less than 1px. [Drag frame](screenshots/kanban-02-drag.png). |
| B. Move at 3/4 | Passed: EMP-102 entered In Progress, changing the shared count to 4/4. [WIP full](screenshots/kanban-03-wip-full.png). |
| C. Reject fifth | Passed: EMP-104 stayed in To Do; a clear WIP notice appeared, count remained 4/4. |
| D. Collapse and expand | Passed: Done expanded to show its three Web cards then collapsed to a rail showing count 3; Backlog also collapsed and expanded without losing its Mobile card. [Collapsed state](screenshots/kanban-04-collapsed.png). |
| E. Change swimlane | Passed: EMP-102 moved Web → Mobile without changing other cards or the shared 4/4 count; an additional real pointer drag moved EMP-104 across lanes. [Swimlanes](screenshots/kanban-05-swimlanes.png), [pointer drag](screenshots/kanban-12-cross-lane-drag.png). |
| F. Menu and keyboard WIP | Passed: Move to… and Alt+arrow both refused a fifth In Progress card. Inline status edits use the same policy. |
| G. Refresh and reset | Passed: lane/status and editable WIP limit survived refresh; Reset demo restored 14 issues and 3/4. Local CSV import created a Mobile Backlog card visible in Board and List, then reset removed it. [Upload preview](screenshots/kanban-10-upload.png). |
| H. Desktop/mobile, LTR/RTL | Passed: desktop columns fit without board horizontal overflow; RTL reverses their visual order and supports drag; mobile stacks readable columns without document overflow. [Desktop RTL](screenshots/kanban-06-rtl.png), [mobile RTL](screenshots/kanban-07-mobile-rtl.png), [mobile LTR](screenshots/kanban-09-mobile-ltr.png). |

Single-line measured-height drag evidence: [EMP-106 drag](screenshots/kanban-11-short-card-drag.png). Mobile second swimlane: [mobile lane](screenshots/kanban-08-mobile-swimlane.png).

Verification: `npm run typecheck` passed; `npm test` passed 18 tests; `npm run build` passed; `npm run test:e2e` passed 11 Chrome tests. The final neutral-glass CSS correction was followed by a focused Chrome acceptance run and screenshot inspection. Browser verification used Chrome; Safari, Firefox, touch hardware, screen reader operation and multiuser behavior were not verified. Drag across distant swimlanes can require scrolling the board while holding the card; the menu and keyboard provide alternatives. The file parser is deliberately bounded and local (CSV/JSON, 20 cards, 256 KB), not a general spreadsheet importer. No user approval is recorded.

---

# Prototype redesign — implementation report

## Single-row work toolbar

The three stacked rows for workspace title, List/Board/Timeline and search, and filters/grouping/sort are now one 51px toolbar in both the current and glass designs. The table begins immediately below it, reclaiming roughly 80px of vertical space at desktop width. Controls remain visible and functional, with horizontal toolbar scrolling at narrow widths; issue rows retain their ⋮⋮ reorder handles. Actual browser captures: [current design](screenshots/redesign/01-workspace.png) and [glass design](screenshots/glass-preview/01-workspace.png). Typecheck, build, and all 8 Chrome tests passed; browser checks assert the toolbar height and table adjacency. The existing local server at `http://127.0.0.1:5173/` responds successfully. Status remains `awaiting_prototype_review`.

## Compact list and agent marker

The separate drag instruction strip was removed to free issue space. The **⋮⋮ drag handles remain visible on every list row in both designs**, with mouse drag, keyboard and click move controls unchanged. A short hint is merged into the surface footer. EMP-103 is assigned to 🤖 Hermes in the canonical demo fixture and existing local data is migrated from the former Sara assignment. List, Board, Timeline, investigation and details identify Hermes as its assignee. This is a synthetic collaborator marker, not an autonomous execution claim. The glass design remains the selected default; the previous design remains available.

Verification after the Hermes assignment correction: typecheck, 15 core tests, 8 Chrome tests and production build passed. A focused repeat of the two reorder browser tests also passed after widening the assignee column. All 12 ⋮⋮ handles remain in both designs and the separate strip is absent. The real browser image `docs/screenshots/glass-preview/04-reordered.png` shows the compact list and Hermes as the EMP-103 assignee.


## Latest update: glass retained and row reordering added

The user explicitly accepted the glass appearance and requested mouse-based work ordering. Glass is now the default; `?design=current` and **Previous design** retain the navy version. This is approval of the visual choice, not authorization for backend work or Stage 2. Prototype interaction review remains pending (`awaiting_prototype_review`).

List rows now have visible drag handles and before/after insertion indicators. Manual priority is the default sort. A drop persists the work order through the existing issue repository and supports Undo and reset. High/Normal urgency labels, status, owner and dates are unchanged. Filtered reordering changes only visible slots; hidden rows retain their positions. Grouped lists permit moves only within the same assignee group. Other sorts disable drag handles with explanatory text. Clickable up/down controls and Alt+↑/↓ provide keyboard and non-drag alternatives. Manual order is shared with board/timeline and survives reload.

Verification: typecheck/build passed; 15 core tests and 7 Chrome tests passed. The new browser test performs a real mouse drag, checks ordering and unchanged urgency, tests Undo and reload persistence, disables drag under date sorting, and exercises click/keyboard alternatives. `docs/screenshots/glass-preview/04-reordered.png` is an actual browser capture after moving EMP-103 to the top. No new external service or module was added.

Earlier report entries below describe previous iterations and are retained as history.


## Latest optional design experiment

A reference-inspired glass preview is now available at `/?design=glass`; the existing navy design remains the default. Switching **Current / Glass preview** preserves workspace state. The prior source is archived in `docs/snapshots/blue-workspace-before-glass-preview.tar.gz`. See [comparison report and asset provenance](GLASS_PREVIEW.md). Build/typecheck, 13 core tests and 6 Chrome tests passed. Real screenshots are in `docs/screenshots/glass-preview/`. No replacement or approval has been recorded; status remains `awaiting_prototype_review` / `awaiting_visual_and_interaction_review`.

---

Date: 2026-10-22

Previous prototype: rejected by user. This revision remains in the prototype phase.

Gate status: `awaiting_prototype_review`
Delivery status: `awaiting_visual_and_interaction_review`

No user approval is recorded. No backend, deployment, external service connection or additional product module was implemented.

## What changed

The pale composition was replaced with a navy workspace, restrained cobalt/cyan background illumination, inset translucent navigation, layered assistant and command surfaces, visible edge highlights and backdrop blur. Dense issue surfaces remain opaque. The assistant is a contextual side panel with three explicit journey entry points, and the persistent composer shows sprint scope, current composition, result count and selected issue.

English/LTR, dark theme and Gregorian dates are defaults. Persian/RTL, Persian dates and light theme remain selectable. Navigation, fixture titles/descriptions, acceptance criteria, blocker reasons, sample conversations, accessible controls, empty/error states and assistant responses have English and Persian variants. User-authored content and edited drafts are preserved in their source language.

Working query evaluation, local issue editing, creation, Undo, reset, shared renderer result sets, date-only handling and stale-command protection were retained. Existing persisted issue data uses the same storage key, with missing English fixture fields supplemented without discarding edits.

## Completed journeys

1. **Show remaining work → Only blocked** changes the main workspace from 6 to 2 records. List/Board/Timeline retain EMP-103 and EMP-104. Filters can be inspected and changed manually.
2. **Why is delivery at risk?** opens a typed investigation composition. It shows the actual EMP-103 → EMP-104 dependency, Hermes/Reza ownership, recorded blocker reasons and missing start/due dates for EMP-104. Suggested interpretation is explicitly labeled. No risk scores, delivery forecasts, invented causes or dates are generated. Each issue has Inspect and Draft next step actions.
3. **Help me unblock this** uses the selected issue. Dependency direction, relevant acceptance criteria and a proposed action are presented beside an editable local follow-up draft. Changes persist by issue ID and survive reload. Save feedback distinguishes a local save from sending; storage failure is reported honestly. No issue status changes or external messages occur.

History stores the bounded `work | risk | unblock` composition as well as filters, grouping, sort and view. Closing details retains the selected issue for the next command. Back restores prior workspace state. Missing issue context and unsupported prompts produce explicit fallbacks.

## Visual review sequence

The English desktop workspace and delivery investigation were implemented and captured first. Actual Chrome screenshots were inspected before building the follow-up editor.

Corrections from inspection:

- Reduced the investigation's vertical footprint so both blockers, their actions, the dependency and scheduling information are visible together at 1440×900.
- Increased issue and assistant-entry typography.
- Kept fact and suggested-interpretation labels distinct.
- Gave the selected-issue composition its own evidence/editor layout instead of leaving table controls above it; the complete desktop draft editor and context now fit together.
- Checked actual English dark, Persian RTL, optional light and 390/768px captures. Tables deliberately scroll horizontally on narrow screens; the page itself does not overflow.

## Verification

- `npm run typecheck`: passed.
- `npm test`: 13 tests passed (10 query/intent/history/composition tests, 3 local-draft tests).
- `npm run build`: passed.
- `npm run test:e2e`: 5 Chrome tests passed. Covers the three journeys, 12/6/2 counts, unchanged result sets, history and selected context, focus restoration, English fixture details, draft edit/save/reload, no status mutation, unsupported prompts, missing context, issue edit/Undo/reload, create/reset, error/retry/empty states, Ctrl+K, Persian RTL, optional light theme and 390/768px widths.
- Eight complete issue rows and the composer are asserted within the visible desktop data surface.
- The full investigation-to-draft browser journey records network requests and asserts no external requests.
- Storage tests cover unavailable/corrupt draft storage and ensure it is never reported as saved.

Browser verification was available using installed Chrome. No Safari/Firefox, screen-reader, production-scale or enterprise security audit is claimed.

## Actual screenshots

- [English desktop workspace](screenshots/redesign/01-workspace.png)
- [Delivery-risk investigation](screenshots/redesign/02-risk-investigation.png)
- [Edited local follow-up draft](screenshots/redesign/03-unblock-draft.png)
- [Shared-query timeline](screenshots/redesign/04-timeline.png)
- [390px workspace](screenshots/redesign/06-width-390.png)
- [768px workspace](screenshots/redesign/06-width-768.png)
- [Persian RTL investigation](screenshots/redesign/07-persian-risk.png)
- [Optional light investigation](screenshots/redesign/08-light-risk.png)

These are real browser captures. Screenshots in the parent screenshots directory belong to the rejected earlier prototype.

## Limitations and handoff

The assistant is deterministic and supports the documented journeys and examples, not unrestricted language. No LLM or backend is connected. Drafts are stored in this browser only; resetting issue data preserves separately saved drafts. There is no recipient, external send, scheduled follow-up, date editor, advanced planning engine or risk prediction. Local storage and browser filters are not an authorization boundary.

Setup and exact review steps are in `README.md`. The local preview is http://127.0.0.1:5173. Passing checks is not visual approval. Stop here for the user's visual and interaction review.

## Work Flow review addition — 2026-10-25

Status remains `awaiting_prototype_review`. The new Work Flow is a separate navigation item and a local payment-flow demo. The Sprint 12 issue fixture and its existing List, Board and Timeline remain independent. The prompt supplied an ASCII composition and behavior specification; no image file was attached, so the visual implementation follows the written reference.

The fixture in `src/paymentGraph.ts` contains PAY-38, PAY-42, PAY-46, PAY-51 and exactly four directed edges. The layout derives columns from graph depth and vertical lanes from nodes at each depth. Graph validation rejects unknown references, duplicate edges, self-dependencies and cycles. PAY-51 readiness is derived from both predecessor statuses. PAY-42 and PAY-46 can be edited locally through the existing detail-drawer surface; Work Flow Reset restores their initial values. Nothing is sent or persisted to an external system.

Open **Work Flow** in the left menu (or its compact mobile entry). The demo commands `Show the payment release workflow`, `Why is PAY-51 waiting?`, `Show the path from PAY-38 to PAY-51`, `Open PAY-42` and `Back` change the main workspace and navigation history. The command adapter is simulated and limited to documented phrases. Card focus/hover highlights connected edges; connector click or Enter reveals its dependency sentence. Show blockers identifies PAY-42 and PAY-46, excluding completed PAY-38. Pan, zoom and Fit view work on desktop; mobile uses a scrollable, readable stacked dependency order. English/LTR is the default; Persian/RTL and light/dark work in this view.

Verification on this update: `npm run typecheck` passed; `npm test` passed **22/22**; `npm run build` passed; `npm run test:e2e` passed **13/13** in installed Chrome. Work Flow browser checks additionally cover the four rendered edges, connector explanation, pan/zoom/Fit, two paths, command-driven highlighting, drawer context and preserved zoom, prerequisite details, derived Ready, Reset, 390px mobile, Persian RTL and light/dark. Existing List, Board and Timeline journeys were included in the full suite.

Actual browser screenshots: [desktop dark](screenshots/workflow-desktop-dark.png), [desktop light](screenshots/workflow-desktop-light.png), [Ready after both prerequisites complete](screenshots/workflow-ready.png), [mobile dark top](screenshots/workflow-mobile-dark.png), [mobile after scrolling to PAY-51](screenshots/workflow-mobile-end.png), [mobile Persian RTL](screenshots/workflow-mobile-fa.png).

Run with `npm ci` then `npm run dev -- --port 5173` and open http://127.0.0.1:5173/?design=current . This is a bounded dependency viewer, not an automation editor, approval service or project engine. The local status changes reset on page reload. The visual and interaction review remains with the user.
