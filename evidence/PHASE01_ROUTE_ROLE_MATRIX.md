# Phase 01 local route, role and component inventory

The current app is a local Demo. `src/routes.ts` encodes the currently implemented project views under `/o/demo/p/:projectId/…`; `demo` is a fixed local scope marker, not an authenticated organization. Loading a known project route restores its project and view, and browser Back restores the prior in-memory navigation snapshot. Project IDs and issues are fixture data. Unknown project paths are not interpreted as authorized access.

| Local route | Working surface | Current Demo access | Live role/capability meaning |
|---|---|---|---|
| `/o/demo/p/:id/work?view=list` | Work List and issue drawer | All locally listed projects | Unverified; server `allowed_actions` required |
| `/o/demo/p/:id/work?view=board` | Board/Kanban | All locally listed projects | Unverified; transition/WIP policy must be server owned |
| `/o/demo/p/:id/work?view=timeline` | Timeline | All locally listed projects | Unverified; workset/window accounting absent |
| `/o/demo/p/:id/calendar` | Calendar | All locally listed projects | Unverified; ScheduleBlock is a local extension |
| `/o/demo/p/:id/workflow` | Work Flow | Payment graph for PAY; local issue list elsewhere | Unverified; no Live graph/receipts |
| `/o/demo/p/:id/investigation` | Risk investigation | Local fixture | Unverified; no server evidence/citations |

The visible rail uses `demoNavigationCapabilities` in `src/routes.ts`; it includes only working Demo destinations. Backlog, Inbox, Agents, Knowledge and More are not rendered as dead buttons. They remain later-phase features. The app has no production role lens or permission model, so Owner/PM, Scrum Master, Developer, Reviewer, Admin and Viewer cannot be claimed verified. The route exposes no tenant security boundary.

| Reusable component / seam | Source | Present role |
|---|---|---|
| Shell, command dock and contextual assistant | `src/App.tsx`, `src/styles.css`, `src/glass-preview.css` | Shared layout, language/theme and local navigation |
| Project browser and resize | `src/ProjectSwitcher.tsx`, `src/projectSwitcher.css`, `src/projects.ts` | Local directory/search/pinned/recent, scoped project switch |
| Clarification card | `src/ClarificationCard.tsx`, `src/clarification.css` | Numbered options, Other/direct reply, required/optional Skip and editable local answer; no command/continuation |
| Route adapter | `src/routes.ts` | Local Demo URL encode/decode and nav capability display flags |
| Work renderer registry | `src/Views.tsx`, `src/domain.ts` | Bounded List/Board/Timeline shared query state |
| Drawers | `src/Modal.tsx` | Dialog focus containment and restoration |

Phase 02 must replace local capability/role assumptions with an actual BFF/session and typed contract, if supplied. No actual Engine API was inspected or called in Phase 01.
