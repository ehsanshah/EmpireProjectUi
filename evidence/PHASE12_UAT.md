# Phase 12 — UI and UX review journeys

Mode: **local Demo only**. Start with `npm run dev -- --port 5179` and open [Overview](http://127.0.0.1:5179/o/demo/p/empire/overview?design=current). Use Reset issue data for the canonical 14-issue fixture. Phase 12 release drafts, plan approvals and Run records are browser-local Demo data; a fresh browser profile gives a clean journey. No real delivery is performed.

## UI review checklist — visual presentation

- [ ] **Overview:** From the Overview route, inspect Sprint goal, project objective, recorded blockers, pending intake decisions, release and budget. Observation, interpretation and hypothesis read as different kinds of evidence. No decorative KPI grid replaces actions.
- [ ] **Reports:** Open Reports → Flow and Sprint. Check definition, unit, source query, snapshot, as-of, completeness, chart/table and source citation display. Flow chart rows reconcile to the visible 14-issue snapshot. Sprint completed points show Unknown with missing estimates.
- [ ] **Release:** Open Releases. Check issue/artifact scope, environment label, gate reasons, approval state, queued state, failed/simulated shipped state and receipt display. Accepted artifact and shipped state are visually distinct.
- [ ] **Locales and themes:** Inspect English LTR/Classic/Light, Persian RTL/Vazir and Arabic RTL/local Arabic font. Switch Light/Dark. Project titles and issue descriptions keep their stored language. At 390px, swipe the compact section shortcut row and scroll the workspace; no horizontal page overflow should appear.
- [ ] **Gallery consistency:** After the simulated delivery journey, the accepted Phase 10 artifact still shows its version, review and lineage; `simulated shipped` is visibly labeled.

## UX review checklist — interaction and truth

- [ ] **Signal → records:** Click “2 recorded blockers” to open EMP-103/EMP-104 in the main List, then Back to Overview. Click the project objective and return from Intake. Each signal reaches its actual source.
- [ ] **Natural language → main view:** Enter “Show flow report” or “Show sprint report” in the command dock. The main workspace becomes that report. Follow a chart row to a filtered List, Back to the report, then open an issue citation and close its drawer.
- [ ] **Export:** Focus the scoped CSV button with keyboard and press Enter. The file name carries the frozen snapshot ID. If records/access change, rerun the report before exporting; expired Demo tickets are not used.
- [ ] **Gates:** Create a Demo release scoped to EMP-103. Preview shows unfinished/blocker and missing independent-review reasons; approval remains disabled. A changed scope needs a new preview. A stale approval must not queue delivery.
- [ ] **Positive Demo journey:** Intake objective → clarify → plan approve → separate execution request → simulate Agent readiness → assign a completed scoped issue (EMP-107) → simulated Run artifact → independent accept → Releases select EMP-107 and accepted artifact → preview/approve → request delivery. Queued is not shipped. Reload and reconcile the Demo operation; only the simulated success receipt marks `simulated shipped` in Releases/Gallery.
- [ ] **Negative Demo journey:** Choose simulated failure before delivery. Reconcile; no shipped receipt appears. Browser disconnect or reload does not assert a server job stopped.
- [ ] **History/focus/scope:** Use browser Back and in-app Back from report drill-downs. Switch to Payment project; its report has 4 scoped issues and no Empire records. Verify keyboard focus, RTL and mobile operation.

Observed automation: `npm test` **98/98 pass**; focused Chrome browser journeys **8/8 pass** (`tests/browser/phase12.spec.ts` + `tests/browser/routes.spec.ts`). Manual user UI and UX decisions are **pending**. Live readiness, real storage/authorization/indexing/Agent execution/speech and production deployment remain separate and unverified/blocked.

UI decision: **pending**. UX decision: **pending**. Actual user Phase 12 approval message: **not received**. Do not begin Phase 13 until both are explicitly approved.
