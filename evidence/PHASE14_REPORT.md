# Phase 14 — actual implementation report

Date: 2026-10-28. Status: **awaiting_ui_ux_review**. Phase 13: user explicitly approved both UI and UX for the tested local Demo, including the Board correction. Phase 14 Demo: **PASS for the tested local journeys**. Live: **BLOCKED / unverified**. No Phase 15 work was started.

## Outcome and source changes

- Added organization routes `/o/demo/projects`, `/my-work`, `/inbox`, `/search`, `/activity` with URL query/filter state and browser Back in `src/routes.ts`, `src/domain.ts`, `src/App.tsx`. Project snapshots and drawer context survive organization → project → Back. Classic/Light, closed Agent, existing fonts and all prior project views remain in place.
- `src/phase14Domain.ts` derives project directory counts, cross-project My Work, Inbox, search and activity from the existing Core issues/activity, Intake items, Run/review records and Phase 13 memberships. It creates **no second issue, Run, review or notification-content store**. The local Inbox stores only read/snooze markers and idempotency results. The canonical fixture's `u-sara` assignment is explicitly mapped to the Demo principal `sara-farahani`; no Live identity resolution is claimed. Project names, keys, issue IDs/keys and `#KEY` are supported search forms; ambiguous names require choosing a visible project/key.
- Inbox read and one-hour snooze use item revision and idempotency keys, return local Demo receipts, and are reloaded by 15-second controlled polling while Inbox is open. Pending Review response calls the existing versioned independent-review command and current review policy. Intake and Run waiting-input items open their actual context; the existing forms handle their responses. No external messages are sent.
- Organization/project activity shows recorded actor, timestamp, action, resource version when recorded, before/after when available and receipt. Queued/failed Run operations are labeled separately from committed changes; missing time/actor/version is labeled unknown rather than inferred. `ActivityEntry.resourceVersion` now captures the receipt's version at mutation time, so later issue edits do not rewrite earlier activity versions.
- Demo organization switch/sign-out removes selection, local Inbox markers and commands, closes project subscriptions, ignores in-flight project reads, and redacts the project switcher and project content. Phase 13 permission changes invalidate affected local markers/projections. This is client-side Demo behavior, not proof of real server authorization or revocation.
- UI is in `src/Phase14Workspace.tsx` and `src/phase14.css`. The organization pages use the approved shell and hide project-only work filters. Keyboard, RTL and mobile organization navigation are available.

## Run and review

Run `npm ci`, then `npm run dev -- --host 127.0.0.1 --port 5182`. The local server returned HTTP 200 at [Project directory](http://127.0.0.1:5182/o/demo/projects?design=current). Other review links: [My Work](http://127.0.0.1:5182/o/demo/my-work?design=current), [Inbox](http://127.0.0.1:5182/o/demo/inbox?design=current), [Search](http://127.0.0.1:5182/o/demo/search?design=current), [Activity](http://127.0.0.1:5182/o/demo/activity?design=current). The server was running when this report was written. Existing local Demo data/user changes are preserved; use a fresh browser profile to compare fixture-only screenshots.

## Verification

| Check | Mode/environment | Exact command or interaction | Actual result |
|---|---|---|---|
| Typecheck/build | Local Node/Vite | `npm run build` | PASS; TypeScript and Vite build. Vite emitted its existing large-chunk advisory. |
| Full unit suite | Local Vitest | `npm test` | PASS **123/123** in 24 files. |
| Phase 14 domain | Local Vitest | `npx vitest run tests/phase14.test.ts` | PASS **7/7**: cross-project assignments, canonical/alias search, ambiguity, Inbox dedup/revision/idempotency/snooze, existing Review response and permission loss, access loss/org switch, session expiry, receipt activity. |
| Phase 14 Chrome | Local Demo Chrome 1440×900 and 390×844 | `npx playwright test --config=playwright.phase14.config.ts` | PASS **8/8**: directory/project/Back; My Work/drawer; search ambiguity/key; Inbox read/snooze/reload/scope redaction; Intake context/Back; deep-linked search/reload; English/Persian/Arabic RTL/mobile/keyboard; Light/Dark screenshots and opaque-card contrast. Initial browser attempt found project-only controls on org pages; fixed and recaptured. |
| Earlier Board/Phase 13 regression | Local Demo Chrome | `npx playwright test tests/browser/phase04.spec.ts tests/browser/phase13.spec.ts tests/browser/phase13BoardConfig.spec.ts --config=playwright.config.ts` | PASS **9/9** after Phase 14 navigation changes. |
| Screenshots | Real local Chrome captures | `tests/browser/phase14.spec.ts` | [Directory Light](../docs/screenshots/phase14-project-directory-en-light.png), [Inbox Light](../docs/screenshots/phase14-inbox-en-light.png), [Inbox Persian mobile](../docs/screenshots/phase14-inbox-fa-mobile.png), [Directory Dark](../docs/screenshots/phase14-project-directory-en-dark.png). |
| Staging / real authorization | Live Engine | No reconciled contract, credentials or staging URL | BLOCKED; no Live request or server authorization claim. |

## Gaps, contract and limits

- Exact Live organization directory/My Work/Inbox/search/activity operation IDs, envelopes, ACL semantics, event schema and staging identities are missing. Proposed routes in `reference/EmpireProject_UI_Engine_API_Contract_FA_v1.0.md` are **not verified APIs**. See `contracts/PHASE14_ORG_DECISION.md`.
- Demo access filtering runs in the client over local data. It does not verify server-side snippets/counts/audit redaction, token expiry, session/logout, revocation of already-issued URLs, or cross-tenant isolation. Server BFF/IAM/Organization service and staging tests are required.
- Inbox polls while open because no organization stream is available. Live poll cadence, resource revisions, notification policy, dedup across devices and response receipts need a contract. External Email/Slack/WhatsApp delivery is unavailable and never shown as successful.
- Core issue activity is in memory; persisted Run/review history remains in their existing Demo adapters. A reload does not reconstruct historical issue transitions that were not persisted by the Core adapter. Synthetic history is not invented. The local Demo has no meaningful real organizational audit or delivery proof.
- Real speech, storage/scan/import, Live Agent execution, artifact access/indexing, workflow publication, release delivery and historical metrics from prior phases remain blocked or unverified as previously reported.

## Review gate

UI review: **pending**. UX review: **pending**. The user's Phase 13 approval does not approve Phase 14. Follow `evidence/PHASE14_UAT.md` for separate journeys. Phase 15 starts only after explicit approval of both Phase 14 UI and UX.
