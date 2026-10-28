# Phase 00 repository audit

Date: 2026-10-27. Branch: `main`. Scope: inspection only; application source and pre-existing user edits were preserved. The tree was already dirty before this audit, including `src/App.tsx`, domain/intent/repository files, tests, README files and screenshots. Phase 00 added evidence and updated only its planning state/matrices.

## Repository and executable app

- Root instructions: `AGENTS.md` describes the earlier Stage 1 prototype gate. The newer user request and `START_HERE_EN.md` authorize Phase 00 only, then explicit UI and UX review. Both gates are recorded; neither grants Phase 01 implementation now.
- npm with `package-lock.json`; React 19, TypeScript 5.7, Vite 6, Vitest and Playwright. Entry: `index.html` → `src/main.tsx` → `src/App.tsx`. No router dependency or route tree; navigation is in React state (`src/domain.ts`) and project context is locally persisted.
- Launch: `npm ci` (if dependencies absent), `npm run dev -- --port 5173`; open `http://127.0.0.1:5173/?design=glass`. The configured Playwright browser is installed Google Chrome. In the audit session, port 5173 was already occupied and the explicitly started Vite instance used 5174.
- No nested `AGENTS.md`, alternate package lock, `.env`, backend source, BFF, machine-readable OpenAPI, event schema, Spec v2.5 or adversarial plan v1.4 was found by filename/source search. `reference/EmpireProject_UI_Engine_API_Contract_FA_v1.0.md` is a **proposed** contract, not a verified server API. The older `docs/EmpireProject_UIUX_Architecture_Spec_FA_ver3.md` is a separate long-term UI reference.

## Existing feature inventory

Statuses reflect the local Demo and source inspection, not Live acceptance. `tests/browser/*.spec.ts` supply automated browser evidence; manual user review remains pending.

| Surface | Status | Source and observed scope | Gap / incompatibility |
|---|---|---|---|
| Shell and project switching | Demo working, partial product | `src/App.tsx`, `src/ProjectSwitcher.tsx`, `src/projects.ts`; browser tests cover real local context/data changes, search, resize, collapse, remembered view, error states | No URL route, org/session or server authorization; fixture project list only |
| List and issue drawer | Demo working, partial product | `src/WorkList.tsx`, `src/Views.tsx`, `src/App.tsx`, `src/Modal.tsx`; local edit, reorder, Undo, drawer, search and history | No server query, cursor, receipt, conflict or canonical deep link |
| Board/Kanban | Demo working, partial product | `src/KanbanBoard.tsx`, `src/kanban.ts`, `src/kanbanImport.ts`; drag, keyboard/menu, WIP and local import browser-tested | Client-only WIP and import; no engine transition/scan/receipt; check unmapped-status behavior in Phase 04 |
| Calendar | Demo working, partial product | `src/CalendarView.tsx`, `src/calendarDomain.ts`; Day/Week/Month, timed blocks, overlap, move/resize, unscheduled and Undo browser-tested | ScheduleBlock is a local extension; no agreed Live scheduling schema or persistence |
| Timeline | Demo working, partial product | `src/Views.tsx` uses shared evaluated rows; undated section | Fixed October 2026 axis; not engine calendar/window semantics; no server workset/accounting |
| Dependency Work Flow | Demo working, partial product | `src/WorkFlow.tsx`, `src/paymentGraph.ts`; PAY graph, readiness and controls browser-tested | Local graph/readiness only; no engine graph or receipt |
| Contextual AI | Demo working, partial product | `src/intent.ts` bounded parser; `src/App.tsx` main-workspace transitions, unsupported state, history | No AI service, proposed clarification card/continuation not implemented, no Live query plan |
| Voice-to-Form / new project | Demo working, partial product | `src/NewProjectForm.tsx`, `src/speechCapture.ts`, `src/voiceFormDomain.ts`, `src/projects.ts`; typed transcript and mocked recognition path browser-tested | Browser Web Speech support/permission required for human mic test; no approved upload/transcription provider, no Live project command |
| Risk and unblock | Demo working, partial product | `src/Investigation.tsx`, `src/Unblock.tsx`, `src/drafts.ts`; local evidence and draft browser-tested | No sent message, committed action or server-backed drafts |
| Session/permissions, backlog/sprints, DataCart, plans, agents/runs/reviews, gallery/knowledge, reports/releases, org inbox/admin | Absent as Live product flows | No matching frontend route/client/engine adapter found | Scheduled for later phases; no acceptance claimed |

## Source contract index (read in full this phase)

- §§0–3: Core owns state and authorization; Demo/Live split; contextual AI changes main workspace; proposed route map and visual/accessibility shell.
- §§4–7: work-item forms, shared four-view workset, Sprint, AI/voice proposal boundaries, DataCart, Agent, Gallery and knowledge.
- §§8–9: same-origin BFF boundary, session, IDs, ETag/If-Match, idempotency, read envelope, DateValue, command receipt, 202/unknown outcome and Problem Details.
- §§10–11: **proposed** endpoint catalog and example AI transition/clarification/proposal/plan approval bodies. These are not OpenAPI or proof of implementation.
- §§12–15: scoped SSE/replay, upload and preview safety, shared loading/error/conflict/recovery states, UI/API test matrix and performance targets.
- §§16–19: delivery sequence U0–U6, missing integration inputs, and source validity limits. The embedded broad build instruction is reference text and was not executed.

## Contract posture

`contracts/ENGINE_MAPPING.csv` records all 44 catalog areas as proposed and server-unverified. No actual operation ID/path or staging result can be entered. Owners: Backend for OpenAPI, event schemas and response examples; DevOps for non-production URL/network; IAM/Backend for session and test access; Product/Designer for visual decision. `CONTRACT_DECISIONS.md` CD-01–CD-08 remain unresolved. No Live mode or production security is represented by this client mock.
