# Contextual AI clarification card — screenshot requirement

## Visual reference and intent
The supplied screenshot shows a question in a rounded dark card, numbered answer
rows separated by fine rules, an “Other” row with a pencil, optional Skip, close
control, and a separate direct-answer input directly below. Reproduce this
interaction grammar using EmpireProject's blue glass tokens; do not copy Claude
branding, “Optimize Prompt”, desktop connection wording, or model controls.

This is normally an inline card anchored to the active contextual AI conversation,
not a full-screen modal. If the assistant is closed and the user initiates a task
that needs clarification, open its contextual panel while preserving the main
workspace and show the card there. Mobile may use a bottom sheet with correct
dialog focus behavior. Do not use a blocking modal for every ordinary question.

## When to ask
Ask when essential information is absent, a named entity resolves to more than
one allowed identity, a date needs clarification, the requested scope/action is
materially ambiguous, or engine validation returns an answerable missing field.
Do not ask merely because the assistant can think of a preference question.
Apply unambiguous read-only navigation directly. Never fabricate missing facts.

Example: “Move the remaining tasks to Ali.”
If two allowed Alis exist, show “Which Ali should receive these tasks?” with
“Ali — Backend” and “Ali — Design”. Bind options to membership IDs. Preserve the
requested task snapshot, project, query revision and original intent. Answering
resolves identity; it is not approval to bypass the normal write proposal/commit.

## Composition
- Clear concise question title and a subtle context label such as “Assign 6 tasks”.
- One short reason only when useful: “Two project members match this name.”
- Numbered options, full-row targets, selected indicator and short differentiator.
- “Something else…” reveals an editable free-text answer in place.
- “Or reply directly…” input below the card; send action has an accessible label.
- Close hides the question without deleting its pending draft or committing work.
- Optional question shows Skip; required question shows no Skip or a non-action
  explanation that an answer is needed, plus Save for later/Cancel as appropriate.
- When multiple questions are necessary show “Question 1 of 3” and Back. Ask a
  manageable sequence; do not dump a long questionnaire into the main workspace.
- Selected answers can be changed before final proposal approval. A changed answer
  creates a new continuation/revision; stale prior proposals cannot be committed.
- Scope stays visible; user should not repeatedly type the original request.

For a single-choice question, choosing an option may submit that answer directly
and advance to the next question/result; show the chosen value and allow correction.
For multi-select, use a clear Continue control. Do not add a redundant confirmation
after every single-choice answer. Clarification and irreversible action approval
remain separate steps under the source contract.

## Data and engine binding
Source wire kind is clarifying_question with interaction_id, version, questions,
question id, field_path, why_needed, options{id,label}, required and an opaque
continuation_token. Reuse the source contract's POST interaction /answers path;
the exact request body must be reconciled with OpenAPI, not invented as verified.
Keep the continuation token in scoped volatile state; no token in analytics/URL.
Each response binds question ID, resolved option ID or typed free text, revision,
scope and pending intent. Do not let an option label impersonate identity.
Allow an adapter-side presentation model for question layout/multi-select only
when the server schema/capability supports its meaning. Never reinterpret a
required question as optional merely to make Skip work.

Empty free text cannot satisfy required input. Do not guess when Other still
contains ambiguity. Local validation shows concise linked feedback. Cancel does
not mean answer accepted. Optional Skip transmits the explicit skip semantics
supported by the contract; otherwise leave it unresolved and ask the adapter owner.

## Loading, race and context
After answer submission, show a compact pending state and suppress duplicate
requests while retaining focus. Handle network error with Retry using the same
intent semantics; do not advance on failure. Reject stale continuation tokens.
Old responses must not overwrite newer answers or a different project's view.
Changing organization closes and safely clears sensitive question state. Switching
projects must not apply pending answers to the wrong project. Preserve only scoped
authorized draft context and revalidate on return. Permission loss removes options
and content that can no longer be disclosed.
Reload recovery uses a server interaction/draft reference when available. Do not
persist private prompts/tokens in localStorage just to simulate resumability.

## Accessibility and layout
English/LTR and Persian/RTL; number badges/keys remain readable with BiDi isolation.
Use semantic buttons or radio groups and associated labels, visible focus and
keyboard navigation. Do not hijack number keys while typing in text inputs.
Screen readers announce the question and meaningful result, not every token.
On close restore focus to the initiating control. Inline cards must not trap focus;
only an actual modal/bottom-sheet dialog applies modal focus containment.
Full row is touch-friendly; long labels wrap without hiding distinguishing text.
Keep dark/light contrast valid and preserve main-workspace visibility.

## Delivery phases
Phase 01: reusable component and interactive deterministic demo for user UI/UX
review. The user can select, choose Other, reply directly, go Back, close/reopen
and see required/optional behavior. Demo decision-making is explicitly labeled.
Phase 07: integrate real typed responses and revision-bound continuation endpoint.
Phase 09/10/13: reuse for plan, Agent and settings clarification as applicable.

## Acceptance scenarios
Q01: Two allowed Alis → correct question/options → selected ID retained.
Q02: Other → free text → resolved answer or concise follow-up, no guessed identity.
Q03: Required answer cannot be skipped; optional answer can be explicitly skipped.
Q04: Direct reply uses the same continuation; original intent need not be repeated.
Q05: Back/edit invalidates stale downstream proposal/approval as required.
Q06: Close/reopen preserves authorized pending state and never commits an action.
Q07: Double click/retry sends one logical answer intent and no duplicate effect.
Q08: Project switch, revoked option and stale response cannot leak/apply old data.
Q09: Keyboard/screen reader/mobile/RTL and both themes remain usable.
Q10: Final continuation changes the main view or shows the correct proposal;
     a chat acknowledgement alone is insufficient.
All Q scenarios require actual evidence in the relevant phase report. Real engine
continuation passes must be distinguished from local component demo passes.
