# Changelog

All notable user-visible changes. Format: [Keep a Changelog](https://keepachangelog.com/).

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
- **Cookie consent.** Google Analytics + AdSense scripts currently load on page-load before any consent. UK PECR / GDPR compliance work is queued but not yet shipped — see `DECISIONS.md` 2026-04-27.
- **Multi-domain SEO.** Canonical URL is fixed to `911callsimulator.com`; `999callsimulator.com` UK traffic loses ranking equity. Proper fix is server-side `hreflang` per domain.
- **Tests.** No automated tests yet. Scenario routing, prompt construction, rate-limit math, and call state machine are the priority targets.
