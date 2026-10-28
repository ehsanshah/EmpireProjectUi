# Phase 11 — actual implementation report

Date: 2026-10-28. Authorized by the user's explicit Phase 10 local Demo UI and UX approval and Phase 11 request. Implementation status: `awaiting_ui_ux_review`. Demo status: `PASS` for the tested local flows. Live status: `BLOCKED`. Phase 11 user acceptance: `pending`.

## Outcome and source changes

- [phase11Domain.ts](../src/phase11Domain.ts) adds a project-scoped Demo Gallery and Knowledge adapter to the existing [DemoCoreClient](../src/core/demoClient.ts). Gallery reads Phase 10 Run artifacts and review history directly. It retains rejected v1 and accepted v2, shows draft placeholders for unsubmitted Runs, and keeps every item `not_shipped`. No hash or deployment preview is invented. Lineage identifies the issue, approved plan, Run attempt and review decision.
- Knowledge includes synthetic decision documents, versioned notes and an unavailable source. Local Demo users can create text notes or decision documents and add versions through version-checked, idempotent commands with Demo receipts. Search returns structured exact counts over currently accessible project source versions. Citations carry project, source, version and locator, and open that exact version. Stale, missing, unavailable and revoked states are distinct. Revoked content is removed from source lists, search hits, snippets, counts and deep-link detail.
- Fresh Demo access tickets bind the resource, project and version. Expired tickets can be renewed once; a read rechecks current source access, including after a delayed response. A revoked source loses its Demo tickets. Preview text renders as React text in a `pre`, leaving embedded script and SVG markup inert. This is browser-local simulation, not server authorization or a claim about signed URL revocation.
- [Phase11Workspace.tsx](../src/Phase11Workspace.tsx), [phase11.css](../src/phase11.css), [App.tsx](../src/App.tsx), [routes.ts](../src/routes.ts) and [domain.ts](../src/domain.ts) add Gallery and Knowledge navigation, detail views, scoped search, version history, citation and lineage links, Back support and capability-gated unavailable states. Work-only filters are hidden on these two surfaces. Search input follows restored URL state after Back.
- Classic/Light remains the default, the Agent panel initially remains closed, and the current 14-issue fixture and historical 12/6/2 fixture remain separate. Existing user data is preserved. [PHASE11_GALLERY_KNOWLEDGE_DECISION.md](../contracts/PHASE11_GALLERY_KNOWLEDGE_DECISION.md) records contract boundaries. [PROJECT_STATE.json](../PROJECT_STATE.json), [FEATURE_COVERAGE.csv](../FEATURE_COVERAGE.csv), [UIAPI_TRACEABILITY.csv](../UIAPI_TRACEABILITY.csv) and [ENGINE_MAPPING.csv](../contracts/ENGINE_MAPPING.csv) record Demo evidence and Live blockers.

### Persian font correction after the review handoff

The user added `font_persian` and requested it for Persian UI. All supplied font binaries and documentation in that folder were zero bytes at inspection. Four matching Vazir v18.0.0 WOFF2 weights and the release `LICENSE` were recovered from the [font author's tagged repository](https://github.com/rastikerdar/vazir-font/tree/v18.0.0) into [font_persian/vazir-font-v18.0.0](../font_persian/vazir-font-v18.0.0). Other empty user-provided files were left untouched. [styles.css](../src/styles.css) originally applied those local files to Persian; it now applies them to Arabic as well. English retains its existing Inter/system stack. This UI correction does not change the pending Phase 11 acceptance or Live status.

### Arabic UI correction after the review handoff

At the user's request, the language selector now includes Modern Standard Arabic. [i18n.ts](../src/i18n.ts) shares locale direction and Arabic interface translations across the existing views. Arabic uses RTL and the user-provided `font_arabic/KFGQPC_uthman_taha_naskh_regular.woff2` (the later added Web font version of the same face); both `arabweb1.ttf` and its new WOFF2 version have no Arabic Unicode glyphs according to local font inspection. Dates use the Arabic locale with the selected Gregorian/Persian calendar. Static interface copy passed through the shared translation helper has Arabic entries across the existing views. Bounded Arabic Demo commands cover remaining, blocked, list/board/timeline/calendar, Back and issue opening. Stored project names, issue titles and user data remain in their source language when Arabic content is unavailable; dynamic or direct interface text may still use its source language. No fixture or Live contract was changed. Phase 11 UI/UX acceptance remains pending.

## Run and review

Install if needed: `npm ci`. Start if the existing review server has stopped: `npm run dev -- --port 5178`. The existing server returned HTTP 200 at [Gallery](http://127.0.0.1:5178/o/demo/p/empire/gallery?design=current) on 2026-10-28. [Knowledge](http://127.0.0.1:5178/o/demo/p/empire/knowledge?design=current) has seeded local Demo sources. Gallery is empty until a Run has been assigned or submitted in that browser profile. For the full artifact journey, follow [Phase 11 UAT](PHASE11_UAT.md). Data resides in browser-local Demo namespaces; no reviewer data was reset for delivery. Browser tests used isolated contexts.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Build and TypeScript | Local source | `npm run build` | PASS; Vite warned that one JS chunk exceeds 500 kB | TypeScript exit 0; Vite exit 0 |
| Full unit suite | Local Demo | `npm test` | PASS 93/93 across 20 files | Vitest output |
| Phase 11 domain | Local Demo | `npm test -- --run tests/phase11.test.ts` | PASS 3/3: artifact revision truth, exact citation, ticket renewal, revoke/redaction, stale writes and delayed/project-scoped reads | [phase11.test.ts](../tests/phase11.test.ts) |
| Phase 09–11 and route regression | Local Chromium Demo | `npx playwright test tests/browser/phase11.spec.ts tests/browser/phase10.spec.ts tests/browser/phase09.spec.ts tests/browser/routes.spec.ts --workers=2` | PASS 11/11 after lineage link and Back fixes | [phase11.spec.ts](../tests/browser/phase11.spec.ts) and command output |
| Gallery browser path | Local Chromium Demo | Approved plan → simulated readiness and Run → submit v1 → reject → submit v2 → accept → Gallery | PASS: both versions retained; accepted stays not shipped; links open issue, plan, Run and review history; Back returns to Gallery | [Gallery screenshot](../docs/screenshots/phase11-gallery-accepted.png) |
| Knowledge browser path | Local Chromium Demo | Search v1 citation; expire/renew ticket; revoke; reload; unsafe text; project switch | PASS: exact v1 text, zero accessible hits after revoke, restricted detail redacted on reload, markup inert, no cross-project source | [Revoked screenshot](../docs/screenshots/phase11-knowledge-revoked.png) |
| Keyboard, RTL, responsive and themes | Local Chromium Demo | Keyboard search/Enter/Back; Persian at 390 × 844; toggle Dark | PASS in exercised controls; no horizontal overflow observed | [Persian mobile screenshot](../docs/screenshots/phase11-knowledge-mobile-fa-dark.png) |
| Bundled Persian font | Local Chromium Demo | `npx playwright test tests/browser/persianFont.spec.ts --workers=1` | PASS 1/1: Vazir file loaded in Persian, form controls inherit it, English retains its stack, mobile width fits | [font test](../tests/browser/persianFont.spec.ts), [mobile screenshot](../docs/screenshots/persian-font-intake-mobile.png) |
| Arabic locale correction | Local Chromium Demo | `npx playwright test tests/browser/arabicLocale.spec.ts --workers=1` | PASS 3/3: Arabic RTL/user-provided font loaded, Board/List, Gallery/Knowledge/Back, Planning/Calendar/Intake/Agents/DataCart navigation, English/Persian switching, 390 px width and Arabic Demo command changes to the main workset | [Arabic browser test](../tests/browser/arabicLocale.spec.ts), [mobile screenshot](../docs/screenshots/arabic-board-mobile.png) |
| Arabic correction regressions | Local Demo | `npm run build`; `npm test`; `npx playwright test tests/browser/arabicLocale.spec.ts tests/browser/persianFont.spec.ts tests/browser/phase11.spec.ts tests/browser/routes.spec.ts --workers=2` | PASS: build/typecheck, 93/93 unit, 9/9 browser; Vite retains the existing large-chunk warning | Command output and test files |
| Running review server | Local HTTP | `curl -sS -o /dev/null -w '%{http_code}' 'http://127.0.0.1:5178/o/demo/p/empire/gallery?design=current'` | HTTP 200 | Existing Vite server |
| Contract fixture | Proposed Engine contract only | Read sections 7.3, 10, 12–14; map operations | No executable server contract fixture supplied; local synthetic fixtures only | [contract decision](../contracts/PHASE11_GALLERY_KNOWLEDGE_DECISION.md) |
| Real staging and authorization | Live Engine | No staging/session/principals/endpoints provided | BLOCKED; no Live request or storage preview test run | [contract decision](../contracts/PHASE11_GALLERY_KNOWLEDGE_DECISION.md) |

Browser and unit checks prove the listed local Demo behavior only. A real screen-reader audit, physical touch-device audit, storage isolation test and server ACL test did not run. The artifact preview is a synthetic text descriptor, not an actual built artifact or deployment. No Memory Galaxy, Obsidian, relationship graph or export is advertised as working.

## Gaps and risks

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| Reconciled Gallery, artifact, Knowledge, resolve, status, receipt and event schemas | Live API boundary | Backend/Knowledge service | Demo UI and adapter complete | OpenAPI/examples plus contract tests |
| Real artifact binary, hash, classification, preview and deployment metadata | Gallery preview and shipped truth | Storage/Product/Backend | Synthetic descriptors remain labeled | Authorized versioned artifact and deployment fixture |
| Ticket issue/expiry/revoke rules and isolated HTML/SVG preview origin | Live access and preview safety | Storage/Security/DevOps | Local checked text preview | Server ticket tests, CSP/sandbox verification, signed URL policy |
| Source indexing, freshness, citation locator, scoped count and connector policy | Live Knowledge | Knowledge service/Backend/Product | Project-scoped synthetic text search | Authorized/denied search and citation fixtures |
| Staging BFF session/CSRF and authorized/revoked principals | Live permission enforcement | IAM/DevOps/Backend | Local Demo only | Reachable staging with grant/revoke tests |
| Memory Galaxy and Obsidian contracts/services | Optional extensions | Product/Integrations | Unavailable labels in UI | Advertised capability and authorized connector tests |

A previously issued real signed URL may remain usable until expiry unless the backend supplies a revoking proxy or equivalent mechanism. The Demo's checked ticket behavior is not evidence that real storage has that property. No numerical metric is inferred from generated prose; local search counts come from the structured scoped result.

## Contract changes and approvals

[PHASE11_GALLERY_KNOWLEDGE_DECISION.md](../contracts/PHASE11_GALLERY_KNOWLEDGE_DECISION.md) distinguishes proposed Engine operations from locally implemented Demo behavior. No Engine schema or receipt is marked verified. Phase 10 local Demo UI and UX approval was recorded in [PROJECT_STATE.json](../PROJECT_STATE.json); its Live blockers remain. Phase 11 UI review: **pending**. Phase 11 UX review: **pending**. No Phase 11 approval message has been received.

## Next phase

Obtain explicit Phase 11 UI and UX review decisions using [PHASE11_UAT.md](PHASE11_UAT.md). Phase 12 must not start before both are approved. Live integration also requires the listed backend, storage, security, IAM and Knowledge inputs.
