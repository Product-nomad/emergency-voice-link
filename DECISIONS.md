# Architectural decisions

One paragraph per decision, dated. Records the *why* so the same call doesn't get re-litigated.

## 2026-04-27 — Adopt phase-gated governance with explicit outcome metrics

Adopted a phased delivery model — Frame → Data → Pipeline → Build → Validate → Operate — with explicit gates and named artefacts (this `DECISIONS.md` is one). Inspired by established industry frameworks for managing AI / data projects but stated in this project's own vocabulary rather than borrowing any framework's branding wholesale. *Alternatives considered:* ad-hoc / ship-when-it-works. *Why rejected:* this is a children's tool with sub-processors in the data path; "ship when it works" has no place to put the threat model and no gate for ethics or consent.

## 2026-04-27 — ElevenLabs as the conversational AI sub-processor

Picked ElevenLabs Conversational AI for the dispatcher voice and reasoning. *Why:* ultra-low first-response latency via WebRTC, agent configuration that handles scenario routing without us hosting our own LLM, and a single vendor handling STT + TTS + dialogue rather than three. *Trade-off:* voice data leaves the user's device and traverses ElevenLabs' infrastructure — this is the most material trust dependency in the project and is documented in `THREAT_MODEL.md` (R4). *Why we accept it:* self-hosting a voice-AI stack with comparable latency would require GPU infrastructure, multi-vendor STT/TTS plumbing, and a 10× larger maintenance surface — incompatible with a free educational tool.

## 2026-04-27 — Server-mint short-lived tokens; never expose the ElevenLabs API key client-side

The Supabase Edge Function `elevenlabs-conversation-token` mints a short-lived WebRTC token per session, holding the long-lived `ELEVENLABS_API_KEY` server-side only. *Why:* keeps the API key out of every browser session that opens the page; browser bundle inspection cannot extract it. *Alternatives considered:* shipping the key in a `VITE_*` env var. *Why rejected:* `VITE_*` env vars are baked into the client bundle and visible to every visitor.

## 2026-04-27 — Rate limit at 10 requests / 60 min / IP

Token-mint endpoint is rate-limited at 10 / hour / IP-hash, persisted in a Supabase table (`elevenlabs_rate_limit`). *Why this number:* a child practising 4–5 scenarios in one session was hitting the previous 3/hour wall mid-lesson — a usability regression masquerading as security. 10/hour gives normal use plenty of headroom while still catching scripted abuse from a single source. ElevenLabs account-level spend caps remain the backstop against runaway cost.

## 2026-04-27 — Defer cookie-consent gating of GA / AdSense scripts

Google Analytics and Google AdSense scripts currently load on page-load regardless of the on-page cookie banner. Under UK PECR and GDPR, non-strictly-necessary cookies require prior consent. *Decision:* this is a known gap, prioritised but not yet fixed because the right path (Google Consent Mode v2 vs deferred-load with a custom event vs a dedicated CMP) is a product choice that affects Adsense revenue calibration. *Until fixed:* documented in `THREAT_MODEL.md` (R5) and `index.html` carries an in-line `TODO(consent):` comment so the issue stays visible to anyone editing the page.

## 2026-04-27 — Multi-domain SEO debt

The site is served at both `911callsimulator.com` (US-flavour traffic) and `999callsimulator.com` (UK-flavour traffic). The HTML's hardcoded `<link rel="canonical">` currently points at the `.com` host, which dilutes UK ranking equity for "999 simulator" queries. *Decision:* deferred. Proper fix is server-side `hreflang` plus a per-domain canonical, which requires a deploy-time decision (Cloudflare Pages headers vs Vercel rewrites vs an SSR layer). Tracked in `THREAT_MODEL.md` (R7). *Until fixed:* analytics show traffic-source split so the cost of the debt is visible.

## 2026-04-27 — Bun as the dev runtime; drop the npm lockfile

Two competing lockfiles (`bun.lockb` and `package-lock.json`) had drifted in tree. Picked Bun per the README's documented quickstart; deleted `package-lock.json`. *Why:* one lockfile, one runtime — `bun install && bun run dev` is the supported developer path. *Alternative considered:* npm. *Why rejected:* documented quickstart already says Bun and switching now would require updating CI and README.

## 2026-05-20 — Seed build-time env vars on every new Vercel project before first deploy

All three production domains (`999callsimulator.com`, `911callsimulator.com`, `999callbuddy.com`) were silently serving blank pages because the Vercel projects backing them had **zero** env vars set. Vite produced bundles where `import.meta.env.VITE_SUPABASE_URL` was `undefined`, so `createClient(SUPABASE_URL, ...)` threw `supabaseUrl is required` at module load — before React mounted. The deploy succeeded, HTTP returned 200, the JS bundle served 200; only a browser console revealed the failure. *Fix:* added `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` to all three Vercel projects (production / preview / development targets), then redeployed the last production commit on each. *Lesson, now baked into `README.md`:* every new Vercel or Cloudflare Pages project that builds from this repo must have those three `VITE_*` vars seeded **before** the first build. *Forward-looking debt:* uptime checks here are HTTP-status-only, so this regression went undetected. A real-browser smoke check (Playwright assertion that `#root` has non-trivial content) would have caught it within minutes — tracked as Validate-phase work. *Residual gap (2026-05-20 audit):* `999callbuddy.com` was not added to the CORS allowlist in `supabase/functions/elevenlabs-conversation-token/index.ts` as part of this fix. The domain serves the correct JS bundle (HTTP 200) but the voice feature is broken — the token endpoint returns `{"error":"Unauthorized origin"}` for both `https://999callbuddy.com` and `https://www.999callbuddy.com` origins. Adding both origins to `ALLOWED_ORIGINS` and redeploying the edge function will restore the voice feature on that domain.

## 2026-07-30 — Close the 999callbuddy.com self-canonicalisation gap; treat it as self-canonicalising, not folded into 999callsimulator.com

The 2026-04-27 SEO fix (R7) only recognised two domains; `999callbuddy.com` fell through to the US branch of `SeoCanonical.tsx`, so every page on that domain emitted a canonical tag pointing at `911callsimulator.com` — actively telling search engines to credit a *different* domain for that domain's own traffic. Extracted the domain-resolution logic into `src/utils/domain.ts` (`getCurrentDomainBase`) and extended it to a three-way map; `999callbuddy.com` now self-canonicalises. *Alternative considered:* canonicalise `999callbuddy.com` → `999callsimulator.com` (treat buddy as a pure alias, consolidating all UK link equity onto one domain). *Why not chosen:* the README already lists it as a distinct live production domain ("🇬🇧 alt"), and folding it into another domain's canonical is exactly the zero-credit bug just being fixed, just aimed at a sibling instead of a stranger. *Open question, not resolved here:* running near-identical content on two UK-facing domains (`999callsimulator.com` and `999callbuddy.com`) is itself a duplicate-content pattern that will likely have the two domains compete for the same queries rather than both ranking. Worth a deliberate call on whether `999callbuddy.com` should differentiate its content, redirect, or stay a parallel property — flagged, not decided.

## 2026-07-30 — Remove fabricated `aggregateRating` from JSON-LD

`Index.tsx`'s `WebApplication` structured-data node carried a hardcoded `aggregateRating` of 4.9★ / 150 ratings with no underlying review data anywhere in the project. This is a direct violation of `~/WAYS_OF_WORKING.md` §2 ("never use synthetic data to stand in for reality in a claim") and a live risk: Google's structured-data policy treats fabricated review markup as a manual-action trigger, which can strip rich-result eligibility (and depress ranking) across all three domains at once, since they share this component. Removed outright rather than replaced with a plausible-looking placeholder — add back only when real review data exists to source it from.

## 2026-07-30 — Generate sitemap.xml/robots.txt at build time from a new required `VITE_SITE_URL`, not committed statically

No `sitemap.xml` existed anywhere in the repo, and `public/robots.txt` didn't exist either. Because this is a client-only Vite SPA deployed as three separate per-domain Vercel projects (no SSR, no per-request logic), a single static `sitemap.xml` checked into `public/` can only ever be correct for one domain. *Fix:* `scripts/generate-sitemap.mjs` runs as a `postbuild`-style step (`vite build && node scripts/generate-sitemap.mjs`) and writes `dist/sitemap.xml` + rewrites `dist/robots.txt`'s `Sitemap:` line using `VITE_SITE_URL`, which must now be set per-Vercel-project alongside the existing three `VITE_SUPABASE_*` vars (added to `README.md`'s required-env-vars table and `.env.example`). *Why not a static file:* would silently point 2-of-3 domains' sitemaps at the wrong host, repeating this exact class of bug. *Degradation if unset:* the build still succeeds; `robots.txt` keeps a relative `Sitemap: /sitemap.xml` line (which crawlers resolve against the fetching domain) and no `sitemap.xml` is written, rather than emitting one with a wrong or placeholder domain.

## 2026-07-30 — Consent-gate `@vercel/analytics`, closing R5-prime

`<Analytics />` in `src/App.tsx` fired unconditionally on every page load regardless of the cookie banner's state — an undisclosed sub-processor firing without consent under UK PECR/GDPR (tracked as R5-prime since 2026-04-27). Gated it the same way GA/AdSense already were: a `cookie-consent-changed` event (`src/utils/consent.ts`) now fires from `CookieBanner`'s accept/decline handlers, and `App.tsx` only renders `<Analytics />` once `getConsentState` reads "accepted". *Why an event instead of polling:* the existing GA/AdSense gate is a one-shot script injection (fire-and-forget), but `<Analytics />` is a mounted React component that needs to react to a consent change happening after initial render (banner accepted mid-session) — an event is the smallest addition that covers both the initial-load and mid-session-accept paths.

## 2026-04-27 — Defer test suite work to a Validate sprint

Project ships with no unit, integration, or end-to-end tests — a violation of the working-principles TDD rule documented in `~/WAYS_OF_WORKING.md` §1. *Decision:* this is a documented Validate-phase gap, not an oversight. The test suite plan covers: scenario routing, dispatcher prompt construction, rate-limit math, and the `useEmergencyCall` state machine. Delivery deferred to a focused sprint rather than scattered across feature work.
