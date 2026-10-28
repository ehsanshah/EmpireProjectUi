# Phase 15 UI-only handoff

## Reproduce locally

Prerequisites: Node 22, npm, Google Chrome for the configured Playwright channel.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5182
npm run typecheck
npm test
npm run build
npm run test:e2e -- --workers=2
```

The review entry is `http://127.0.0.1:5182/o/demo/projects?design=current`. The canonical local fixture is `fixtures/sprint12.json` (14 total, 8 remaining, 2 blocked remaining). `fixtures/sprint12-historical-acceptance.json` is a separate historical 12/6/2 acceptance fixture. Counts are computed from workset metadata. For a clean comparison, use a fresh browser profile; do not clear a user's existing local changes without asking.

```sh
docker build -t empire-ui-phase15:local .
docker run --rm --name empire-ui-phase15-review -p 127.0.0.1:5183:8080 empire-ui-phase15:local
```

The UI-only image serves `GET /healthz`, static assets and SPA deep links. Its `/api/` route deliberately returns 503. It has no Engine, BFF, storage or speech service. `.env.example` contains only the Demo build mode. Never put credentials in `VITE_*`: Vite bundles those values into browser assets.

## Routes and capability boundary

| Route | UI source | Demo capability | Live state |
|---|---|---|---|
| `/o/demo/projects`, `/my-work`, `/inbox`, `/search`, `/activity` | `src/Phase14Workspace.tsx`, `src/phase14Domain.ts`, `src/routes.ts` | Local authorized lens, Inbox polling and context navigation | Organization contract, IAM and staging blocked |
| `/o/demo/p/:project/work` | `src/WorkList.tsx`, `src/KanbanBoard.tsx`, `src/TimelineView.tsx`, `src/core/demoClient.ts` | Workset, forms, Board, WIP, ranks, receipts | Engine work-item/board contracts unverified |
| `/o/demo/p/:project/calendar`, `/workflow`, `/planning` | `src/CalendarView.tsx`, `src/WorkFlow.tsx`, `src/SprintWorkspace.tsx` | Separate scheduling adapter, dependency graph and Sprint simulation | Schedule/Sprint APIs missing |
| `/o/demo/p/:project/datacarts/:id`, `/intake`, `/agents` | `src/DataCartWorkspace.tsx`, `src/IntakePlanWorkspace.tsx`, `src/AgentRunWorkspace.tsx` | Local CSV import, plan and simulated Run/Review | Storage, scan, Agent service and policy integration blocked |
| `/o/demo/p/:project/gallery`, `/knowledge`, `/reports`, `/releases` | `src/Phase11Workspace.tsx`, `src/Phase12Workspace.tsx` | Synthetic artifact lineage, scoped text sources, synthetic report/release evidence | Storage, indexing, historical events and delivery API blocked |
| `/o/demo/p/:project/people`, `/settings`, `/overview` | `src/Phase13Workspace.tsx`, `src/BoardSettingsEditor.tsx`, `src/Phase12Workspace.tsx` | Versioned Demo policy/settings and actionable signals | Membership, migration, probe and server grants blocked |

`src/routes.ts` is the route source of truth. `src/core/contracts.ts` is the typed boundary; `src/core/demoClient.ts` is a local simulation. `src/core/httpClient.ts` has proposed same-origin shapes but `createLiveCoreClient()` fails closed until actual contract reconciliation. `FEATURE_COVERAGE.csv`, `UIAPI_TRACEABILITY.csv` and `contracts/ENGINE_MAPPING.csv` carry Phase 15 classification columns; the final snapshots are in `evidence/PHASE15_*_MATRIX.csv`.

## Hosting and security topology needed for Live

- Serve the SPA and BFF on the same origin. Preserve `/o/...` deep links through the SPA fallback, and route `/api/session` and `/api/ep/v1/...` to the authenticated BFF rather than the UI container's 503 stub. The BFF must own cookie session, logout, Origin/CSRF checks and authorized scope; no bearer token belongs in browser source or environment variables.
- Reconcile actual operation IDs, envelopes, ETags, idempotency retention, 202 operations, receipts, event replay/reset and permission revisions with the Engine before enabling `VITE_CORE_MODE=live`. The proposed mapping is not a verified wire contract. Provide non-production least-privilege identities, staging URL and adversarial fixtures.
- Review `deployment/nginx.conf` CSP against authorized preview, speech and storage origins. Current policy allows same-origin scripts/connect, local fonts, and isolated `blob:` frames; no external source is allowed. Text previews remain inert. Do not weaken `script-src` for imported content. A BFF must issue fresh scoped access tickets and apply permission checks to snippets, counts and exports.
- Redact credentials, transcript content, imported rows, signed URLs and restricted source snippets from telemetry. Correlate only approved request IDs, operation IDs and receipt IDs. The Demo's local traces and screenshots are not an audit log or server authorization evidence.

## Live integration backlog and owners

| Blocker | Required input and exit evidence | Owner |
|---|---|---|
| Actual API and event contracts missing | Current OpenAPI/AsyncAPI or equivalent, operation IDs, response/Problem examples, ETag, receipt, idempotency and stream replay rules; generated client plus contract tests | Backend/Engine |
| No authorized staging | URL/reachability, BFF cookie session, CSRF, least-privilege identities and revoke/expiry fixtures; real non-production journey tests | DevOps, IAM/Security, Backend |
| Timed scheduling and Sprint actions | ScheduleBlock semantics, timezone/DST, preview/write/recovery and Sprint lifecycle contracts | Backend/Product |
| Storage/import/Knowledge | Ticket, checksum, scan, parse/import, source-version access and index contracts; authorized negative tests | Storage, Import, Knowledge, Security |
| AI/voice/Agents | Provider and consent policy, clarification/approval wire schemas, speech/transcript provenance, probe/grant/Run/Review operations | AI, Agent platform, IAM |
| Reporting/release and advanced extensions | Historical event source, frozen export policy, delivery receipts, org aggregation and explicitly supported advanced-metric inputs | Reporting, Release, Product |
| Accessibility/performance sign-off | Manual screen-reader UAT, device/network budgets, real tenant skew and production-like datasets | Product/Accessibility, QA, Performance |

The UI demonstration can be reviewed. Contract readiness and Live integration remain blocked; no production deployment or real Agent execution is implied.
