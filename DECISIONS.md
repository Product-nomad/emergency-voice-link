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

## 2026-04-27 — Defer test suite work to a Validate sprint

Project ships with no unit, integration, or end-to-end tests — a violation of the working-principles TDD rule documented in `~/WAYS_OF_WORKING.md` §1. *Decision:* this is a documented Validate-phase gap, not an oversight. The test suite plan covers: scenario routing, dispatcher prompt construction, rate-limit math, and the `useEmergencyCall` state machine. Delivery deferred to a focused sprint rather than scattered across feature work.
