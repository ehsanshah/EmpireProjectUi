# Phase 14 — separate UI and UX review

**Mode:** local Demo. Start with `npm run dev -- --host 127.0.0.1 --port 5182`, then open [Project directory](http://127.0.0.1:5182/o/demo/projects?design=current). Current stored Demo data is retained. A fresh browser profile shows the canonical fixture without prior local edits. The scope selector simulates organization switch/sign-out; it is not real authentication.

## UI journey and checklist

1. Open Projects, My Work, Inbox, Search and Activity from the organization group in the sidebar. Check readable project identity, counts, cards/rows, section headings and action buttons. Project-only List/Board/Timeline filters should not appear on these pages.
2. Switch Classic/Glass and Light/Dark. Check readable opaque data surfaces and focus indicators. Compare the captured [Light directory](../docs/screenshots/phase14-project-directory-en-light.png) and [Dark directory](../docs/screenshots/phase14-project-directory-en-dark.png).
3. Switch English, فارسی and العربية. Confirm labels and direction while stored project titles stay unchanged. At 390px, inspect [Persian mobile Inbox](../docs/screenshots/phase14-inbox-fa-mobile.png), scroll, and check no clipped controls. English typography, local Vazir and Arabic font assets should remain intact.

**UI review checklist:** composition and density; project names/keys and status legibility; readable Inbox actions and search ambiguity; Light/Dark contrast; English/Persian/Arabic fonts and RTL alignment; 390px layout; visible keyboard focus. Record visual defects. **UI decision: pending.**

## UX journey and checklist

1. In Projects open Payment Platform, then browser Back. In My Work filter by Payment Platform, open an issue, close the drawer and confirm return to My Work. Paste `/o/demo/search?q=PAY-38&design=current`, open the result, then Back.
2. Search `Operations`: two project results with distinct keys `OPS` and `OPSW` should be explicit. Search `PAY-38`, `#PAY-38` or a canonical issue ID: open the same issue context. Counts and snippets must include only projects visible in the current Demo policy lens.
3. In Inbox open an Intake item and use the workspace Back control. Mark another item read, snooze it for one hour, show snoozed items, and reload. The local marker should retain its revision; a stale revision must be rejected. When a pending Review exists from the Phase 10 Demo journey, Respond should require a note and use the independent review policy. Its receipt must not imply shipping.
4. In Activity filter to one project. Compare issue before/after/version/receipt, Run events and pending operation labeling. Missing actor/time/version must say unknown. Open an activity context and return.
5. Set Demo scope to “Other organization · no grants”, then “Signed out · simulated”. Restricted project names, cards, snippets and selection should disappear. Restore Demo organization. Try keyboard Tab/Enter and browser Back on desktop and mobile. Confirm no real external message is sent.

**UX review checklist:** task completion across projects; actual context links and Back; ambiguous search choice; read/snooze/Review response validation, receipt and recovery; stale/expired/revoked scope; keyboard navigation; honest pending vs committed state. **UX decision: pending.**

Automated evidence: `npm run build` passed; `npm test` passed **123/123**; Phase 14 Chrome **8/8** passed. Live organization APIs, server ACL, event stream and external channel delivery remain blocked/unverified. User approval of both UI and UX has **not** been received for Phase 14; do not start Phase 15.
