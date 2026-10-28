# Phase 10 — actual implementation report

Date: 2026-10-28. The user explicitly approved both Phase 09 UI and UX for tested local Demo flows, while leaving real agent execution unverified. Implementation status: `accepted`. Demo status: `PASS` for the tested local deterministic path. Live status: `BLOCKED`. Phase 10 user acceptance: explicitly accepted for tested local Demo UI and UX.

## Outcome and source changes

- [agentRunDomain.ts](../src/agentRunDomain.ts) implements project-scoped local Demo membership, connection metadata, simulated readiness probes, plan-bound assignment, versioned Run attempts, waiting-input, pause/resume/cancel, queued operation and receipt reconciliation, simulated artifact revisions, independent review decisions, permissions, idempotency and scoped event notification. It revalidates current plan approval, execution request and Agent readiness before continuing. The adapter persists in browser localStorage, so a reload does not imply cancellation.
- [AgentRunWorkspace.tsx](../src/AgentRunWorkspace.tsx) and [phase10.css](../src/phase10.css) provide Agent readiness, assignment, Run list/detail and Review inbox/detail. The task brief, dependencies, acceptance criteria, tests and DoD are visible. Review shows artifact v1/v2 descriptor comparison, simulated evidence and decision history. Unknown cost and unit are explicit. The existing clarification card handles waiting-input and can close/reopen without losing the question.
- [DemoCoreClient](../src/core/demoClient.ts), [App.tsx](../src/App.tsx), [routes.ts](../src/routes.ts), [domain.ts](../src/domain.ts), [KanbanBoard.tsx](../src/KanbanBoard.tsx) and [Views.tsx](../src/Views.tsx) connect the Demo adapter to project navigation, URL/Back state and Board/drawer Run projections. Run acceptance never changes the issue business status or shipping state.
- [phase09-sample-plan.json](../fixtures/phase09-sample-plan.json) and its local seed label task-1 as an unassigned Agent drafter role and task-2 as an unassigned independent human reviewer role. No identity or budget was invented. Existing saved Phase 09 plans are preserved; a plan without an Agent-role task displays a clear edit/reapprove path.
- The user's selected-sidebar-rectangle defect was fixed in [styles.css](../src/styles.css) by constraining the active navigation button to the sidebar width. The current 14-issue and historical 12/6/2 fixtures remain separate.

## Run and review

Install if needed: `npm ci`. Start: `npm run dev -- --port 5178`. Running UI: [Agent readiness Demo](http://127.0.0.1:5178/o/demo/p/empire/agents?design=current). The app also uses the existing Classic/Light default with the Agent panel closed. The seeded Phase 09 plan is browser-local. To reset only the local Phase 09 and 10 Demo for a fresh journey, remove localStorage keys `empire-phase09-intake-plan-v1:local-demo` and `empire-phase10-agent-runs-v1:local-demo:empire`; this is a manual reviewer action, not an automatic data reset. Existing user changes are untouched.

Concrete journey: Intake & plan → “Improve checkout release readiness” → choose “Checkout web and mobile” → create the two-task sample plan → acknowledge unknown budget → approve task-1 → separately request execution → Agent readiness → simulate a local readiness check → assign task-1 to the existing Hermes Demo membership and an issue → start and reconcile queued operation → answer the waiting question → submit simulated artifact v1 → independent reviewer requests changes → start attempt 2 → submit simulated artifact v2 → independent reviewer accepts. The Run remains not shipped; the issue status is unchanged. No external Agent was dispatched.

## User-requested color correction (2026-10-28)

After the initial Phase 10 delivery, the user requested a consistent, polished color scheme throughout the workspace and direct user control over its accent. The attached video and Board image were inspected as visual references. [COLOR_SYSTEM.md](../docs/COLOR_SYSTEM.md) records the neutral surfaces, curated accent choices, semantic-state rules, keyboard control, screenshots and exact checks. The implementation is in [colorSystem.css](../src/colorSystem.css), [App.tsx](../src/App.tsx) and [main.tsx](../src/main.tsx). Classic/Light, the closed Agent panel and all business behavior remain unchanged. After the user rejected the first subtle pass, the Board cards and List rows received stronger chosen-accent fills and side rails. The user's next correction placed matching rails on both sides of each Board card and lifted drag preview; this was verified in LTR and RTL. A duplicate React sibling key was also corrected after a regression test exposed lost form conflict feedback. The user approved the tested Phase 10 local Demo UI/UX before Phase 11; Live blockers remain.

## Verification

Reverified on 2026-10-28 after the latest two-sided Board rail correction: `npm test` passed 90/90, `npm run build` passed, and the combined Phase 09/10, Board and sidebar browser run passed 10/10. The existing review server returned HTTP 200 at port 5178. These are local Demo results; no Live Engine test ran.

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Typecheck | Local source | `npm run typecheck` | PASS | TypeScript exit 0 |
| Build | Local source | `npm run build` | PASS; Vite warned about one chunk >500 kB | Vite exit 0 |
| Full unit suite | Local Demo | `npm test` | PASS 90/90 across 19 files | command output |
| Phase 10 unit | Local Demo | `npm test -- --run tests/phase10.test.ts` | PASS 6/6: unready/missing capability, stale approval, duplicate assignment, operation/waiting/cancel states, rejected/revised/accepted history, self-review/permission loss and scoped events | [phase10.test.ts](../tests/phase10.test.ts) |
| Browser regression | Local Chrome Demo | `npx playwright test tests/browser/phase10.spec.ts tests/browser/sidebarBounds.spec.ts tests/browser/phase09.spec.ts tests/browser/phase04.spec.ts --workers=2` | PASS 10/10: full Phase 10 path, Board/drawer consistency, Persian mobile, Phase 09, Board validation and sidebar bounds | [phase10.spec.ts](../tests/browser/phase10.spec.ts), [sidebarBounds.spec.ts](../tests/browser/sidebarBounds.spec.ts) |
| Visual inspection | Local Chrome screenshots | Opened generated screenshots | Selected sidebar button fits; accepted review and Persian mobile were readable; no observed clipping in inspected views | [review](../docs/screenshots/phase10-review-accepted.png), [mobile](../docs/screenshots/phase10-mobile-fa.png), [sidebar](../docs/screenshots/phase10-sidebar-active-classic.png) |
| Color system browser | Local Chrome Demo | `npx playwright test tests/browser/colorSystem.spec.ts --workers=1` | PASS 5/5: persistence, keyboard focus, ten workspace routes, Persian RTL mobile bounds, visible Board/List work colors and Dark/Light | [colorSystem.spec.ts](../tests/browser/colorSystem.spec.ts) |
| Color and work regressions after stronger tint | Local Chrome Demo | `npx playwright test tests/browser/colorSystem.spec.ts tests/browser/phase03.spec.ts tests/browser/phase04.spec.ts --grep-invert 'review captures\|full-page deep link\|requires a transition field' --workers=2` | PASS 12/12: color, workset counts, Board WIP and keyboard move, form version conflict and retry | Playwright exit 0 |
| Phase 10 and sidebar regressions | Local Chrome Demo | `npx playwright test tests/browser/phase10.spec.ts tests/browser/sidebarBounds.spec.ts --workers=2` | PASS 3/3: Run/review path, Persian mobile and sidebar bounds | Playwright exit 0 |
| Symmetric Board rails | Local Chrome Demo | `npx playwright test tests/browser/colorSystem.spec.ts tests/browser/phase04.spec.ts --grep-invert 'requires a transition field' --workers=2` | PASS 7/7: both rails compute to 5 px in English LTR and Persian RTL, Board WIP and keyboard move unchanged | Playwright exit 0 and inspected screenshots |
| Running UI | Local HTTP | `curl` at port 5178 | HTTP 200 after the correction | Existing Vite server |
| Contract fixture/staging | Live Engine | No actual schemas/staging/identities supplied | BLOCKED; no real probe, dispatch or review | [contract decision](../contracts/PHASE10_AGENT_RUN_REVIEW_DECISION.md) |

## Findings and limits

The Phase 10 path is a deterministic local simulation. A configured connector is not presented as a passed real probe. The UI distinguishes acknowledgement, running, submitted, accepted and not shipped. Cancellation requested remains separate from confirmed cancellation. The Review Inbox uses a local explicit permission fixture; it rejects self-approval and current-grant loss. Original artifact and review decisions remain after resubmission. The simulated v1/v2 descriptor diff is not a real artifact diff, and simulated test evidence does not assert tests by an Agent. No real cost, role identity, budget, artifact or successful probe was invented. The full browser path passed in English, and Persian mobile was inspected; a real screen-reader audit, network disconnect in a Live session and real responsive device touch tests were not performed.

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| Actual OpenAPI and status/operation/SSE/receipt examples | Live assignment, Run controls and review | Backend/Agent platform | Demo UI and typed adapter complete | Reconciled response fixtures and staging tests |
| Real API/MCP connection, credential grant and probe evidence | Agent readiness | Agent platform/IAM | Display states complete | Authorized nonproduction probe |
| Independent reviewer policy and test principals | Live review authorization | IAM/Backend | Demo policy fixture complete | Authorized/denied producer/reviewer tests |
| Artifact metadata/access tickets/test evidence provenance | Real artifact review | Storage/Backend | Simulated descriptors only | Versioned artifact and diff access tests |
| Staging BFF session/CSRF/network | Live end-to-end | DevOps/Backend/IAM | Local Demo continues | Reachable staging and authenticated flow |

## Contract changes and mapping

[PHASE10_AGENT_RUN_REVIEW_DECISION.md](../contracts/PHASE10_AGENT_RUN_REVIEW_DECISION.md) records the proposed versus verified boundary. [ENGINE_MAPPING.csv](../contracts/ENGINE_MAPPING.csv), [FEATURE_COVERAGE.csv](../FEATURE_COVERAGE.csv), [UIAPI_TRACEABILITY.csv](../UIAPI_TRACEABILITY.csv) and [PROJECT_STATE.json](../PROJECT_STATE.json) distinguish local Demo evidence from blocked Live operation. No Engine receipt or external execution is claimed.

## Separate user approvals

UI review: **approved**. UX review: **approved**. User evidence: “I explicitly approve both the UI and UX of the tested Phase 10 local Demo flows. This does not verify real Agent execution, API/MCP probes, authorization enforcement or Live integration. Preserve all documented blockers.”

## Next phase

Phase 11 was explicitly requested after the Phase 10 Demo UI/UX approval. Live Phase 10 integration remains blocked.
