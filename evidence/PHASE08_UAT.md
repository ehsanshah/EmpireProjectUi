# Phase 08 — separate UI and UX review

Environment: local Demo at [DataCart import](http://127.0.0.1:5177/o/demo/p/empire/datacarts/new). Start with `npm ci` and `npm run dev -- --host 127.0.0.1 --port 5177` if needed. Use [the sample CSV](../fixtures/phase08-import-sample.csv); it has a parent, child, ambiguous type, duplicate, missing title and scoped update. **Reset issue data** restores the 14-issue fixture. Each cart is local to this browser and project; a cart URL can be reloaded to resume its saved Demo state.

## UI review journey

| Step | Inspect | Expected visible result | Actual observation | Your decision |
|---|---|---|---|---|
| 1 | Open DataCart from the left menu at desktop width | Classic/light shell and closed Agent remain; DataCart title, stage strip and project scope readable | Captured in Chrome; user review pending | Pending |
| 2 | Choose the sample file | Ticket/expiry, SHA-256, pending scan and progress/cancel controls are legible | Browser test passed; scan is explicitly Demo | Pending |
| 3 | Scan, parse and inspect mapping/source grid | Mapping controls, row locators, errors and parent/child draft hierarchy are readable | Browser test passed; screenshot captured | Pending |
| 4 | Open the source-row clarification, then inspect preview/results | Numbered question, per-row created/updated/skipped/failed states and receipts are distinct | Browser test passed | Pending |
| 5 | Switch to Persian at 390px and inspect the cart in Light and Dark | RTL navigation, localized stages/blocked state, forms, scrollable row grid and focus controls remain usable | Browser RTL/mobile test passed; both captures inspected; user visual acceptance pending | Pending |

UI checklist: [ ] Classic/light shell [ ] Stage and ticket readability [ ] Mapping/grid density [ ] Source question clarity [ ] Result colors/text [ ] Persian RTL/mobile [ ] Keyboard focus.

## UX review journey

| Step | Try | Expected behavior | Actual observation | Your decision |
|---|---|---|---|---|
| 1 | Select the sample file, then look for Parse before scan | Parse is unavailable until **Run Demo scan** reports ready | PASS | Pending |
| 2 | Run Demo scan, parse, choose Story for `FEAT-1` | Clarification is anchored to the source line; mapping and row errors remain editable | PASS | Pending |
| 3 | Validate → Preview → Approve → Commit | Three created, one scoped update, one duplicate skip, one missing-title failure; valid receipts only for writes | PASS | Pending |
| 4 | Reload the cart URL, fill the missing title and retry | Existing source rows are not duplicated; failed row becomes created; project issue count becomes 18 | PASS | Pending |
| 5 | Start a new one-row cart and select **Simulate lost response** before commit | Unknown result appears, reload reconciles the applied receipt, total becomes 15 without duplicate | PASS | Pending |
| 6 | Try a CSS file, the malicious CSV fixture and malformed CSV | Unsupported format and unsafe scan are blocked; malformed source produces an actionable parse error | CSS/unsafe browser checks PASS; malformed CSV unit check PASS | Pending |
| 7 | Download results, Back to project work and open an imported issue | Fresh Demo scope check precedes result CSV; issue hierarchy and provenance remain visible | Demo download invoked in browser test; manual content review pending | Pending |

UX checklist: [ ] Scan gate [ ] Mapping correction [ ] Row clarification [ ] Draft hierarchy [ ] Approval/revision boundary [ ] Per-row receipts [ ] Reload/retry [ ] Cancel/error recovery [ ] Result download [ ] No file instruction execution.

Truth review: this is a **local CSV Demo** with a simulated scanner and browser-local job persistence. It is not evidence of a real storage upload, malware scan, Live import operation, authorized Google Sheets connector or secure production file retention. XLSX/PDF/text task extraction and CSS task import are unavailable. See [the contract decision](../contracts/PHASE08_DATACART_DECISION.md).

UI decision: **approved for tested local CSV Demo flows**. UX decision: **approved for tested local CSV Demo flows**. Actual user message: “I explicitly approve the UI and UX of the tested Phase 08 local CSV Demo flows. Real storage, malware scanning, server import, Google Sheets, Live Engine integration and real microphone transcription remain blocked or unverified. Preserve those statuses.” Live readiness and production deployment remain separate.
