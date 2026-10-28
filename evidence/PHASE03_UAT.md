# Phase 03 — user review

Start in the repository with `npm ci` and `npm run dev -- --port 5176`; open `http://127.0.0.1:5176/?design=glass`. Mode: local **Demo**. The main Store checkout list starts from the current 14-issue fixture unless browser-local changes exist. Use **Reset issue data** to restore it; the historical 12/6/2 acceptance fixture is separate and is not shown by default. Clear site storage to clear Demo saved views. Live remains unavailable.

| Journey | Steps | Expected visible result | Observed | User feedback |
|---|---|---|---|---|
| Count and cursor | Set **Page size** to 5, then Next/Previous | Five loaded rows, 14 matching in project; total remains 14 on page two | Chrome PASS | Pending |
| Filters and saved views | Expand **Filters, columns and saved views**; choose High priority, save a named personal view, clear filter and reapply view | Count, rows and filter change together; saved view restores query | Chrome PASS | Pending |
| Schema form | Open EMP-102, choose **Full page** and **Edit all fields**; try empty summary or risk score 9, then correct and save | Field error and entered draft remain; valid save updates issue and Demo receipt/activity | Chrome PASS | Pending |
| Deep link/history | Refresh the full-page URL, use **Back to drawer**, close the issue, then browser Back/Forward | Issue identity persists after refresh; underlying workspace and prior navigation remain coherent | Full-page refresh and close exercised; Back/Forward relies on existing route regression | Pending |
| Conflict recovery | Open edit form, change title, use **Simulate concurrent version**, save and retry | 412 message retains the title; explicit retry with latest version applies once | Chrome PASS | Pending |
| Bulk scope | Set page size 5; open **Bulk selection and preview**; select loaded page, preview, apply; reset and instead select all matching snapshot | Preview distinguishes five explicit IDs from 14 snapshot matches; application lists per-item outcomes and receipts | Chrome PASS | Pending |
| Scoped key/search | Type PAY-42 in Store checkout search and press Enter, then EMP-102 | Cross-project key does not open; current project key opens canonical issue | Chrome PASS | Pending |
| Sensitive action | Open EMP-102, preview Archive, apply, open Comments, then preview Restore and apply | Archived item is read-only and excluded from active count; restore returns it without a destructive delete | Chrome PASS | Pending |
| Entries and files | In the issue record tabs, inspect Comments, Links, Worklogs and Files | Entries use versioned Demo commands; Files clearly states upload transport is unavailable until Phase 08 | Core command tests PASS; manual interaction to review | Pending |

## UI checklist — separate decision pending

- [ ] List controls are understandable when collapsed and when expanded; table rows remain readable.
- [ ] Full-page width, drawer density, typography, data contrast and glass shell are acceptable.
- [ ] Dark and light themes, English LTR and Persian RTL labels/spacing are acceptable.
- [ ] Mobile horizontal table access and controls are usable without hidden actions.
- [ ] Field errors, previews, per-item results and unavailable tabs are visually clear.

Screenshots for review: `phase03-list-desktop.png`, `phase03-full-page-top.png`, `phase03-full-page-form.png`, `phase03-mobile-fa-light.png` in this folder.

## UX checklist — separate decision pending

- [ ] Quick create and full schema form make the intended task clear.
- [ ] Filter, sort, group, saved view, scoped search and cursor navigation change the main workspace as expected.
- [ ] Visible-ID selection versus all-matching snapshot selection is explicit before bulk application.
- [ ] Drafts survive validation and conflict; versioned retry and receipts are understandable.
- [ ] Deep link refresh, drawer/full-page return, browser Back/Forward and focus feel correct.
- [ ] Keyboard access, loading/error recovery, Demo labels and unavailable Live/file states are clear.
- [ ] The existing interactive AI clarification card remains usable.

UI decision: **pending**. UX decision: **pending**. Actual Phase 03 approval message: **not received**. Both must be explicitly approved before Phase 04. Live readiness and production deployment are separate from UI/UX acceptance.
