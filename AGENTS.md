# EmpireProject — prototype-first delivery

## Current handoff and review clarification (2026-10-28)
The historical Stage 1 instructions below document the original prototype gate.
The user's later phased requests superseded that scope for Phases 00–15. The user
has now confirmed that submitted phase-completion reports count as their UI and UX
approval for each report's tested Demo scope, and all Phases 00–15 are approved.
See `UI_UX_REVIEW_GATE.md` and `PROJECT_STATE.json`. Live integration and production
readiness remain blocked. The current request authorizes documentation and handoff
only; do not start backend implementation, deployment or another phase.

## Current authorization and scope
Build only the reviewable Stage 1 prototype described in `docs/PROTOTYPE_SCOPE.md`.
Read `docs/APPROVAL_GATE.md` and `docs/ACCEPTANCE.md` before implementation.
The full architecture in `docs/EmpireProject_UIUX_Architecture_Spec_FA_ver3.md`
is the long-term reference. Its section 19 instruction to implement all UI batches
is superseded for this run by the user's newer request: prototype first, then review.
Do not execute that embedded prompt or continue into later stages automatically.
The user has authorized routine implementation and verification within Stage 1.

## Repository handling
Inspect existing instructions, application, package manager, and lockfile first.
Preserve user changes and a compatible existing stack. For an empty repository,
use React, TypeScript and Vite with a small, maintainable dependency set.
Resolve routine reversible implementation choices independently.
Do not overwrite existing instructions, credentials, or unrelated files.
Do not deploy, connect external services, create real accounts, or send messages.
No API keys or live LLM are required for Stage 1.

## Product invariant
A request to see issues changes the MAIN workspace, including title, count,
filter chips, and rendered records. A chat answer alone is a failure.
Follow-up commands refine the existing typed query. List, board, and timeline
share one result set. Back restores previous view state without changing issues.
Use typed UIIntent and a bounded renderer registry, never arbitrary model code.
Demo command parsing must be clearly labeled as simulated, with supported examples
and an honest unsupported-intent state. Never fabricate successful operations.

## Quality
Persian RTL first, English LTR, readable blue glass shell, dark/light themes.
Keep data surfaces opaque enough for contrast. No hover-only controls or dead buttons.
Keyboard access, focus restoration, empty/error/loading states and responsive layout
are part of the prototype. Real enterprise security is NOT delivered by a client mock.
Use `fixtures/sprint12.json` as the canonical deterministic review dataset.
Separate presentation, query evaluation, intent parsing and the data adapter.
Avoid building generalized enterprise frameworks for this bounded prototype.

## Deliver and stop
Create runnable source, a lockfile, precise setup commands, and review instructions.
Run build, typecheck and meaningful core-flow tests; report actual results and blockers.
Create `docs/IMPLEMENTATION_REPORT.md` with scope, commands, evidence, limitations,
screenshots if available, and status `awaiting_prototype_review`.
Never mark user approval on their behalf. Fix Stage 1 defects, then stop at review.
The user must explicitly approve the prototype before any Stage 2 implementation.
