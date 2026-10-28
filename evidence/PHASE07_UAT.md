# Phase 07 — separate UI and UX review

Environment: local Chrome Demo at [Phase 07 planning UI](http://127.0.0.1:5177/o/demo/p/empire/planning). Start with `npm ci` and `npm run dev -- --host 127.0.0.1 --port 5177` if the preview is not running. Use **Reset issue data** to restore the 14-issue current fixture. The historical 12/6/2 fixture is separate and is not the displayed default.

## UI review journey

| Step | Inspect | Expected visible result | Actual browser observation | Your decision |
|---|---|---|---|---|
| 1 | Open planning without parameters at desktop width, then about 680px | Classic/light, readable unclipped tabs, Agent closed | PASS in prior and full Phase 07 regression | Pending |
| 2 | Click Agent; open Context and inputs | Context, scope, selection and mode readable; panel can close and restore focus | PASS in Chrome tests | Pending |
| 3 | Enter “Assign remaining tasks to Sara” | Numbered card, two distinct Sara choices, required first question, optional second | PASS in Chrome tests | Pending |
| 4 | Complete question and inspect proposal | Before/after, eight-item scope, permission, evidence basis, expiry and approval controls readable | PASS in Chrome tests and inspected capture | Pending |
| 5 | Switch to Persian at 390px; open Agent/clarification; inspect form in light mode | RTL, keyboard focus and controls usable without hover | PASS in Chrome tests; human visual acceptance pending | Pending |

UI checklist: [ ] Classic/light and tabs [ ] Agent closed/open layout [ ] Question hierarchy/contrast [ ] Proposal diff/readability [ ] Persian RTL/mobile [ ] Focus visibility.

## UX review journey

| Step | Try | Expected behavior | Actual browser observation | Your decision |
|---|---|---|---|---|
| 1 | Command “Show remaining issues” then “Only blocked” | Main records and count change to 8 then 2; second request refines the same query | PASS: main workset and count changed | Pending |
| 2 | “Show them on the calendar”; “Open EMP-104”; “Back” twice | Calendar keeps filter; drawer opens; Back restores earlier state | PASS | Pending |
| 3 | “Assign remaining tasks to Sara”; try Skip on required question, choose Sara, Skip optional reason; Edit/Reject or approve | Required answer cannot be skipped; proposal is a separate approval; only valid receipt confirms write | PASS in Demo tests | Pending |
| 4 | “Set EMP-101 due on Tuesday”; type “Tuesday” then exact date | Ambiguous answer rejected; date-only proposal never creates a time block | PASS | Pending |
| 5 | Open New project → Typed transcript test mode, extract, manually edit, Undo and Create | Fields fill visibly, newer manual edits survive, Undo affects only speech changes, no dictation submits | PASS; typed-test path only | Pending |
| 6 | Start recording in a supported browser with permission, then Stop/Cancel or navigate | Explicit capture, editable transcript, tracks released; unsupported provider explains unavailability | Mocked capture and cleanup PASS; **real hardware/provider unverified** | Pending |
| 7 | Change project while a question or proposal is open; retry an expired/edited proposal | Old answer/approval cannot apply to new scope | Demo revision/scope checks PASS; Live unverified | Pending |

UX checklist: [ ] Main view changes [ ] Context/history [ ] Clarification correction/Skip [ ] Proposal boundary and receipts [ ] Voice draft/Undo [ ] Unavailable and conflict states [ ] Manual workflow remains usable.

Truth check: 14/8/2 derives from the current workset; 12/6/2 is historical. Demo interactions and receipts are labeled. Browser SpeechRecognition may use its own service. Typed transcript and mocked speech tests are not proof of real microphone/provider success. Live Engine AI, proposal and speech are blocked pending the inputs in `contracts/PHASE07_AI_VOICE_DECISION.md`.

UI decision: **pending**. UX decision: **pending**. Actual Phase 07 approval message: **not received**. Both must be explicitly approved before Phase 08. Live readiness and production deployment are separate from UI/UX acceptance.

## Recorded decision — 2026-10-27

The user explicitly approved UI and UX **of the tested Phase 07 Demo flows**. The pending fields above describe the original handoff. Real microphone transcription and Live Engine integration remain unverified and were expressly excluded from the approval. Phase 08 was authorized separately.
