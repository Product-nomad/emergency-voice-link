# Changelog

All notable user-visible changes. Format: [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — 2026-07-30 (agent response-latency metric)

### Added
- **Per-utterance agent response latency now measured**, closing README's
  previously-unmeasured outcome metric #1. `useEmergencyCall.ts` times from
  the child's last detected speech (`onVadScore`) to the agent's first audio
  chunk (`onAudio`), reported to GA as `agent_response_latency`. Mostly
  reflects ElevenLabs agent-pipeline time, not app code — see DECISIONS.md.

## [Unreleased] — 2026-07-30 (drop Supabase from the call path)

### Changed
- **Token minting moved from a Supabase Edge Function to a Vercel Edge
  Function** (`api/elevenlabs-conversation-token.ts`). Same domain as the
  frontend now, so the request is same-origin — the CORS `ALLOWED_ORIGINS`
  allowlist is gone entirely, along with the bug class it caused. Requires a
  **new ElevenLabs API key** and `ELEVENLABS_API_KEY`/`ELEVENLABS_AGENT_ID`
  set as plain (non-`VITE_`) env vars on each Vercel project.
- **DB-backed rate limiting removed**, not replaced. ElevenLabs' own
  account-level spend cap is now the sole abuse backstop. Deliberate
  simplification for a free, low-traffic tool — see `DECISIONS.md`.
- Supabase is now scoped to `/feedback` message storage only.

## [Unreleased] — 2026-07-30 (ElevenLabs SDK migration)

### Changed
- **`@11labs/react` (`0.2.0`, deprecated) replaced with `@elevenlabs/react`
  (`1.12.0`).** Requires a new `<ConversationProvider>` ancestor (added in
  `App.tsx`). `useEmergencyCall.ts` rewritten: `startSession()` is now
  fire-and-forget instead of an awaited promise, connection success/failure
  routes entirely through `onConnect`/`onError`, and `onError`'s signature
  changed from `(error)` to `(message, context)`. **Needs a real device
  smoke-test against a live agent before merging** — not verifiable from an
  agentic coding environment; see DECISIONS.md 2026-07-30 entry.

## [Unreleased] — 2026-07-30 (latency)

### Changed
- **Edge function (`elevenlabs-conversation-token`) latency.** The rate-limit
  DB read and the ElevenLabs token fetch now run concurrently instead of
  serially, and the rate-limit write no longer blocks the response (handed to
  `EdgeRuntime.waitUntil`). Removes 1–2 sequential DB round-trips from every
  cold-path token mint (no cached client-side token).
- **Call-setup latency now reported to GA** (`call_latency` event: token-ready
  and WebRTC-connected timings, both measured from dial), not just logged to
  the browser console.

## [Unreleased] — 2026-07-30 (SEO/traffic audit)

### Fixed
- **`999callbuddy.com` self-canonicalisation bug.** `SeoCanonical.tsx` and
  `Index.tsx`'s JSON-LD only recognised two of the three production domains;
  `999callbuddy.com` fell through and self-canonicalised to
  `911callsimulator.com`, meaning none of that domain's own traffic ever
  accrued as ranking signal to itself. Domain resolution extracted to
  `src/utils/domain.ts` and extended to all three domains.
- **Fabricated `aggregateRating` removed** from `Index.tsx`'s JSON-LD
  (4.9★ / 150 ratings, no underlying data). Risked a Google structured-data
  manual action across all three domains.
- **`@vercel/analytics` now consent-gated**, closing THREAT_MODEL R5-prime.
  Previously fired unconditionally regardless of the cookie banner's state.

### Added
- **`scripts/generate-sitemap.mjs`** — post-build step writing an
  absolute-URL `sitemap.xml` and a matching `robots.txt` `Sitemap:` line,
  scoped to whichever domain the build's new `VITE_SITE_URL` env var names.
  No-op (safe fallback) if unset.
- **`public/robots.txt`** — didn't exist before; ships a permissive
  `Allow: /` with a relative `Sitemap:` fallback.

## [Unreleased] — 2026-04-27 (afternoon)

### Added
- **Cookie consent gating** for Google Analytics + Google AdSense. Scripts no
  longer load on page-load. They are deferred to `src/utils/consent.ts` and
  injected only when the user clicks Accept on the cookie banner — or when a
  prior session's consent state is found in localStorage on mount. Closes the
  UK PECR / GDPR exposure documented in DECISIONS 2026-04-27.
- **Decline option on the cookie banner.** Previously only Accept was
  offered, which is itself a consent-design problem (no real choice). Banner
  now exposes Decline and persists the choice; analytics never loads on a
  declined session.
- **Per-domain canonical + hreflang** via `src/components/SeoCanonical.tsx`,
  mounted at the top of the router. Each domain self-canonicalises:
  visitors on `999callsimulator.com` see canonical=999, visitors on
  `911callsimulator.com` see canonical=911. Hreflang `en-US` / `en-GB` /
  `x-default` annotates both. Closes the multi-domain SEO debt documented
  in DECISIONS 2026-04-27.
- **Initial test suite** using Node's built-in test runner via `tsx`:
  - `src/utils/duration.test.ts` — 6 cases covering pure duration formatting.
  - `src/utils/consent.test.ts` — 7 cases covering consent state read/write,
    legacy `"true"` value migration, garbage-input handling, round-trip.
  - `npm test` / `bun run test` runs them. 13/13 passing.
- `tsx` added to devDependencies.

### Changed
- **Inline GA + AdSense `<script>` tags removed from `index.html`.** Replaced
  with a comment pointing at `src/utils/consent.ts`.
- **`useEmergencyCall` `formatDuration`** now imports the shared pure helper
  from `src/utils/duration.ts` instead of being defined inline. Behaviour
  unchanged; testability gained.
- **`<link rel="canonical">` removed from `Privacy.tsx`** (was hardcoded to
  the .com domain). Replaced by the global SeoCanonical that handles both
  domains correctly.
- **CookieBanner copy** updated to make the strictly-necessary vs
  analytics/advertising distinction explicit, per the new banner doing
  real consent management instead of acknowledgement-only.



### Added
- `THREAT_MODEL.md` — trust boundaries, sub-processors, in-scope risks, known gaps.
- `SECURITY.md` — vulnerability disclosure process and scope.
- `DECISIONS.md` — material architectural decisions, dated.
- `.env.example` — public-by-design Supabase variables documented; private secrets explicitly noted as belonging in the Supabase Edge Function environment.
- README "Governance" section with current phase, outcome metrics, sub-processor disclosure, and sunset criteria.
- README link to the live demo.
- Open Graph + Twitter Card meta tags on `index.html` for clean social-share previews.

### Changed
- Sub-processor disclosure in the README's privacy paragraph: previous wording said *"no sensitive child data leaves the device"*, which contradicted the actual ElevenLabs voice-streaming architecture. Now accurately names ElevenLabs, Supabase, and Google Analytics as sub-processors.
- Edge function rate limit on `elevenlabs-conversation-token`: 3 requests / hour / IP → **10 requests / hour / IP**. The previous limit hit a child practising 4–5 scenarios in a single session — a usability regression masquerading as a security policy.
- `package.json`: name `vite_react_shadcn_ts` → `emergency-voice-link`; version `0.0.0` → `0.1.0`; added `description`, `homepage`, `repository`, and `license` fields.
- `index.html` author meta: `Lovable` → `Product-nomad`.

### Removed
- `<script src="https://cdn.gpteng.co/gptengineer.js">` from `index.html`. This was a Lovable scaffold artefact; loaded on every production page-view but provided no production-time value.
- `package-lock.json`. Two competing lockfiles (`bun.lockb` AND `package-lock.json`) had drifted in tree. Bun is the documented runtime; the npm lockfile was vestigial.
- `maximum-scale=1.0, user-scalable=no` from the `viewport` meta tag. Disabling pinch-to-zoom is a WCAG 1.4.4 accessibility violation — particularly bad on a tool aimed at children, parents, and teachers, some of whom rely on zoom.

### Fixed
- `.gitignore` now excludes `.env`. Previously, `.env` was committed to the repo. The committed values were `VITE_SUPABASE_*` (public-by-design Supabase anon keys, so not catastrophic), but the precedent meant a future `SERVICE_ROLE_KEY` would commit by default — fixed at the pattern level.

### Known issues (documented in THREAT_MODEL.md)
- **Vercel Analytics (R5-prime).** `@vercel/analytics` (`<Analytics />` in `src/App.tsx`) fires unconditionally on every page load with no consent gate. GA and AdSense are correctly gated; Vercel Analytics is not. Needs either removal or consent-gating + sub-processor disclosure. See THREAT_MODEL.md R5-prime.
- **Tests.** Initial seed suite (13 tests in `src/utils/`) exists and passes. Core test-plan targets — scenario routing, dispatcher prompt construction, rate-limit math, and the `useEmergencyCall` state machine — are undelivered (0% coverage). Test runner (`tsx`) must be available in the execution environment; not available on the VPC host as of 2026-05-20.
