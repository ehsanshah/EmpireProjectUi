# EmpireProject UI handoff — approved local Demo

**Approval recorded 2026-10-28.** The user explicitly approved the final UI and UX of the Phase 15 **local Demo**. This is an acceptance of the reviewed UI, not of Live Engine integration or production readiness. No deployment or backend implementation is part of this handoff.

## Reproducible reviewed revision

- Reviewed application source: Git commit `df57ad77b0111926ebb4bc90d598b65395deee7b` on `main`, available at [GitHub](https://github.com/ehsanshah/EmpireProjectUi/commit/df57ad77b0111926ebb4bc90d598b65395deee7b).
- The working tree was clean (`## main...origin/main`) when the final approval was recorded; there were **no uncommitted application changes** in the reviewed revision. This document, the integration backlog and acceptance-record updates are post-approval handoff metadata. The final local handoff commit, if present, can be read with `git rev-parse HEAD`; compare it to the reviewed source commit with `git diff df57ad77b0111926ebb4bc90d598b65395deee7b..HEAD --stat`.
- The reviewed source includes `package-lock.json`, `fixtures/sprint12.json` (current 14-issue fixture) and the separate `fixtures/sprint12-historical-acceptance.json` (historical 12/6/2 fixture). Counts in the UI derive from workset metadata.
- Source of truth for implementation and evidence: `evidence/PHASE15_REPORT.md`, `evidence/PHASE15_UAT.md`, `evidence/FINAL_UI_STATUS.md`, `FEATURE_COVERAGE.csv`, `UIAPI_TRACEABILITY.csv` and `contracts/ENGINE_MAPPING.csv`. The detailed prior run instructions are in `docs/PHASE15_HANDOFF.md`.

## Local startup and checks

Prerequisites: Node.js 22, npm, and Google Chrome for Playwright browser tests. Run from this repository root:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5182
```

Open [Project directory](http://127.0.0.1:5182/o/demo/projects?design=current) or [Store checkout](http://127.0.0.1:5182/o/demo/p/empire/work?design=current&view=list). If port 5182 is occupied, Vite chooses another port; use the `Local:` URL printed in the terminal (port 5184 in this handoff run). Add `--strictPort` when the chosen port must be exact. Stop Vite with `Ctrl-C`. The application defaults to Classic design, Light theme and a closed Agent panel. The `design=current` URL value is the existing route token for the Classic design.

In a separate terminal, the exact verification commands are:

```sh
npm run typecheck
npm test
npm run build
npm run test:e2e -- --workers=2
```

The final Phase 15 evidence records 125/125 unit tests and 101/101 Chrome tests passing, plus a successful build and UI-only Docker smoke check. Those are earlier executed results, not a claim of a new Live test in this handoff.

## UI-only Docker run

```sh
docker build -t empire-ui-phase15:local .
docker run --rm --name empire-ui-phase15-review -p 127.0.0.1:5183:8080 empire-ui-phase15:local
```

Open [Docker review UI](http://127.0.0.1:5183/o/demo/projects?design=current). `GET /healthz` should return 200, and SPA deep links should load. `/api/` deliberately returns 503. Stop the foreground container with `Ctrl-C`. This image serves a Demo UI only; it contains no Engine, BFF, storage, speech service or production deployment. `.env.example` sets `VITE_CORE_MODE=demo`; do not put secrets in `VITE_*` variables.

## Demo reset and fixture isolation

1. For an **issue-focused reset**, use the sidebar **Reset issue data** button. It restores seed issues and selected schedule, Sprint, release, Board and navigation Demo state. It does **not** erase every saved local Demo object (for example all created projects, Knowledge sources, versioned settings or Inbox state). It changes local Demo data; do not use it when you need to preserve those edits.
2. For a **fully clean review without affecting the existing profile**, open the review URL in a fresh browser profile or private window. This gives the canonical fixture and empty per-origin Demo storage. Use the same fresh origin/port throughout a comparison.
3. If deliberately discarding **all** Demo changes on one existing origin, open browser DevTools → **Application** → **Storage** → **Clear site data** for that specific `127.0.0.1:<port>` origin, then reload. This removes saved local Demo projects, imports, settings and other local edits on that origin. It is not needed for ordinary review, and it is not performed by this handoff.

## Runtime boundary and first integration slice

`src/routes.ts` defines routes; `src/core/contracts.ts` defines the typed boundary; `src/core/demoClient.ts` is the deterministic local adapter. `src/core/httpClient.ts` contains **proposed** same-origin Live shapes and fails closed through `createLiveCoreClient()` until actual contracts are reconciled. No Live request may silently use Demo data.

The proposed first Live slice is **session → authorized project → scoped issue list → issue drawer → validated transition → receipt/activity → scoped updates**. Integrate each step against actual non-production contracts and acceptance tests described in `ENGINE_INTEGRATION_BACKLOG.md`. Preserve project scope, query, permissions, `If-Match`/version checks, idempotency and unknown-outcome recovery. No backend work has begun under this handoff.

**Gate status:** local Demo UI and UX **approved**; contract readiness **blocked**; Live integration **blocked/not run**; production readiness **blocked**.
