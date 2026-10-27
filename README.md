# EmpireProject — prototype redesign

**Selected design:** the glass appearance is the default at [localhost](http://127.0.0.1:5173/?design=glass). The previous navy appearance remains accessible using **Previous design** or `?design=current`. The Kanban addition and revised glass treatment are awaiting user review; this does not authorize Stage 2.

**Reorder work:** in List, choose **Manual priority** (the default), then drag the ⋮⋮ handle beside an issue and drop above or below another row. The insertion line shows placement. The order saves locally and supports Undo. Clicking the handle exposes up/down controls; Alt+↑/↓ also works while the handle is focused. High/Normal labels do not change. Filtered reordering permutes only the visible slots; hidden issues keep their positions. Grouped lists reorder within the same assignee group. Other sorts disable dragging until Manual priority is selected. Board/Timeline share the saved manual order.

English/LTR and dark blue glass are now the defaults. Persian/RTL and a light theme remain available. This is a local, deterministic prototype, awaiting visual and interaction review. No backend, account connection or live AI is used.

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

Status: **awaiting_prototype_review**. No Stage 2 work is authorized or implemented.

## Work Flow review

Open **Work Flow** in the left menu, or the compact Work Flow button on mobile. This separate payment-release demo shows PAY-38 → PAY-42/PAY-46 → PAY-51. Click a connector for its rule, use **Show blockers**, pan/zoom/**Fit view**, or open a card for details. Change PAY-42 and PAY-46 to **Done** in their drawers to make PAY-51 **Ready**; **Reset demo** restores the four payment issues. Try `Why is PAY-51 waiting?` in the command input and watch the main graph change. See [implementation report](docs/IMPLEMENTATION_REPORT.md) for verified behavior and screenshots.
