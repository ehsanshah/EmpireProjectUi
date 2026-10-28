# Shared workspace color system — Phase 10 UI feedback

The user's 2026-10-28 feedback requested one coherent, polished color language across the application, with a user choice. The attached video was inspected at multiple points: it emphasizes neutral data surfaces, borders, one primary accent and compact status cues. The sticky-note board image was treated as a negative example of loud per-card coloring.

## Implemented behavior

- Classic/Light remains the default. The existing Glass and Dark options remain available.
- The top bar has a keyboard-accessible **Workspace color** control with four restrained accent choices: Ocean, Forest, Iris and Copper. The choice persists in localStorage under `empire-ui-accent-v1`; it does not alter project or issue data. Changing project, page or view keeps the choice. Selecting a color or pressing Escape closes the picker and restores focus to its trigger.
- `src/colorSystem.css` defines shared canvas, surface, border, ink, muted, accent and semantic-state tokens for Light and Dark. Board cards now carry a visible accent-tinted fill and matching 5 px rails on both left and right, including the lifted drag preview; List rows use alternating accent tints and a 4 px side rail. Hover, focus and selected rows deepen the same accent. The work remains in one chosen color family, while status states keep separate semantic labels and icons. Accent also appears in navigation selection, primary actions, focus, progress and Calendar/Timeline/Work Flow cues. Success, warning, error and review remain semantic, with labels and icons carrying meaning as well as color.
- The shared treatment covers List, Board, Timeline, Calendar, Planning, Work Flow, Intake, DataCart, Agent/Run/Review, project context, clarification and voice form. The current and historical issue fixtures, commands, counts and Run/review behavior are unchanged.

## Verification

`npm run typecheck` passed. `npm run build` passed with the existing Vite >500 kB chunk warning. `npm test` passed 90/90. `npx playwright test tests/browser/colorSystem.spec.ts --workers=1` passed 5/5: saved choice, keyboard focus, all ten workspace routes, Persian RTL mobile menu bounds, visible Board/List color in Light and Dark, and mobile work surfaces. Screenshots were inspected:

- [Planning, Forest Light](screenshots/color-system-planning-forest.png)
- [Board, Forest Light](screenshots/color-system-board-forest.png)
- [Agents, Forest Light](screenshots/color-system-agents-forest.png)
- [Board, Copper Dark](screenshots/color-system-board-copper-dark.png)
- [Persian mobile, Iris Dark](screenshots/color-system-mobile-fa-dark.png)
- [List rows, Iris Light](screenshots/color-system-list-iris-light.png)
- [Board cards, Iris Light](screenshots/color-system-board-iris-light.png)
- [Board cards, Iris Dark](screenshots/color-system-board-iris-dark.png)
- [List rows, Forest Persian mobile](screenshots/color-system-list-forest-mobile-fa.png)
- [Board cards, Forest Persian mobile](screenshots/color-system-board-forest-mobile-fa.png)

Human UI/UX approval of this correction remains pending as part of Phase 10. No Live or real Agent capability is implied.
