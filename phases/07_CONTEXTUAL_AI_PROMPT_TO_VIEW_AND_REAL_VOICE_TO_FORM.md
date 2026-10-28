# Phase 07 — Contextual AI, Prompt-to-View and real Voice-to-Form

Source delivery mapping: U4. Relevant reference sections: 6, 9–11, 13–14.

## Entry and scope
Use the previous phase foundation through Phase 06. Check PROJECT_STATE.json and dependency gaps. Missing Live adapters do not block independent UI work.
Read PROJECT_RULES_EN.md, CONTRACT_DECISIONS.md, relevant REFERENCE_INTERACTIONS
and source sections. Inventory what already works before changing it.

## Implement this phase
Consolidate a shared contextual composer for text, ready-file refs, links, mentions and microphone, with explicit scope/selection/mode. Implement the six wire output kinds, safe renderer registry, question continuations, query-run references, proposals and approved commit path. Use adapter-only legacy-name mapping and safe fallback for unknown kinds.
Execute read-only view transitions in the main workspace without repeated confirmation. Preserve the 6 remaining → 2 blocked → grouping → timeline → drawer → Back path on the labeled fixture. No arbitrary model code/HTML/SQL executes.
Implement real voice capture → authorized upload/transcription job → editable transcript → schema-bound field draft/provenance → clarification → user-approved command. Show actual changed fields; draft filling is not a resource commit. Handle entity/date ambiguity, revised manual edits, stale responses, Undo, recording cleanup and language availability. Respect the contract's approval boundary for writes; never infer consent from dictation.
If no speech provider exists, show unavailable plus manual input. Typed-transcript fixtures remain a separately labeled test path; they are not proof of live voice. Implement proposal diffs, permissions, expiry, revision-bound approval and revocation. Keep manual flows usable without AI.

## Acceptance
Read prompts change the actual view; ambiguous identities prompt choices; expired/edited proposals require revalidation. Live mic verification is reported separately. No provider means no fake transcript. User edits survive late extraction and no speech alone submits a form. Agent self-report cannot bypass evidence/review.

## Mandatory delivery
Use templates/PHASE_REPORT_TEMPLATE.md and templates/UAT_TEMPLATE.md.
Run the phase's meaningful checks plus build/typecheck where source changes occur.
Report Demo, contract-fixture, real-staging and manual/browser evidence separately.
Update phase state, feature coverage, UIAPI mapping and endpoint mapping accurately.
Record source paths, commands, errors, screenshots if available, exact review steps,
unresolved inputs/owners and the next suggested delta. Do not fabricate receipts.
Stop at awaiting_ui_ux_review. Provide a runnable UI, exact review journey and
separate UI/UX review checklists. Wait for explicit user approval of BOTH before
starting the next phase. Follow UI_UX_REVIEW_GATE.md; tests do not replace review.

## Wire clarification to the contract
Integrate the Phase 01 clarification UI with kind=clarifying_question, question IDs,
options, field_path, required and continuation_token from reference section 11.2.
Use the interaction answers endpoint, revision checks and actual session scope.
Implement multiple questions, editable answers, Other, required/optional Skip,
stale response protection and context-preserving resumable drafts. Follow
AI_CLARIFICATION_UX_EN.md for all visual and behavioral requirements.
