# EmpireProject — prototype redesign

**Selected design:** Classic in light mode is the default at [localhost](http://127.0.0.1:5173/). Glass remains available with the design switch or `?design=glass`; the Classic route is `?design=current` for existing links. The Workspace agent starts collapsed and opens from the labeled Agent button beside the command field.

**Reorder work:** in List, choose **Manual priority** (the default), then drag the ⋮⋮ handle beside an issue and drop above or below another row. The insertion line shows placement. The order saves locally and supports Undo. Clicking the handle exposes up/down controls; Alt+↑/↓ also works while the handle is focused. High/Normal labels do not change. Filtered reordering permutes only the visible slots; hidden issues keep their positions. Grouped lists reorder within the same assignee group. Other sorts disable dragging until Manual priority is selected. Board/Timeline share the saved manual order.

English/LTR and Classic light are the defaults. Persian/RTL, dark mode and Glass remain available. This is a local, deterministic prototype, awaiting visual and interaction review. No backend, account connection or live AI is used.

## Run

Requires Node.js 22.17+ and npm. From the repository directory:

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. The development server binds to localhost.

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Browser tests use installed Google Chrome (`channel: 'chrome'`). No bundled Playwright browser is required when Chrome is installed.

## Three review journeys

The persistent command composer accepts these prompts. The Demo assistant also provides clickable entry points.

1. **Show remaining work** → eight remaining issues in the expanded Kanban review fixture. **Only blocked** → EMP-103 and EMP-104. List, Board and Timeline retain the same result set. Grouping, sorting and search remain available manually.
2. **Why is delivery at risk?** → a main-workspace investigation with the two blocked issues, the recorded EMP-103 → EMP-104 dependency, owners, documented blockers and EMP-104's missing dates. Facts and suggested interpretation are separate. Inspect either issue or choose **Draft next step**.
3. **Help me unblock this** → first inspect an issue, then close the drawer and issue the command, or use the drawer's matching action. The selected issue's evidence, dependencies, acceptance criteria and proposed action appear beside an editable follow-up draft. Edits are stored locally; **Save draft** explicitly saves/retries. No message is sent and issue status is unchanged.

**Back** restores the preceding workspace. Closing a drawer keeps its issue selected as composer context. **Ctrl/Cmd+K** focuses the composer. Unsupported prompts receive an explicit fallback without changing data.

Other commands: `Group by assignee`, `Show timeline`, `Open EMP-104`, `Show all issues`, `Explain only`.

Persian equivalents for the three journeys: `ایشوهای مانده این اسپرینت را نشان بده`, `چرا تحویل در خطر است؟`, `کمک کن این مانع را رفع کنم`.

## Kanban review

Choose **Board** in the compact Sprint work toolbar. Web and Mobile share Backlog → To Do → In Progress → Review → Done. Drag the ⋮⋮ handle to reorder or change column/swimlane; a lifted preview and an equal-height insertion slot show the destination. Click a card title to inspect it. **Move to…** offers the same destinations without dragging. With the handle focused, Alt+←/→ changes workflow column (reversed appropriately in RTL), Alt+↑/↓ reorders, and Alt+Shift+↑/↓ changes swimlane.

The demo begins at **3/4** In Progress across both swimlanes. Move EMP-102 from Web To Do to In Progress to reach **4/4**; a fifth move is rejected by drag, menu, keyboard, and inline status editing. **Board settings** changes the local demo WIP limit. Backlog and Done collapse into count-bearing rails; their cards and data are retained. **Upload cards** previews and imports a local CSV or JSON file (1–20 cards, 256 KB maximum); [sample CSV](docs/kanban-import-sample.csv). Imported cards appear in List and issue details. No file is sent. Board changes persist through refresh, support Undo, and **Reset demo** restores the seed.

The canonical review fixture now has **14 issues / 8 remaining / 2 blocked**. EMP-113 and EMP-114 are clearly synthetic Kanban test cards; all earlier issues remain. The previous visual design and existing prototype journeys remain available. See [acceptance evidence and browser screenshots](docs/IMPLEMENTATION_REPORT.md).

## Local behavior

- Existing issue data and edits retain the `empire-demo-v2` storage key. Missing English fixture fields are supplemented on load; issue edits are preserved.
- Follow-up drafts use `empire-follow-up-drafts-v1`, keyed by immutable issue ID.
- Reset issue data resets the synthetic issues, with one-level Undo. It preserves separately saved follow-up drafts.
- Language switching translates interface and fixture content. User-authored issue text and edited drafts remain exactly as written.
- Demo scenarios expose loading, empty and error/retry states.
- Dense tables scroll internally, and horizontally on smaller screens. The assistant stacks beneath the workspace on narrow screens.

## Implementation boundaries

- `src/domain.ts`: typed issue/query model, bounded `work | risk | unblock` compositions and navigation history.
- `src/intent.ts`: deterministic intent parsing and stale-response protection.
- `src/repository.ts`: local issue persistence and query adapter.
- `src/Views.tsx`: List, Board and Timeline registry.
- `src/Investigation.tsx`: recorded delivery evidence and separately labeled suggestion.
- `src/Unblock.tsx`, `src/drafts.ts`: selected-issue follow-up and local persistence.
- `src/App.tsx`, `src/Modal.tsx`, `src/styles.css`: redesigned shell, interactions, keyboard dialog and visual system.
- `fixtures/sprint12.json`: bilingual canonical synthetic dataset, expanded to 14 total / 8 remaining / 2 blocked for Kanban review.

[Implementation and review report](docs/IMPLEMENTATION_REPORT.md) · [Actual screenshots](docs/screenshots/redesign/)

Historical Stage 1 prototype notes follow; current phased status is recorded in `PROJECT_STATE.json` and the Phase 07 section below.

## Work Flow review

Select **Payment Platform (PAY)** in the project switcher, then open **Work Flow** in the left menu or the compact Work Flow button on mobile. This payment-release demo shows PAY-38 → PAY-42/PAY-46 → PAY-51. Click a connector for its rule, use **Show blockers**, pan/zoom/**Fit view**, or open a card for details. Change PAY-42 and PAY-46 to **Done** in their drawers to make PAY-51 **Ready**; **Reset demo** restores the four payment issues. Try `Why is PAY-51 waiting?` in the command input and watch the main graph change. See [implementation report](docs/IMPLEMENTATION_REPORT.md) for verified behavior and screenshots.

## Calendar review

Open **Calendar** from the separate left-menu item (or the compact Calendar button on mobile). Week is the initial view for the deterministic week of 26 October–1 November 2026 in `Europe/Istanbul`. The toolbar has Day/Week/Month, previous/Today/next, assignee/project/status/blocked filters, and a configurable first weekday. The app starts in English/LTR; the header controls switch to Persian/RTL, Persian date labels, and light/dark themes.

The calendar shows issues from the active project only. The local schedule fixture contains 42 work blocks across the original Sprint 12 and Payment Platform projects: overlapping Design sync, Gateway review, and Sprint review; a five-minute block; all-day and two-day work; overnight work; and unscheduled issues. Issue deadlines appear as all-day **Due** markers. Drag empty grid space to select a 15-minute-snapped range, then cancel or save a new issue. Drag an event to move it, drag its bottom edge to resize, or use **Reschedule** in the issue drawer; **Undo** reverses the latest calendar change. The **Unscheduled** panel opens matching issues and supports drag-to-grid proposals. Schedule edits do not change issue deadlines, estimated effort, or completion status. Calendar schedule changes are session-local and Reset demo restores the fixture.

Try these deterministic commands in the bottom composer: `Show my remaining tasks this week on the calendar`, `Only blocked tasks`, `Show next week`, `Back`. Select Payment Platform first for `Open PAY-42`. They update the main workspace or drawer; unsupported text receives a clear fallback. No external assistant or service is connected.

Run `npm ci` and `npm run dev -- --port 5173`, then open [http://127.0.0.1:5173/?design=glass](http://127.0.0.1:5173/?design=glass). The **Classic** design is available at `?design=current` and is now the default. Calendar validation and screenshots are recorded in [the implementation report](docs/IMPLEMENTATION_REPORT.md). Status: **awaiting_prototype_review**.


## Project Switcher review

The current project appears in the top bar. Open it to browse the locally accessible projects by name or key. The browser has Pinned, Recent and All sections, project status and key, search, a collapse button and a **Reset width** action. On desktop, drag its thin divider to resize from 240 to 640px; dragging below 180px closes it. Reopening restores the last valid expanded width. Arrow keys resize by 10px, Shift+arrow by 40px, Home/End jump to limits. Escape cancels an active drag. On narrow screens it opens as a drawer. Width and open/collapsed state persist in this browser.

Choose **Payment Platform (PAY)**, **Storefront (STORE)** or **Customer Support (HELP)** to inspect distinct issues in List, Board, Calendar, Timeline and Work Flow. The Agent context, counts and issue details follow the selected project. Each project's last view and filter are remembered during navigation; local follow-up drafts are saved by issue ID. Try `Switch to Payment Platform.`, `Show remaining issues in Storefront.`, and `Back to the previous project.` in the simulated command input. `Switch to Operations.` asks you to choose **OPS** or **OPSW** by key. An unsupported command does not switch projects.

The project adapter and issues are local demo data. To inspect simulated adapter states, add `&projectDemo=loading`, `empty`, `error`, or `unavailable` to the preview URL. Client-side selection is not production authorization. Run `npm ci`, then `npm run dev -- --port 5173`; open [the local prototype](http://127.0.0.1:5173/?design=glass). Verification and screenshots are in [the implementation report](docs/IMPLEMENTATION_REPORT.md). Status: **awaiting_prototype_review**.

## Voice-to-Form review

Open the current project in the top bar and choose **New project** (+). In the blue-glass form, choose the spoken language independently of the UI language, then choose **Start recording**, speak and press **Stop**. A compatible browser with microphone permission and Web Speech recognition is required; Chrome on `localhost` is the intended review path. The final transcript remains editable, and supported values fill the actual project name, key, description, team and optional lead controls. Unresolved people are offered as choices. Edit any field manually, try a correction, or undo the last voice update. The form asks for missing required information and shows inline errors. It creates nothing until **Create project** is pressed. Spoken conditional creation wording fills the draft only and never submits it. A successful local create appears in the project browser and can be opened as an empty project; it survives refresh in this browser.

To exercise extraction without a microphone, choose **Typed transcript · test mode** and enter `Call it Merchant Portal, key MERCH, use the Core Platform team.` Then choose **Extract into form**. Try `Actually, change the name to Merchant Hub.`; only the name changes. `Lead is Sara.` asks which of two sample Saras you mean. The typed mode is explicitly a test aid and does not verify audio capture. `?projectCreateDemo=error-once` exercises failed local save and Retry. The screenshot and verified scope are in [the implementation report](docs/IMPLEMENTATION_REPORT.md). Run `npm ci` and `npm run dev -- --port 5173`; open [the glass preview](http://127.0.0.1:5173/?design=glass). Status: **awaiting_prototype_review**.


## Phase 07 review

The default is **Classic** with the light theme. The **Agent** panel starts closed. In the bottom command input, try `Show remaining issues`, `Only blocked`, `Show them on the calendar`, `Open EMP-104`, then `Back`. The current Demo fixture calculates 14 total, 8 remaining and 2 blocked; the historical 12/6/2 fixture is separate. Try `Assign remaining tasks to Sara` to review the numbered clarification and approval proposal, or `Set EMP-101 due on Tuesday` to supply an exact date. No AI write is committed without the **Approve and apply** button and a valid Demo receipt.

Run `npm ci` and `npm run dev -- --host 127.0.0.1 --port 5177`, then open [the Phase 07 UI](http://127.0.0.1:5177/o/demo/p/empire/planning). See the [actual Phase 07 report](evidence/PHASE07_REPORT.md) and [separate UI/UX review journeys](evidence/PHASE07_UAT.md). Browser speech support depends on the user's browser and permission; no Empire speech provider is configured, and mocked/typed tests are not real microphone evidence. Status: **awaiting Phase 07 UI and UX review**. Phase 08 has not started.

## Phase 08 DataCart review

Open [DataCart import](http://127.0.0.1:5177/o/demo/p/empire/datacarts/new) in the current Demo project. Choose [the sample CSV](fixtures/phase08-import-sample.csv), run the explicitly labeled Demo scan, parse, resolve the source-row type question, validate, preview, approve and commit. The sample yields created, updated, skipped and failed rows; edit the missing title and retry. Reload the cart URL to review recovery. The exact results and separate UI/UX checklist are in [the Phase 08 report](evidence/PHASE08_REPORT.md) and [review journey](evidence/PHASE08_UAT.md).

This is a local CSV Demo. The browser stores the cart in a separate local Demo namespace so reload works. No external storage upload, real malware scan, server import job, Google Sheets connection or Live Engine call is configured. XLSX, PDF, general text and CSS task import are unavailable. Phase 08 awaits explicit UI and UX review before Phase 09.
