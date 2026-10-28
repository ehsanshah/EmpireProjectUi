# Phase 13 — actual implementation report

Date: 2026-10-28. Repository: `/Users/ehsanshahbakhti/GolandProjects/EmpireProjectUi`. Status: **accepted for tested local Demo UI and UX** after explicit user approval on 2026-10-28. Demo: **PASS for tested local flows**. Live: **BLOCKED / unverified**.

The user explicitly approved both UI and UX of the tested Phase 12 Demo. Live authorization, storage, delivery and historical metrics without event history remain unverified or unavailable. All earlier Live blockers and font/license files were preserved. Phase 14 was started only after the user approved Phase 13 UI and UX.

## Outcome and source changes

- `src/phase13Domain.ts` adds a deterministic local administration adapter under `DemoCoreClient.phase13`: Human/Agent/Group project memberships, independent organization flags, explicit grants, role-binding labels/revisions, effective action lineage, affected-scope previews, stale-policy checks, idempotent commands and Demo receipts. Revocation invalidates Core cursors, selection/previews and scoped event streams; Agent revocation invalidates the existing Phase 10 Demo readiness projection. Restoring membership removes old grants. Project restore also requires fresh grants.
- Versioned settings include issue hierarchy/type metadata, priorities, custom field definitions, workflow statuses/transitions/required fields, Board column/WIP metadata, working calendar/timezone, credential-free templates, notifications and AI/voice capability labels. Draft → validate/migration preview → revision-bound approval → separate publish is implemented. Invalid field references, missing status mappings and active Run migrations block publication. Demo migration preserves unrelated issue fields. Published issue types, priorities and custom fields feed the shared Demo WorkItem schema; WIP limit and timezone feed the existing Board/Calendar state. The Phase 13 correction makes Board column names, order, status mappings and Area swimlane order editable in the versioned Demo draft. Validation rejects duplicate/unknown mappings, unsupported grouping and malformed column layouts. Preview shows changed columns, affected issue keys and the unmapped-status tray. Approval is bound to the exact draft hash/revision; unsaved edits disable publish, and saving a material edit invalidates approval. Publication updates the actual Board renderer through the shared Demo adapter and persists the published configuration per project in localStorage. Drafts are session-local. Issue statuses do not change on Board mapping publication. WIP counts use all active project issues mapped to the WIP column, across filters and lanes; placement, transition and bulk preview use the same scope. Rank anchors, source preservation on rejection, selection and drawer context remain intact. The supported grouping is **Area (Web/Mobile)** with either lane order; Assignee grouping is explicitly unavailable. Live publication still needs the reconciled Engine schema and services.
- `src/Phase13Workspace.tsx`, `src/phase13.css`, `src/App.tsx`, `src/routes.ts`, `src/domain.ts` and `src/i18n.ts` add People and Settings routes, admin/restricted Demo policy lens, explicit role-binding preview, settings modules, connection metadata, unavailable organization controls, English/Persian/Arabic labels, responsive layout and Back navigation. Restricted records disappear when the selected Demo lens has no read grant. Classic/Light, closed Agent, English typography, local Vazir and Arabic font configuration are retained.
- `src/core/demoClient.ts` emits Demo permission changes and performs validated workflow migration. `tests/phase13.test.ts`, `tests/routes.test.ts` and `tests/browser/phase13.spec.ts` cover the new boundary. Existing user edits, 14-issue current fixture and separate historical fixture were not replaced.

## Run and review

Install: `npm ci` if needed. Running correction URL: **http://127.0.0.1:5181/o/demo/p/empire/settings?design=current&section=settings**. Board: `/o/demo/p/empire/work?design=current&view=board`. Start with `npm run dev -- --host 127.0.0.1 --port 5181`; port 5180 was already occupied in this session. `playwright.phase13-board.config.ts` targets 5181. Published Demo settings persist per project in localStorage; policy, approval and draft state remain in memory. Browser profile/local Demo data can retain earlier examples. Demo receipts are local evidence only.

## Verification

| Check | Mode / command | Actual result | Evidence |
|---|---|---|---|
| Typecheck + build | `npm run build` | PASS; TypeScript passed, Vite built. Existing bundle-size warning only. | Terminal output, `dist/`. |
| Core regression | `npm test` | PASS: 116/116 tests in 23 files. | `tests/phase13.test.ts` (12 cases), `tests/phase13BoardConfig.test.ts` (5 cases), `tests/routes.test.ts`, prior suites. |
| People/access | Chrome local Demo, `npx playwright test tests/browser/phase04.spec.ts tests/browser/phase13.spec.ts tests/browser/phase13BoardConfig.spec.ts --config=playwright.phase13-board.config.ts` | PASS: 9/9 final focused browser tests (Phase 04, Phase 13 and Board correction); admin previews revoke, receipt, restricted projection hides records. | `docs/screenshots/phase13-people-restricted-en.png`. |
| Workflow/settings | Same Chrome run | PASS: draft, validate, approve, publish receipt, Back; invalid required field blocks approval. Board correction tests verify draft isolation, changed layout/mapping preview, same-session Board publication, reload persistence, approval invalidation, unmapped tray, full-scope WIP and keyboard ranking. Unit tests cover missing mappings, active Run protection, restricted publish and stale approval. | `docs/screenshots/phase13-settings-en-light.png`, `docs/screenshots/phase13-board-configured-en-light.png`. |
| Connections/org | Same Chrome run | PASS: API/MCP separate configuration/health/probe display; unavailable org controls remain unavailable. No real probe. | `docs/screenshots/phase13-connections-fa-mobile.png`, `docs/screenshots/phase13-organization-ar-mobile.png`. |
| Locale/visual | Chrome 1440px and 390px | PASS for tested views, including the Board editor: Classic/Light/Agent closed, Persian RTL/Vazir, Arabic RTL/local font, dark theme, no page-width overflow and keyboard focus/Enter on admin tabs. | `tests/browser/phase13.spec.ts`, `tests/browser/phase13BoardConfig.spec.ts` and `docs/screenshots/phase13-board-editor-fa-mobile.png`. |
| Demo policy negative cases | Vitest | PASS: denied actions, stale revision, revocation/stream close, Agent readiness invalidation, role label without grant, invalid schema, missing mapping, active Run, stale approval, secret-like input rejection, archive/restore no grant revival. | `tests/phase13.test.ts`. |
| Earlier WorkItem/Board regression | Chrome local Demo, `npx playwright test tests/browser/phase03.spec.ts tests/browser/phase04.spec.ts --config=playwright.phase13.config.ts --grep 'full-page deep link|Board keeps full-scope WIP'` | PASS: 2/2 focused earlier behavior checks. | Existing Phase 03 schema draft and Phase 04 full-scope Board WIP journeys. |
| Live Engine | Real staging | BLOCKED / NOT RUN. | `contracts/PHASE13_ADMIN_DECISION.md`. |

The first browser run had two incorrect test locators: an access preview was checked under the workflow preview class, and an English tab label was sought after switching to Arabic. The locators were corrected; final runs passed. A visual inspection then found compressed mobile admin tabs and vertically centered desktop content; CSS was corrected and screenshots rerun. These were test/UI corrections, not claims of Live validation.

## Board configuration correction — observed cases

1. An edited draft left the published `getBoardSnapshot` unchanged; preview listed column/lane differences, affected review issues and their prospective unmapped tray.
2. A validated approval and separate publish receipt changed column order/label/status mapping and swimlane order on the actual Board in the same SPA session. Reload restored the published configuration. Board workset reconciled as 12 rendered + 2 unmapped = 14 matching in the test fixture; issue statuses were unchanged by configuration.
3. Saving an edit after approval cleared the approval. The UI also disabled Publish for unsaved edits. Stale draft revisions and restricted-user approval were rejected by the Demo adapter while retaining draft content.
4. Duplicate status mappings and unsupported Assignee grouping failed validation. A WIP remap counted all active project issues in mapped WIP statuses and rejected an over-limit placement without changing source status, version or rank revision.
5. Phase 04 browser regressions passed for filtered WIP, unmapped tray, required transition fields, conflict recovery and keyboard movement. The configured Board browser test also completed an Alt+ArrowDown rank move with a Demo receipt.

The old Board settings control remains a clearly labeled **local Demo WIP test override** for Phase 04 review. Versioned published WIP policy is edited in Phase 13 Settings. This is a local prototype distinction, not a Live policy contract.

## Exact Live blockers

| Gap | Affected path | Owner / required input | Exit evidence |
|---|---|---|---|
| No reconciled membership, group, role-binding, effective-grant or permission revision OpenAPI | Live People and access | Backend/IAM: operation IDs, schema, ETags, policy lineage and admin/restricted identities | Staging denial, stale-grant, revoke and org/project separation tests. |
| No authenticated BFF session/CSRF, scoped event reset/replay or current ACL policy | Real revocation and cache/stream safety | IAM/Security/Backend/DevOps | Authorized stream/citation/export purge tests with restricted accounts. |
| No workflow validation/migration/publication/approval contract or active Run migration policy | Live Settings | Backend/Product/Agent platform | Versioned migration receipts and active Run rejection from staging. |
| No credential-reference transport, API/MCP provider capability or probe endpoint | Live Connections | Integrations/Security/Backend | Probe outcomes and no-secret transport verified on staging. |
| No org capability payload for SSO/SCIM, retention, residency, quotas, billing | Org controls | IAM/Organization service/Product | Authorized capability contracts and actual service behavior. |
| Prior Phase 07–12 blockers remain | Speech, file storage/import, Agent execution, knowledge indexing, reports/delivery | Prior owners | Separate real service evidence; user approvals of Demo do not remove blockers. |

## Contract changes and limitation

`contracts/PHASE13_ADMIN_DECISION.md` records proposed vs verified behavior. The reference's API catalog remains proposed. This phase does not claim real authorization, signed credential handling, API/MCP probes, external Agent work, Live Board schema publication, Assignee grouping or all cross-surface consumption of published Demo settings. No Demo response is used as a Live fallback.

## Separate user approvals

UI review: **approved for tested local Demo**. UX review: **approved for tested local Demo** by the user on 2026-10-28, including the configurable Board correction. Live schema publication and server authorization remain unverified.

## Next phase

Phase 13 UI and UX were explicitly approved for the tested local Demo, including the configurable Board correction. Live schema publication and server authorization remain unverified.
