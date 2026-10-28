# Phase 09 — actual implementation report

Date: 2026-10-27–28. User authorized Phase 09 after explicitly approving Phase 08 UI/UX for tested local CSV Demo flows only. Implementation status: `awaiting_ui_ux_review`. Demo: `PASS` for the tested local objective/idea/link and plan paths; ready-file references require a Phase 08 local Demo scan-ready source; voice references remain unresolved. Live: `BLOCKED`. User acceptance of tested Phase 09 local Demo UI and UX: explicitly approved on 2026-10-28; this does not verify actual agent execution or any Live integration.

## Outcome and source changes

- [IntakePlanWorkspace.tsx](../src/IntakePlanWorkspace.tsx) adds project-scoped Intake list/detail, contextual triage, the existing numbered clarification card, task DAG editing, simulation, before/after comparison, human decision, and a separate execution-request control. Objective, idea, link, ready-file and voice-reference kinds are visible. A ready-file reference can only bind to the latest Phase 08 local Demo scan-ready DataCart source, then needs explicit scope clarification. Voice cannot be made ready by typing a claim.
- [intakePlanDomain.ts](../src/intakePlanDomain.ts) adds versioned Demo Intake and ExecutionPlan records, source revisions, deterministic Demo fingerprint/ETag, cycle and missing-field checks, approval scope and expiry, request-changes/rejection, idempotency, receipts, and a simulated request result. No agent, Run or completed work is created. The adapter is mounted on the shared [DemoCoreClient](../src/core/demoClient.ts); Live cannot silently use it.
- [routes.ts](../src/routes.ts), [domain.ts](../src/domain.ts), [App.tsx](../src/App.tsx) and [phase09.css](../src/phase09.css) add `/o/demo/p/:project/intake?intake=...`, project navigation, Back/forward, responsive RTL, and an Intake-specific workspace surface. Existing work controls are hidden on Intake. Classic/Light and the initially closed Agent panel remain default.
- [phase09-sample-plan.json](../fixtures/phase09-sample-plan.json) records a concrete illustrative two-task chain. The budget and costs are unknown; the role is unassigned. The current 14-issue fixture and historical 12/6/2 fixture were not changed.
- [PHASE09_INTAKE_PLAN_DECISION.md](../contracts/PHASE09_INTAKE_PLAN_DECISION.md) documents the precise Demo/Live boundary and required backend inputs.

## Run and review

`npm ci` (if dependencies are absent), then `npm run dev -- --port 5178`. The UI was running and returned HTTP 200 at [Phase 09 Demo](http://127.0.0.1:5178/o/demo/p/empire/intake?design=current). The server selected port 5178 because 5177 was already occupied. The seeded Intake is browser-local Demo state; clear localStorage key `empire-phase09-intake-plan-v1:local-demo` to reset just this phase. No API key or external service is needed.

Sample path: open “Improve checkout release readiness” → answer “Checkout web and mobile” → Create execution plan → inspect task-1 → task-2, unknown budget and unavailable Live capability → acknowledge unknown budget → Approve plan → Request execution · Demo simulation. The visible result says `simulated_accepted` and “No agent dispatched.”

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Typecheck | Local source | `npm run typecheck` | PASS | TypeScript exit 0 |
| Build | Local source | `npm run build` | PASS; Vite emitted a nonblocking >500 kB chunk warning | Vite build exit 0 |
| Full unit suite | Local Demo | `npm test` | PASS 84/84 across 18 files on the final source | command output |
| Phase 09 unit | Local Demo | `npm test -- --run tests/phase09.test.ts` | PASS 7/7: clarification gate, local Demo scan-ready file binding, cycles/missing, stale hash/source/policy/task scope, approval invalidation, request changes/rejection, idempotent request after reload | [phase09.test.ts](../tests/phase09.test.ts) |
| Phase 09 Chrome | Local Demo | `npx playwright test tests/browser/phase09.spec.ts --workers=1` | PASS 4/4: main journey, receipt and reload, Back, keyboard, cycle and stale-draft recovery, clarification correction and reload stale-source guard, Persian mobile and closed Agent | [phase09.spec.ts](../tests/browser/phase09.spec.ts) |
| Earlier browser regression | Local Demo | `npx playwright test tests/browser/phase06.spec.ts tests/browser/phase07.spec.ts tests/browser/phase08.spec.ts tests/browser/routes.spec.ts --workers=2` | PASS 12/12 | existing browser specs |
| Desktop/mobile visual | Local Chrome screenshots | Inspected [desktop plan](../docs/screenshots/phase09-plan-desktop.png) and [Persian mobile Intake](../docs/screenshots/phase09-intake-mobile-fa.png) | Readable cards, no observed horizontal clipping; the long plan requires vertical scrolling | screenshot files |
| Live contract/staging | Real Engine | No staging URL, BFF identity or reconciled schemas provided | BLOCKED; no Live command or real agent run attempted | contract decision |

## Findings and limits

The core Phase 09 flow is a local Demo with simulated receipts. The plan fingerprint is deterministic and revision-bound, but not a cryptographic server approval. The approval records selected tasks, source revision, policy revision, budget fields and explicit unknown-budget acknowledgment; a saved material edit or newer source invalidates it. A separate request is idempotent across reload and never implies execution. The sample plan's role is a role label with no assigned person or agent. Unknown costs remain unknown. The simulation reports unavailable Live capability and does not certify permissions, budget sufficiency or delivery. Browser keyboard and mobile checks passed; a real screen-reader audit and Live authorization checks were not performed.

| Gap | Affected capability | Owner/input | Exit evidence |
|---|---|---|---|
| OpenAPI and event/receipt examples for Intake, plan, simulation, approval and execution | Live commands and concurrency | Backend | Reconciled fixture and staging responses |
| BFF session/CSRF identities and approval/execute permissions | Live human gate | IAM/Backend | Allowed/denied authenticated tests |
| Agent membership, capability and Run policy | Real execution | Agent platform/Backend | Nonproduction operation and Run evidence |
| Scanned ready-file and verified transcript reference contracts | File/voice Intake provenance | Storage/Speech/Backend | Authorized source binding and revoke tests |
| Staging URL and network | End-to-end Live verification | DevOps | Reachable environment |

## Contract changes and mapping

The source contract's route inventory and section 11.3 informed the Demo command shape. [PHASE09_INTAKE_PLAN_DECISION.md](../contracts/PHASE09_INTAKE_PLAN_DECISION.md), [ENGINE_MAPPING.csv](../contracts/ENGINE_MAPPING.csv), [FEATURE_COVERAGE.csv](../FEATURE_COVERAGE.csv), [UIAPI_TRACEABILITY.csv](../UIAPI_TRACEABILITY.csv), and [PROJECT_STATE.json](../PROJECT_STATE.json) distinguish tested Demo behavior from proposed/unverified Live routes. No actual Engine receipt was fabricated.

## Separate user approvals

UI review: **approved for tested local Demo**. UX review: **approved for tested local Demo**. Actual user message: “I explicitly approve both the UI and UX of the tested Phase 09 local Demo flows. Preserve all existing Live blockers and unverified capabilities; this approval does not verify actual agent execution.”

## Next phase

Phase 10 is authorized and underway. Actual agent execution and Live integration remain unverified.
