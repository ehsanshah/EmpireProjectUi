# Existing reference behavior to preserve and verify

These are requirements extracted from the supplied references and visible session,
not proof that the current application already implements them. Phase 00 verifies.

## Project switcher / resizable shell — 3640970_0.mp4
Thin 1px divider, approximately 12px desktop grab zone and suitable touch target;
expanded width about 320px with proposed 240–640px limits constrained by viewport.
Snap intentionally closed, retain an independent icon rail/reopen control; never
leave unreadable clipped slivers. Pointer capture, temporary interaction layer,
stable body resize cursor and cleanup on cancellation/unmount. Keyboard separator
controls and RTL. Persist non-sensitive width/mode preferences; restore without
flash. Switching changes actual project data/context, not just the heading.

## Kanban — 6729630176286881453.MP4
Lifted drag preview with restrained shadow/scale/tilt; placeholder matches actual
card height; visible WIP current/limit and true policy rejection; collapsible columns;
one board with multiple swimlanes. Define whether WIP is column-global or lane-specific.
For the test, use global In Progress cap 4; rejected fifth card retains its source.
Counts include all WIP in policy scope, not only the current filter/page. Shared
command validation for drag and keyboard/menu; unmapped statuses stay visible.

## Dependency Work Flow — image(2).png
PAY-38 → PAY-42 and PAY-38 → PAY-46; both PAY-42 and PAY-46 → PAY-51.
Cards: Design error messages (Done), Retry payment (Needs decision), Record payment
events (In progress), Test and prepare release (Waiting for prerequisites).
Compact dotted canvas, curved attached edges, selected outline, owner/status/context,
two converging paths, node drawer, path/blocker highlighting and pan/zoom/fit.
Once prerequisites are satisfied, derived readiness may change; actual status/review/
release only changes through the engine. Respect redaction of hidden dependencies.

## Calendar — 3900718_0.mp4
Seven day columns, hourly grid, today/now, scroll near now, fixed headers/time gutter
and pinned all-day row. Events use a narrow category stripe with light tint rather
than saturated fills. Approximate 60px/hour; height expresses actual duration.
Overlap groups get adjacent subcolumns: 14–15, 14–15, 14:30–15:30 all visible.
Drag empty space to draft a block, 15-minute snap, move preserving duration and
bottom-edge resize; keyboard/form alternatives. Very short tasks retain true time.
All-day/date-only/multi-day/overnight and unscheduled are distinct. Preserve date-only,
IANA timezone/DST, working week and Persian/Gregorian. ScheduleBlock is an explicit
extension seam (CD-03), not a silent deadline update.

## Forms / voice — 5606692_0.mp4 and explicit user requirement
The clip demonstrates screen-reader announcements, invalid-submit explanations,
focusable action and busy state; its waveform is NOT evidence of speech input.
Implement the separately requested real mic → upload/transcription → editable text
→ typed field draft/provenance → clarifying question → approved command pathway.
No fake waveform/transcript, inferred identity/date, inferred consent or automatic
commit from dictation. Preserve manual changes on late response; per-change Undo.
If provider unavailable, mark unavailable and retain text/manual entry. Typed
transcript tests do not prove real mic. Invalid-submit gives linked inline errors
and focus guidance; busy retains focus and prevents duplicate write intent.

## Prompt-to-View golden fixture
12 visible issues: 5 completed, 1 cancelled, 6 remaining; 2 of 6 blocked, one undated.
Remaining → 6 real rows; only blocked → 2; group by owner → same 2; timeline → same
set with undated in Unscheduled; open issue → drawer; Back restores view/history.
Use explicit current IDs from the fixture; never rely on an old chat key existing
in a different dataset. Unknown prompt is honest; no arbitrary model-generated code.
Do not leak restricted objects through totals. Timeline display window is not a
query filter unless the user explicitly requests that query change.

## Visual quality
Neither earlier rejected screenshot is approved. A prototype may have a small
scope but must have deliberate typography/composition/interaction. No oversized
welcome hero, repeated KPI cards or UX design slogans inside project data.
Show useful work on the initial viewport. Glass chrome must be apparent and
readable. Preserve the audited current design if it already meets the requirement.

## AI clarification screenshot — latest addition
Use numbered answer rows, Other/free text, optional Skip and direct reply below a
contextual question card. See AI_CLARIFICATION_UX_EN.md for visual/behavior contract.
Implement reviewable component in Phase 01 and engine continuation in Phase 07.
