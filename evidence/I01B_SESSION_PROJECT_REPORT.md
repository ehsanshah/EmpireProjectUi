# I01-B session and authorized project-bootstrap report — 2026-10-29

## Status and scope

**I01-B implementation:** session, logout, authorized organization/project list and project detail handlers, plus a limited opt-in browser binding, complete under injected interfaces. **Runtime authentication:** BLOCKED because no real identity provider, shared session store or server-side Engine credential exchange is configured. **Real staging/identity integration:** NOT RUN. **Live WorkItem/SSE:** disabled. **Production readiness:** BLOCKED. The approved Demo UI and fixtures are unchanged.

This submitted report is the user's I01-B review artifact under their stated report-as-approval rule. It does not imply real SSO, staging authorization or Live acceptance.

## Revisions and changed paths

- Frontend checkout before edits: `ca1ebefd8348644b62d6218688ea42bb6079b51f` on `main`, with the uncommitted accepted I01-A files present. I01-B changed `.env.example`, `src/main.tsx`, and added `src/core/i01bProjectClient.ts`, `src/core/LiveProjectBootstrap.tsx`, `tests/i01bProjectClient.test.ts`; it updated `contracts/BFF_I01_PROPOSED.openapi.yaml`, `contracts/I01_ENGINE_BROWSER_MAPPING.md`, `ENGINE_INTEGRATION_BACKLOG.md`, and this report. The I01-A worktree changes were preserved.
- Sibling Engine checkout before edits: `96776c8ef8f444c6a3872e2f592c56363c66f004` on `main`, with unrelated in-progress changes. During this slice another update advanced its HEAD to `6ff9b5eaf7df5a9f3dc94260fd6d2531ab9456ee`; only the new `services/gateway/` directory remains uncommitted there. I01-B added `services/gateway/gateway/{doc,session,project,handler,handler_test}.go` and `services/gateway/README.md`. No existing Engine service source was overwritten.
- Current `contracts/openapi/project-access.v1.yaml` SHA-256: `085e827e8626dc3c0b1f3b5b4a09fbb37ac11de46ae4941472079db6761b73c3` (unchanged from I01-A). Existing route ownership is `services/project-access/projectaccess/routes.go`; intended Gateway/Session BFF topology is in backend instructions §5/§17. No existing browser gateway/BFF implementation was found, so the new boundary lives at that documented `services/gateway` location and owns **no** project database.

## Implemented behavior

1. `gateway.New` requires injected `IdentityProvider`, `SessionStore`, `CredentialProvider`, exact HTTPS origin and configured project-access URL. Missing providers return `ErrUnconfigured`; there is no header-trusted identity, development bearer fallback or anonymous project response. No runtime provider configuration was found.
2. `GET /api/session` authenticates only through the provider interface and creates a random opaque server-side session. The cookie is `ep_session`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`, expires at the earlier of provider expiry or 30 minutes. The browser receives only identity/scope, locale/timezone, session-bound CSRF token and expiry. Each subsequent request checks store expiry and provider `Active`; revoked/expired sessions are cleared.
3. `POST /api/session/logout` requires current cookie, exact configured `Origin` and matching `X-CSRF-Token`, deletes the server-side session and clears the cookie. This revokes the BFF session; federated IdP logout semantics remain an explicit IAM decision. All API responses use `Cache-Control: no-store`; non-TLS requests fail closed.
4. Project list/detail proxy only the existing project-access `listProjects`/`getProject` operations. Server-only credentials are supplied by the injected credential provider. Upstream redirects are not followed. The mapper requires the current Engine project fields, matching org/project IDs and resource refs, valid revisions, permission actions, count metadata and strong detail ETag matching the resource version. It preserves canonical IDs, keys, count, cursor, per-project permission revision, detail permission revision and ETag. Foreign org is hidden as 404; guessed/forbidden detail returns 404 without upstream metadata. Upstream auth failure returns 503, malformed response 502; neither falls back to Demo.
5. `GET O/capabilities` returns an honest `501 CAPABILITY_CONTRACT_UNAVAILABLE`; no unsupported feature is advertised. All WorkItem, transition, key-resolution and SSE paths remain outside this handler.
6. `ProjectBootstrapClient` validates BFF JSON independently, uses same-origin credentials, keeps authoritative count/cursor, aborts or ignores late responses, clears old scope on new bootstrap/project switch/logout/401/expiry, and preserves detail ETag. Its limited view supports project detail and browser Back. It appears only when **both** `VITE_CORE_MODE=live` and `VITE_I01B_PROJECT_BOOTSTRAP=enabled` are explicitly set. `.env.example` leaves Demo and the I01-B flag disabled by default. The full Live client remains fail-closed; no Demo response is substituted.

## Actual verification and redacted evidence

| Check | Command and observed result | Evidence boundary |
|---|---|---|
| Gateway handler tests | `go test ./services/gateway/gateway -count=1 -v` — **5/5 passed**: missing/expired/revoked session and logout; authorized pages/detail; scope/denial; unconfigured fail-close; malformed/redirect rejection. | `httptest` identity, in-memory fixture store and `httptest` project-access. **Not** actual IdP or Engine HTTP. |
| Gateway static checks | `go vet ./services/gateway/gateway` — **passed**. | New package only. |
| Existing project-access package | `go test ./services/project-access/... -count=1` — **compiled**, reported `[no test files]`. | Not an integration test. |
| Browser adapter | `npm test -- --run tests/i01bProjectClient.test.ts` — **10/10 passed**: disabled-by-default flag, mapping/scope, count/cursor/ETag, delayed switch and stale 401 isolation, expiry, logout, upstream denial and authorization-outage purge, organization switch cleanup. | Mocked fetch responses, not actual Engine. |
| Frontend regression | `npm run typecheck` — **passed**; final `npm test` — **27 files / 135 tests passed**; `npm run build` — **passed**. Vite emitted its existing large-chunk warning. | Demo regression and opt-in adapter checks, no real login. |
| Contract/secret checks | `ruby contracts/validate_i01_contracts.rb /Users/ehsanshahbakhti/GolandProjects/EmpireProject` and `git diff --check` — **passed**. Scan of `dist` for `server-only-fixture-token`, `EP_USER_TOKEN_KEY`, `EP_SERVICE_TOKEN_KEY`, `ept1.` and `Authorization: Bearer` — **no matches**. | Static bundle-marker check; not a full credential audit. |
| Demo review URL | Started Vite at `http://127.0.0.1:5185/o/demo/p/empire/work?design=current`; `curl` returned **HTTP 200**. | Existing approved Demo UI only. |

Fixture request/response observations (values are synthetic and redacted):

```text
GET  /api/session                     → 200; Set-Cookie: ep_session=<opaque>; HttpOnly; Secure; SameSite=Lax
GET  /api/ep/v1/orgs/o1/projects?limit=1 → 200; meta.count={value:2,relation:exact}; next_cursor=next1; data length=1
GET  /api/ep/v1/orgs/o1/projects/p1  → 200; ETag="p1:2"; data.permission_revision=3; meta.permission_revision=grant-3
GET  /api/ep/v1/orgs/o1/projects/guessed → 404 PROJECT_NOT_FOUND; no upstream private body
POST /api/session/logout (wrong Origin or CSRF) → 403 ORIGIN_OR_CSRF_DENIED
POST /api/session/logout (both valid) → 204; cookie cleared; prior session → 401
```

## Missing runtime inputs and next step

- IAM/Security: configured OIDC or equivalent **server-verifying** identity provider, active/revoked-session check, federated logout policy, session expiry policy and authorized non-production test principals. No identity was invented and no secrets are requested in chat.
- Platform/Backend: shared revocable `SessionStore`, server-side per-principal credential exchange compatible with project-access's current authorization, exact HTTPS origin, project-access URL, TLS termination/trusted-proxy decision, same-origin `/api` routing and non-production deployment wiring. The gateway currently requires direct TLS at the handler; proxy termination needs an explicit trusted boundary design.
- Backend/Product: authoritative organization capability schema and permission revision source. Until then `GET O/capabilities` stays 501. Organization directory/alias contracts remain outside I01-B.
- QA/DevOps: reachable authorized staging, isolated allowed/forbidden org/project fixtures, expired/revoked identities and redacted request/response capture. `EP_TEST_ADMIN_DSN`, `EP_OIDC_ISSUER` and `EP_BFF_ORIGIN` were absent in this environment; no real local PostgreSQL or staging identity test ran.

**Next implementation slice:** I01-C may reconcile typed WorkItem workset/query, detail and key lookup only after the missing schema and authorized gateway inputs are supplied. No transition or SSE work was started here. Keep `VITE_CORE_MODE=demo` for ordinary review and do not call this production-ready.
