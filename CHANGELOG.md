# Changelog

All notable user-visible changes. Format: [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased] — 2026-04-27

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
