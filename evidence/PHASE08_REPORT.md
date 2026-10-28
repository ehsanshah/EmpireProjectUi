# Phase 08 — actual implementation report

Date: 2026-10-27. Branch/commit: current working tree; no commit created. Authorization: user explicitly approved UI and UX of **tested Phase 07 Demo flows only**, kept real microphone and Live Engine unverified, then requested Phase 08 only. Implementation status: **awaiting_ui_ux_review**. Demo status: **PASS for tested CSV scope**. Live status: **BLOCKED / unverified**. Phase 08 user acceptance: **pending**.

## Outcome and source changes

- `src/dataCartDomain.ts`, `src/DataCartWorkspace.tsx`, `src/dataCart.css` add a project-scoped, deep-linked DataCart at `/o/demo/p/{project}/datacarts/{id}`. The local Demo advertises CSV only (256 KiB, 100 rows). A short-lived Demo ticket, FileReader progress/cancel, Web Crypto SHA-256, size/checksum completion and explicit simulated scan gate precede parsing. Pending, expired or blocked uploads cannot parse. This is **not** a real upload or malware scan.
- The visible sequence covers upload, scan, parse, editable mapping, source-row clarification, validation, preview, revision-bound approval, commit and final/partial results. Source locators, source IDs, type/priority/label proposals, row errors, duplicates and a parent-reference backlog draft hierarchy stay visible. `FEAT-1` asks Task versus Story through the existing numbered clarification card. Imported text is rendered as data; no file instruction, HTML, SQL or arbitrary model code is executed.
- Valid rows use the existing typed `core.writeWorkItem` command path with schema revision, CSRF, optional If-Match for scoped updates, stable source-row idempotency keys and applied Demo receipts. Source markers and a local receipt ledger prevent duplicate work after reload or simulated lost response. Unknown without a recoverable receipt remains unknown. Results distinguish created, updated, skipped and failed rows; failed rows can be edited and retried without resending successful rows. Result CSV uses formula-neutralized cells and a fresh scoped Demo access ticket.
- `src/App.tsx`, `src/domain.ts`, `src/routes.ts` add DataCart navigation and browser history. Reset Demo clears issue changes and local DataCart jobs together. The existing Board quick-import remains functional and now checks the same simulated unsafe-content condition before parsing; it remains a separate local Demo flow.
- `fixtures/phase08-import-sample.csv` is the review sample. `fixtures/phase08-retry-single.csv`, `fixtures/phase08-malicious.csv` and `fixtures/phase08-not-importable.css` are test fixtures. The original current 14-issue and separate historical 12/6/2 fixtures were not modified. Classic/light, Agent initially closed and approved Phase 01–07 behavior remain.

## Run and review

From `/Users/ehsanshahbakhti/GolandProjects/EmpireProjectUi`: `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 5177`. Open [DataCart Demo](http://127.0.0.1:5177/o/demo/p/empire/datacarts/new). Select [sample CSV](../fixtures/phase08-import-sample.csv), run Demo scan, parse, choose **Story** for `FEAT-1`, validate, preview, approve and commit. The first result should have **3 created, 1 updated, 1 skipped, 1 failed**; fill row 6's missing title and retry for **4 created, 1 updated, 1 skipped, 0 failed**. A cart URL resumes after reload. **Reset issue data** returns to the original 14 issues and clears local carts. See `evidence/PHASE08_UAT.md` for separate UI and UX journeys.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Typecheck/build | Local | `npm run build` | PASS; 1,635 modules, 612.47 kB JS chunk advisory | Vite output and `dist/` |
| Unit behavior | Deterministic Demo | `npm test` | PASS: 17 files, 77 tests; Phase 08 ticket/scan/parse/mapping/approval/export checks 6/6 | `tests/phase08.test.ts` |
| Full Chrome regression | Local Demo | `npm run test:e2e -- --workers=1` | PASS: 58/58 before the final reset cleanup and new cancellation test | Playwright output |
| Focused final browser | Local Demo | `npm run test:e2e -- tests/browser/phase08.spec.ts tests/browser/phase07.spec.ts tests/browser/phase06.spec.ts --workers=1` | PASS: 11/11 after final reset and Persian/Dark refinements; separate Board regression 3/3 passed earlier | `tests/browser/phase08.spec.ts`; Playwright output |
| CSV import/partial/retry | Chrome, local Demo | Sample file → scan → parse → question → approve → commit → reload → repair row 6 → retry | PASS: 17 then 18 project issues, no duplicate imported issues; per-row receipts visible | `tests/browser/phase08.spec.ts`; `docs/screenshots/phase08-partial-import.png` |
| Unknown response recovery | Chrome, local Demo | Simulated response loss after one applied write → reload | PASS: receipt recovered, one issue created, no second write | `tests/browser/phase08.spec.ts` |
| Unsafe/unsupported source | Chrome + unit | CSS, suspicious CSV, unclosed quote, duplicate headers, expired ticket, checksum mismatch | PASS for tested local Demo checks; parse blocked when scan is not ready | `tests/phase08.test.ts`; `tests/browser/phase08.spec.ts` |
| Real storage/scan/import staging | No service available | No authenticated storage or Engine request performed | **BLOCKED / UNVERIFIED** | `contracts/PHASE08_DATACART_DECISION.md` |

Actual Chrome screenshots `docs/screenshots/phase08-partial-import.png`, `docs/screenshots/phase08-mobile-fa-blocked.png` and `docs/screenshots/phase08-mobile-fa-dark.png` were inspected. They show the Classic/light result grid and readable Persian RTL blocked-scan states in both themes. The workset count reflects 17 issues after the first commit (14 starting + 3 created). Browser-local upload progress and cancellation are tested with a delayed FileReader fixture; this is not a storage-network test.

## Gaps and risks

| Gap | Affected capability | Owner/input | Independent work possible | Exit evidence |
|---|---|---|---|---|
| Actual upload ticket/storage host/required headers and scan service unavailable | Live file transport and malware safety | Storage/Backend/Security | Local Demo gate verified | Reconciled OpenAPI and storage-origin integration tests |
| Actual DataCart job/row/draft graph, approval/operation/result envelopes unavailable | Live import and server-side uniqueness | Backend/Product | Demo source/revision/receipt behavior verified | Contract fixtures and staging partial/retry run |
| Scoped artifact access-ticket/revoke policy unavailable | Live authorized download | Backend/IAM/Security | Demo result export checks current project | Authorized/denied/revoked staging tests |
| XLSX/PDF/text and Google Sheets capability/authorized connection not provided | Non-CSV import | Product/Integrations/Backend | Explicit unavailable state | Advertised capability + connection fixture |
| Initial Backlog status and server draft-graph command unspecified | Final placement of imported items | Backend/Product | Demo parent/child draft hierarchy shown; WorkItem client creates To do | Reconciled creation/draft-graph schema |
| Staging URL and BFF session/CSRF identities unavailable | Any real Live journey | DevOps/IAM/Backend | Demo UI and tests complete | Authenticated non-production run |

The local Demo persists source text in a browser-local Demo namespace for reload; it is not secure production file storage. This limit is explicit in `contracts/PHASE08_DATACART_DECISION.md`. Browser test screenshots and Demo receipts are not a substitute for storage/server evidence.

## Contract changes

`contracts/PHASE08_DATACART_DECISION.md` describes the proposed adapter and exact Live inputs. `FEATURE_COVERAGE.csv`, `UIAPI_TRACEABILITY.csv` and `contracts/ENGINE_MAPPING.csv` mark Demo tests separately from proposed/unverified Engine routes. No Live endpoint, scanner, Google Sheets connector or staging receipt is claimed verified.

## Separate user approvals

UI review: **approved for tested local CSV Demo flows**. UX review: **approved for tested local CSV Demo flows**. Actual user message: “I explicitly approve the UI and UX of the tested Phase 08 local CSV Demo flows. Real storage, malware scanning, server import, Google Sheets, Live Engine integration and real microphone transcription remain blocked or unverified. Preserve those statuses.” The listed real integrations remain blocked or unverified.

## Next phase

Phase 09 was authorized by the same explicit user message. Its separate UI and UX review is pending.
