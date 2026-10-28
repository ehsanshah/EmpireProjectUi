# Phase 01 — user UI and UX review

Environment: local deterministic Demo. From repository root run `npm ci`, `npm run dev -- --port 5173`, and open the URL printed by Vite with `?design=glass`. This run used port 5174. `Reset demo` restores the current **14 issue** fixture; counts are calculated from data. The separate `fixtures/sprint12-historical-acceptance.json` is an automated historical test scenario, not a UI mode.

| Journey | Actions | Expected visible result | Verified this phase | User feedback |
|---|---|---|---|---|
| Clarification choice | In assistant choose **Preview clarification**, then Sara Moradi | Numbered options and differentiators appear; the chosen name appears in a local answer summary; issue count/status does not change | Chrome test PASS | Pending |
| Other and direct reply | Edit answer → **Something else…** → enter text; close and reopen | Typed draft survives close/reopen; sending shows the text and a no-action message | Chrome test PASS | Pending |
| Required/optional | Try empty send; switch to **Optional** and Skip | Empty required reply shows linked error; Skip exists only for optional question | Chrome test PASS | Pending |
| Command context | Type `Assign remaining tasks to Sara` in composer | Assistant opens the Demo clarification card; no assignment or data write occurs | Chrome test PASS | Pending |
| Project scope | Open clarification, then switch to Storefront | Old question closes and Storefront records/context appear | Chrome test PASS | Pending |
| Route and history | Open `/o/demo/p/payment/work?view=board&design=glass`, choose Timeline, use browser Back | PAY Board loads directly; Back restores Board and PAY context | Chrome test PASS | Pending |
| Fixture truth | Reset Demo; choose Remaining then Blocked | Current workset counts are 14 total, 8 remaining, 2 blocked; no count literal drives display | Unit/browser PASS | Pending |

## UI checklist — decision pending

- Composition: card sits inside the contextual assistant while the main workspace remains visible; check density at 1440, 768 and 390px.
- Typography and density: question, context, numbered rows, Other and reply input scan easily; long Persian text wraps without loss.
- Glass/readability: contrast and focus rings in dark and light; table remains readable behind/alongside assistant.
- Direction/themes: English LTR, Persian RTL, light/dark controls and mixed Latin names/keys.
- Responsive defects: assistant stacking, touch targets, project browser and horizontal work toolbar.

Screenshots of the running UI: `phase01-desktop-en-dark.png`, `phase01-tablet-en-light.png`, `phase01-mobile-fa-light.png`. Screenshots supplement the interactive review.

## UX checklist — decision pending

- Discoverability: preview entry, supported command, required/optional Demo controls and manual project/work navigation.
- Task completion: choose ID-bound option, enter Other/direct text, correct an answer, close/reopen and skip an optional question.
- Context/history: project-scoped question clears on switch; work views and browser Back restore local context.
- Keyboard/focus: card receives focus; close/Escape returns to preview trigger; input has label/error; test Tab and focus on mobile.
- AI clarification truth: no actual Engine continuation, assignment, approval or message is sent; selected option is only a local preview answer.
- Loading/error/conflict/recovery: empty reply is handled locally; network retry, stale continuation, revocation and conflict require Live contracts in later phases.

UI decision: pending. UX decision: pending. No Phase 01 approval message has been received. Both explicit decisions are required before Phase 02. Live readiness and deployment remain separate from visual/interaction approval.
