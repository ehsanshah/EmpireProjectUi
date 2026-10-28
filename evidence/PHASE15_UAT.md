# Phase 15 — final UI and UX review journeys

Status: **final UI and UX approved by the user for the local Demo on 2026-10-28**. The following journeys remain the review record; their per-row decisions were not separately recorded. Review the **local Demo/UI-only** build at [Project directory](http://127.0.0.1:5183/o/demo/projects?design=current) or [Store checkout](http://127.0.0.1:5183/o/demo/p/empire/work?design=current&view=list) when the container is running. The Docker image has no API server and returns 503 from `/api/`. Use a fresh browser profile for fixture-only counts; keep your existing profile if reviewing your saved Demo changes. The current fixture is 14 total / 8 remaining / 2 blocked remaining; the 12/6/2 historical scenario is separate.

## UI review checklist — appearance and readable states

| Check | Steps | Expected visible result | Automated observation | Your decision |
|---|---|---|---|---|
| Approved shell/defaults | Open Store checkout in a fresh profile | Classic, Light, Agent closed; project selector and tabs remain readable | Built-image Chrome observed these defaults | Not recorded separately |
| Work surfaces | Switch List → Board → Timeline; open Calendar and planning | Issue row/card color is visible on both sides; status/WIP/unscheduled labels remain readable; no clipped planning tabs | Browser regression and captured built-image List | Not recorded separately |
| Light and Dark | Toggle theme on Board, organization directory and Knowledge | Opaque data surfaces and legible controls in both themes | Browser theme checks; manual judgment pending | Not recorded separately |
| English/Persian/Arabic | Change Language, inspect issue keys and stored titles | English stays LTR; Persian Vazir and Arabic font load in RTL; identifiers remain legible; stored content is not translated | Font loads and RTL checked in Chrome; Arabic org labels corrected and browser-tested | Not recorded separately |
| Mobile and reduced motion | Narrow to ~390px, review List/Board/Inbox; set OS reduced-motion preference | No page-wide horizontal spill; controls remain reachable; animations are suppressed | Arabic mobile overflow false, reduced-motion computed 0.01ms; screen-reader review pending | Not recorded separately |
| Error/empty/unknown states | Use Demo scenarios, unavailable source and unknown capacity | Missing data, blocked Live capability and errors are visually distinct from success | Browser/domain tests cover representative states | Not recorded separately |

## UX review checklist — behavior and recovery

| Journey | Steps | Expected visible result | Automated observation | Your decision |
|---|---|---|---|---|
| Context and Back | Projects → Store checkout → Remaining → Board → open issue → Back; switch to Payment and back | Main workspace query/count changes; drawer context and browser history restore correctly | `flows`, `routes`, `projectSwitcher`, Phase 14 browser tests pass | Not recorded separately |
| WorkItem and Board | Edit a field; trigger Demo conflict; move a card at WIP limit; use keyboard/menu alternative | Invalid/conflict drafts remain; rejected move keeps source position; valid command shows receipt | Phase 03/04 and kanban tests pass | Not recorded separately |
| Calendar and Sprint | Move a scheduled block, Undo, inspect deadline; complete Sprint with unfinished work | Deadline unchanged; disposition required; unknown capacity remains unknown | Phase 05/06 tests pass | Not recorded separately |
| AI and voice | Ask “Show remaining issues,” “Only blocked,” then “Show them on the calendar”; answer a clarification; try typed transcript and Stop/Cancel | Main view changes; stale/required question is guarded; dictation never submits | Phase 07 and voice tests pass with typed transcript and mocked recognition only | Not recorded separately |
| Import and plan | Import the sample CSV, inspect row errors, retry failed rows; edit plan after approval | No duplicate issues on retry; material edit invalidates approval; execution request labeled simulated | Phase 08/09 tests pass | Not recorded separately |
| Agent, Review, Knowledge | Submit/reject/revise/accept Demo artifact; open cited source version then revoke access | Submission, acceptance and shipping distinct; old versions retained; revoked content hidden | Phase 10/11 tests pass | Not recorded separately |
| Reports, release and administration | Drill into a report signal; try release without gate; preview/publish Board settings with a restricted user | Scope/total reconciliation; missing gate rejected; approval revision and permission enforced by Demo policy | Phase 12/13 tests pass; no server IAM claim | Not recorded separately |
| Organization | My Work → issue → Back; Inbox read/snooze/respond; search ambiguous project name; simulate scope loss | Project context preserved; duplicate response guarded; restricted projections cleared | Phase 14 tests pass | Not recorded separately |
| Keyboard/focus | Tab through navigation and dialogs; Enter on buttons, Escape to close; check focus returns | No mouse-only critical path; focus remains visible and returns to trigger | Browser keyboard tests pass; manual assistive-technology review pending | Not recorded separately |

## Truth and Live boundary review

- The UI must say **Demo**, **simulated**, **unknown**, **pending**, **accepted** and **shipped** according to actual local evidence. A Demo receipt proves only a local simulated command.
- Real microphone transcription, Live Engine, server grants, storage scan/import, Agent execution, Knowledge indexing and delivery remain blocked or unverified. The UI-only container's `/api/` 503 is intentional.
- The complete row-level classification is in `PHASE15_FEATURE_MATRIX.csv`, `PHASE15_UIAPI_MATRIX.csv` and `PHASE15_ENGINE_MATRIX.csv`; known gaps and owners are in `PHASE15_REPORT.md` and `docs/PHASE15_HANDOFF.md`.

**UI decision: approved for the local Demo. UX decision: approved for the local Demo.** Actual user message: “I explicitly approve the final UI and UX of the Phase 15 local Demo.” This approval does not verify Live integration or Production readiness; those gates remain blocked. See `UI_HANDOFF.md` and `ENGINE_INTEGRATION_BACKLOG.md`.
