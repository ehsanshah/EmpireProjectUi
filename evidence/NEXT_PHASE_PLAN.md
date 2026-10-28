# Proposed Phase 01 delta (not started)

The current project switcher, shell, List/Board/Timeline, calendar and voice form already exist. Phase 01 should consolidate rather than rebuild them.

1. Keep `src/ProjectSwitcher.tsx` behaviors and `src/projects.ts` local fixture adapter. Add a route/context plan for `/o/:orgId/p/:projectId` and work views; distinguish local project selection from authorization. Avoid empty navigation destinations.
2. Consolidate repeated blue glass tokens across `src/styles.css`, `src/glass-preview.css`, and view CSS. Review at 390/768/1440, English/Persian and both themes; preserve readable opaque data surfaces and the existing desktop/table interaction density.
3. Add the deterministic interactive clarification card requested by `AI_CLARIFICATION_UX_EN.md` in the contextual assistant: numbered choices, Other, direct reply, required/optional Skip, close/reopen, focus and mobile handling. Label it Demo; Phase 07 owns engine continuation.
4. Verify project switch, resize, restored view/draft and stale-response behavior with focused browser checks; capture real screenshots. Record source paths and user-visible results. Do not relabel local mock authorization as Live.
5. Before Live API work, obtain Backend OpenAPI/event schemas and examples, DevOps staging URL, and IAM session/CSRF/test account approach. Make an ADR for any actual contract mismatch. No speculative endpoint is marked verified.

Phase 01 starts only after explicit approval of both Phase 00 UI and UX review under `UI_UX_REVIEW_GATE.md`.
