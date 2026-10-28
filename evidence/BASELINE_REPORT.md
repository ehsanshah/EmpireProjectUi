# Phase 00 — actual baseline report

Date / branch: 2026-10-27 / `main` (dirty before audit). User request: execute Phase 00 only. Implementation status: `awaiting_ui_ux_review`. Demo status: `PASS` for the existing tested flows. Live status: `UNVERIFIED`. User acceptance: pending; UI review pending; UX review pending.

## Outcome and source changes

The existing app was inspected and run without changing application source. Added this audit, contract/coverage state updates and two real browser screenshots. The current default is English/LTR dark glass; Persian/RTL and light theme are controls in the top bar. The local fixture currently has **14** Empire issues, **8** remaining and **2** blocked. This differs from the older `docs/PROTOTYPE_SCOPE.md` count of 12/6/2 because `fixtures/sprint12.json` was expanded with synthetic Kanban cards. Existing README and tests explicitly describe the 14/8/2 baseline. This is a scope drift to review, not a Phase 00 data rewrite.

## Run and review

From repository root: `npm ci`, `npm run dev -- --port 5173`, then `http://127.0.0.1:5173/?design=glass`. If 5173 is occupied, Vite selects the next port; use its printed URL. This audit started a local instance on `http://127.0.0.1:5174/?design=glass`. No credentials or external services are needed. `Reset demo` restores local issue/calendar/flow data; project and saved-draft preferences may use separate local keys (see README).

| Check | Mode/environment | Command or interaction | Actual result | Evidence |
|---|---|---|---|---|
| Build | Local Demo, Node 22.17 | `npm run build` | PASS; Vite 6.4.5, 1608 modules, output in `dist/` | command output this audit |
| Typecheck | Local Demo | `npm run typecheck` | PASS | command output this audit |
| Unit | Local Demo | `npm test` | PASS, 8 files / 37 tests | command output this audit |
| Browser | Local Demo, installed Chrome | `npm run test:e2e` | PASS, 28 tests / 35.1s | command output this audit; screenshots below |
| First sandbox launch | Local | `npm run dev` | FAIL: `listen EPERM 127.0.0.1:5173`; retry with local server permission succeeded and selected port 5174 | command output this audit |
| Visual snapshot | Local Chrome, 1440×900 | opened 5174 and captured page | PASS for capture, visual quality awaits user review | [desktop screenshot](phase00-baseline-desktop.png) |
| Mobile snapshot | Local Chrome, 390×844 | selected Persian and light theme, captured page | PASS for capture; `html lang=fa dir=rtl`; visual quality awaits user review | [mobile screenshot](phase00-baseline-mobile-fa-light.png) |
| Contract-fixture | Proposed source contract | source/catalog inspection | UNVERIFIED as a machine-readable contract; no OpenAPI/event schemas | `REPOSITORY_AUDIT.md` |
| Real staging | None supplied | no request attempted | UNVERIFIED | Backend/DevOps/IAM inputs missing |

## Gaps and risks

| Gap | Capability | Owner/input | Independent next work | Exit evidence |
|---|---|---|---|---|
| No actual OpenAPI/event schema/backend repository | Typed Live API | Backend/Tech Lead | Design/UI consolidation and proposed adapter mapping | versioned schemas + actual operations + examples |
| No staging URL/network, auth/session/CSRF/test identities | Live verification | DevOps/IAM/Backend | Local Demo review | authorized non-production access and tests |
| No voice provider/upload/retention policy | Live speech | AI/Security | Manual/typed form review | provider contract, consent and non-production test |
| 14/8/2 fixture versus older 12/6/2 acceptance | Baseline review oracle | Product/QA | Phase 01 shell can preserve current fixture | explicit choice of current expanded fixture or revised acceptance |
| No clarification card | Phase 01 AI UX | Product/UI | Build deterministic preview after approval | user UI/UX review of numbered options/Other/direct answer |

## Contract changes

None. The source v1.0 catalog remains proposed. `contracts/ENGINE_MAPPING.csv` has no fabricated actual operations or test receipts.

## Separate user approvals

UI review: pending; actual user approval message: not received. UX review: pending; actual user approval message: not received. Phase 01 must wait for both.

## Next phase

See `NEXT_PHASE_PLAN.md`. The Phase 00 audit is ready for the user's baseline and delta review; no Phase 01 implementation was started.
