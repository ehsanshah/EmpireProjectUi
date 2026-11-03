# Workflow canvas review

Use the Workflow section in project settings. The page starts read-only until
the existing `Create draft` / `Resume draft` action is used. Do not reset or
replace any existing local draft to inspect this change.

## UI

1. Open the Workflow page. Verify a full-width canvas with six readable status
   rectangles. There must be no permanent blank inspector.
2. Open Large view. Inspect the staircase, arrow direction and action captions.
   Open `All` to inspect the exact incoming actions; expand individual paths to
   inspect them separately. There is no nine-transition substitution.
3. Select a node or action. Properties appear only for that selection. Closing
   properties gives the canvas its full width again.
4. Try Light/Dark, Persian/Arabic, and a short mobile viewport. Pan by scrolling
   the canvas instead of shrinking text below a readable default size.

## UX

1. Record the transition count. Click Arrange layout and verify the count and
   rules are unchanged. Move a node or use Alt+Arrow; reload and verify its
   position is retained within the same project/principal scope.
2. Create/resume a draft. Use Add transition or a connection handle. Selecting
   an already connected pair must select its action, not delete it.
3. Select a transition, change its name or required-field keys and apply. The
   draft is dirty; active tasks and published settings are unchanged. Save using
   the existing draft-revision action when ready.
4. To remove an action, open Remove this transition and explicitly confirm.
   Undo edit restores it. Arrangement is not removal or simplification.
5. Validate, approve, and publish only through the existing Demo lifecycle. A
   material graph edit must prevent reuse of an earlier preview/approval.
6. Switch to the restricted Demo policy lens. Transition edits and handles must
   be unavailable. Readable status/transition details remain inspectable.
7. Open Large view, use the keyboard, press Escape, and verify focus returns to
   the Large view button. Switching projects must clear the old selection.

The branch has not been applied to the owner's Mac port 5192 checkout. Live
Engine publication and identity-backed permissions are not verified here.
