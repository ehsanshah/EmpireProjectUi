# Phase 08 — file transport and DataCart decision

Status: **Demo adapter implemented; Live routes unreconciled** (2026-10-27). Sources: `reference/EmpireProject_UI_Engine_API_Contract_FA_v1.0.md` sections 7.1, 10 and 13; `phases/08_FILE_TRANSPORT_DATACART_AND_IMPORT_RECOVERY.md`; CD-01. This file does not claim actual Engine OpenAPI or storage behavior was inspected.

## Demo boundary

`src/dataCartDomain.ts` advertises **CSV, 256 KiB, 100 rows** for local Demo DataCart only. The upload ticket is a short-lived `demo-storage://` descriptor with method, headers, expiry, size and MIME limits; no network upload or application credential forwarding occurs. `FileReader` supplies progress and cancellation, Web Crypto computes SHA-256, and completion checks ticket/size/digest. A separate **Run Demo scan** gate checks a deterministic unsafe-content fixture; parsing cannot begin until `scan=ready`. This is not malware protection. The older Board quick-import remains a local Demo path and now runs the same simulated unsafe-content check before parsing; it is not a Live transport path.

Rows retain source locators and a source fingerprint, editable column mapping, per-row errors, ambiguity answers through the existing clarification card, duplicate detection and a parent-reference draft hierarchy. Approval binds source and mapping revisions and expires. The commit loop uses the existing validated `core.writeWorkItem` path, CSRF, schema revision, optional If-Match for updates, stable row intent keys and applied receipts. Row source markers and a Demo receipt ledger support recovery after reload or simulated response loss; an existing issue without a recoverable receipt is held as **unknown** and is never blindly duplicated. Results distinguish created/updated/skipped/failed/unknown. Result CSV uses formula-neutralized cells and a fresh project-scoped Demo access check. Source content is rendered as text, never executed as HTML, SQL or agent instructions.

Demo carts and source text are stored in the browser's `local-demo` namespace to make reload reviewable. They must not be treated as secure storage for sensitive production files. **XLSX, PDF and general text task extraction are unavailable**, as are Google Sheets and all external connectors, because no advertised authorized capability/connection exists. CSS is never parsed as task rows. The Demo import creates parent/child work items through the typed WorkItem client; the server-side draft graph and initial Backlog status contract are not available, so newly created Demo items retain the WorkItem client's default To do status. The draft hierarchy is visible before commit.

## Live inputs and exit evidence

| Owner | Required input | Exit evidence |
|---|---|---|
| Storage/Backend/Security | Actual upload-ticket schema, allowlisted hosts/headers, size/MIME/purpose policy, checksum completion and scan lifecycle including failure/revoke | Generated client plus storage-origin integration tests with credential-leak check |
| Backend/Product | Actual DataCart state machine, row/mapping/draft graph schemas, source and mapping revisions, validation/approval/commit operation IDs, per-row result/receipt envelopes | Contract fixtures and authenticated staging partial/retry/reload tests |
| Backend/IAM | Fresh scoped download/access ticket, permission revocation and signed-URL expiry policy | Authorized/denied/revoked staging download tests |
| DevOps/IAM | Non-production staging URL, BFF session, CSRF and least-privilege test identities | End-to-end Live transport and import run |
| Integrations/Product | Advertised XLSX/PDF/text parsers and authorized Google Sheets connection capability, if desired | Capability response and connected-source test account |

No Live path substitutes a Demo result. No real upload host, scanner, server parser, import job, Google Sheets connection or staging receipt was exercised. Download of the local result CSV is a Demo action, not a verified artifact access-ticket endpoint.
