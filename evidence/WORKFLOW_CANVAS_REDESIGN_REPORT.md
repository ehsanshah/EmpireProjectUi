# Workflow canvas redesign

The rejected small, nested workflow panel is replaced on the Workflow settings
page by a full-width visual editor. Selecting a status opens its properties;
selecting a named connection opens that transition's properties. The properties
panel does not occupy any space until something is selected.

## Source and delivery boundary

- Base: `4685d0acf20c44a74a3b5506d0c157bd240c9cf4` from `ehsanshah/EmpireProjectUi`.
- Branch: `fix/workflow-canvas-redesign`.
- The local workflow editor shown in the owner's screenshot and reported
  recent I01-C changes are absent from this fetched main snapshot. It has 135 baseline unit tests, not the 148 reported
  for the owner's Mac checkout. Results below belong to this exact snapshot.
- No files on the owner's Mac, no port 5192 application, Jira records, Engine
  services, or production deployment were modified by this change.
- Apply the branch with normal Git review/merge. Preserve local changes and
  resolve the `Phase13Workspace.tsx` integration against the actual checkout;
  replace its old workflow renderer rather than mounting two renderers.

## Implemented behavior

| Item | Status | Evidence |
| --- | --- | --- |
| Large canvas, readable nodes, staircase placement, directed paths | ✅ COMPLETE | `src/WorkflowDesigner.tsx`, `src/workflowDesigner.css` |
| Conditional status/transition inspector; explicit removal with Undo | ✅ COMPLETE | Browser edit and restricted-user cases |
| Named action captions with canonical ID preservation | ✅ COMPLETE | Existing transition IDs retained when names/fields are edited |
| Connection handles: drag, click-source-then-destination, keyboard/mobile form | ✅ COMPLETE | Dragged-handle browser case |
| Layout-only arrangement and project/principal-scoped coordinate persistence | ✅ COMPLETE | Unit preservation and browser movement/reload cases |
| Preserve exact 28-transition graph through arrangement, save, publish, reload | ✅ COMPLETE | Independent 28-ID set comparison in browser suite |
| Large view, Escape, focus return, short-screen Persian/Arabic/Dark layouts | ✅ COMPLETE | Browser cases and screenshots |
| Apply branch to owner's current Mac implementation | ⛔ BLOCKED | Mac filesystem is outside this execution environment |
| Engine/identity-backed publication or authorization verification | ⛔ BLOCKED | Existing Live/runtime wiring remains outside this change |

### Graph preservation and universal shortcuts

The designer reads the supplied configuration. It does not automatically
replace a graph, load a sample flow, delete edges, or normalize the graph to nine
transitions. `Arrange layout` changes coordinates only and never calls the
configuration mutation callback. Layout coordinates are separate UI preferences;
they do not change approval hashes, workflow rules, task statuses or Board maps.

For dense graphs, an `All 5` incoming shortcut represents the exact five
equivalent transitions from the other five statuses. It is shown only when every
other source exists exactly once and all non-ID/source/destination properties
are equivalent. Unknown rule fields are significant. Selecting the shortcut
lists its exact original transitions. Existing consecutive paths are also drawn
for orientation, like the reference; this does not create duplicate actions.
`Show every individual transition` expands the rendering without changing data.
Dense individual-mode captions appear on hover/focus or selection to prevent
overlapping labels. All individual captions remain keyboard accessible.

Editing an existing source/destination pair selects its existing action; it
never toggles/deletes it. Removal is a separate two-step action. New connections
use new IDs. Named actions retain their existing IDs and required-field arrays.
The optional `WorkflowTransition.name` is Demo presentation metadata, not a claim
that a new Engine contract has been reconciled.

The existing settings draft, validation, approval and publication commands are
reused. Workflow graph edits stay unsaved until `Save draft revision`. The
Modular settings tab retains its previous advanced form controls. The Workflow
tab hides those duplicate forms while keeping draft/publication controls below
the canvas. Server-side authorization and arbitrary rule editors are not added.

## Verification

Environment: Linux, Node 24.22.1, TypeScript 5.7.3, React 19.3.1,
Playwright 1.64.1, isolated headless Chromium 153 from `@sparticuz/chromium`.
The standard Chromium download failed in this environment; the test-only npm
binary was used instead. This is not the owner's connected Chrome or a staging
test. Runtime executable/library paths were supplied through environment variables
to the checked-in `playwright.workflow.config.ts`; its full 14-case run passed.

- `npm ci --no-audit --no-fund`: passed.
- `npm test`: **142/142 passed**, 28 files (135 baseline + 7 new unit tests).
- `npm run build`: passed, including TypeScript. Vite still reports the large
  bundle advisory; bundle splitting was not part of this focused correction.
- Focused workflow/People/settings/Board browser suite: **14/14 passed**
  (8 new designer journeys + 6 existing Phase 13/Board regressions).
- `git diff --check`: passed.
- Full application browser suite, real Engine/identity/staging: not run.

Earlier iterations caught focus restoration after closing the portal and an SVG
selector affected by transition title elements. Both were fixed and the entire
14-case focused browser suite passed again. An initial environment-only test
run lacked a reachable dev server; subsequent runs start it inside Playwright.

### Standard reproduction

```bash
npm ci
npx playwright install chromium
npm test
npm run build
npx playwright test --config=playwright.workflow.config.ts
npm run dev -- --port 5188
```

Then open `/o/demo/p/payment/settings?design=current&section=workflow` on that
local server. The test config also accepts `PLAYWRIGHT_CHROMIUM_EXECUTABLE` and
space-separated `PLAYWRIGHT_CHROMIUM_ARGS` for a preinstalled CI test binary.

## Visual evidence

- `docs/screenshots/workflow-redesign-large.png`: full canvas, no empty inspector.
- `docs/screenshots/workflow-redesign-canvas.png`: integration in project settings.
- `docs/screenshots/workflow-redesign-connections.png`: individual path rendering.
- `docs/screenshots/workflow-redesign-mobile-fa.png`: short-screen Persian properties.
- `docs/screenshots/workflow-redesign-mobile-ar-dark.png`: Arabic/Dark large view.

These are actual browser screenshots of the implementation, not mockups.
See `WORKFLOW_CANVAS_REDESIGN_UAT.md` for review steps.

## Delivery status

The implementation was initially committed locally. Automatic approval review
blocked the initial push because the redesign request did not explicitly authorize
publishing source and artifacts to GitHub. The user subsequently explicitly
authorized sending this branch to `ehsanshah/EmpireProjectUi` and creating a PR.
The Git CLI has no authentication in this environment; delivery uses the
authenticated GitHub connection. See the resulting PR for remote delivery status.
No force push, merge to main, local Mac modification or deployment is authorized
or performed by this delivery step.
