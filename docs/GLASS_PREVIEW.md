# Glass design comparison

**Latest update:** following Phase 06 review feedback, Classic in light mode is the default. The prior navy design is labeled **Classic** (`?design=current` remains the route identifier); Glass remains selectable through the switch or `?design=glass`. The comparison history below records earlier defaults and decisions.

Status: `awaiting_visual_and_interaction_review` / `awaiting_prototype_review`.

The existing navy design remains the default at http://127.0.0.1:5173/.
The reference-inspired experiment is available at http://127.0.0.1:5173/?design=glass.
Use **Current / Glass preview** in the top bar to compare without losing the current query, selection, history, edits or draft. No approval or replacement has been recorded.

## Preservation

- The existing visual stylesheet remains in `src/styles.css`.
- The experiment is isolated in `src/glass-preview.css` under `data-design=glass`.
- A source snapshot from before this experiment is saved at `docs/snapshots/blue-workspace-before-glass-preview.tar.gz`. It contains source, fixtures, lockfile, configuration, tests and handoff documentation; not browser-local user data.
- Issue and draft storage keys and interaction logic are unchanged. Design selection is carried in the URL, not persisted as a new default.
- The glass experiment uses a fixed glass palette; the current design retains its existing dark/light theme selector.

## Visual adaptation

The attached image informed the floating rounded shell, narrow dark navigation rail, bright translucent edges, frosted inset panels, pearl-colored action buttons and blurred urban background with warm lights. The prototype keeps its working issue and investigation views; no decorative performance scores or nonfunctional messaging cards were introduced.

Actual Chrome screenshots were inspected and spacing corrected so investigation actions remain visible. Desktop and 390px mobile screenshots are in `docs/screenshots/glass-preview/`.

## Checks

Build and typecheck passed. All 13 core tests and all 6 Chrome tests passed. The added comparison test verifies opt-in routing, switching back with the same result set and investigation, Back behavior, a visible mobile composer and no document-width overflow. Existing journey and persistence tests also pass.

## Background asset provenance

Asset: `public/images/courtyard-dusk.png`.
Generated using the built-in image_gen tool (not the CLI). This is only a decorative environment; the delivered screenshots show the real running UI.

Final generation prompt:

> Use case: photorealistic-natural. Asset type: atmospheric background wallpaper behind a real glass project workspace, landscape 16:9. Primary request: cinematic intentionally defocused contemporary city courtyard at blue hour, layered modern buildings on left and right, distant dusky lavender sky in upper middle, amber window lights and warm orange streetlight bokeh low on both sides, hints of foliage and reflective pavement. Camera: broad soft optical defocus, recognizable architectural masses but no sharp detail. Palette: slate indigo, muted lavender, amber and subtle cyan. Central area medium-dark and low contrast suitable behind translucent UI panels. No interface, cards, borders, words, text, logos, people, watermark. Generate ONLY the environmental background, not a mockup.

No backend, external messaging or additional product module was added. Await the user's choice before making this experiment the default.
