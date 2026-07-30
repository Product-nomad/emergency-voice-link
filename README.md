# 911 / 999 Call Simulator

**Free interactive emergency-call simulator that teaches kids how to call 911 (US) or 999 (UK) safely.**

A realistic, AI-powered dispatcher role-plays real emergency scenarios so children can practise what to say and stay calm — without tying up a real emergency line. Designed for parents, schools, and safeguarding programmes.

> 🚀 **Try it live:** [911callsimulator.com](https://911callsimulator.com) (🇺🇸), [999callsimulator.com](https://999callsimulator.com) (🇬🇧), or [999callbuddy.com](https://999callbuddy.com) (🇬🇧 alt)
>
> **Phase:** Operate (with carry-over Validate debt — seed test suite exists but core test targets undelivered). See [Governance](#governance) below.

## Why this exists

Kids are told "call 999 / 911 in an emergency" but almost never get to practise. When a real emergency happens, they freeze. This simulator lets them build muscle memory in a safe, pressure-free environment.

## What a session looks like

1. Child picks a scenario (house fire, injury, stranger, lost, etc.) or gets a random one.
2. The AI dispatcher answers and asks the right questions — calmly, age-appropriately, and in the right order.
3. The child speaks or types their answers.
4. End-of-call feedback: what they did well, what to practise.

## Who it's for

- Parents practising emergency calls with children aged roughly 5–12.
- Primary / elementary school teachers running safety lessons.
- Safeguarding trainers in scouting, youth groups, after-school programmes.

## Regional coverage

- **🇺🇸 United States** — 911, full dispatcher script.
- **🇬🇧 United Kingdom** — 999 (emergency) and 101 (non-emergency) variants.

## Safety and privacy

- It's a simulator. It **does not** connect to real emergency services. The dispatcher is an AI; the call is a role-play.
- No account required. We don't store conversations on our servers.
- **Voice is processed by a third-party AI sub-processor:** when the child speaks, audio streams over WebRTC to **ElevenLabs** (an AI voice/conversation provider) for speech-to-text, dialogue, and text-to-speech. Their retention and use of conversation data is governed by [ElevenLabs' privacy policy](https://elevenlabs.io/privacy-policy). It is *not* true that "no data leaves the device" — voice data does, by design, in order to deliver the AI dispatcher.
- **Sub-processors used by this site:** ElevenLabs (voice & dialogue), Supabase (feedback message storage only, as of 2026-07-30 — the token-minting function and its rate-limit table were migrated off Supabase entirely, see `DECISIONS.md`), Google Analytics (consent-gated usage analytics), Google AdSense (consent-gated advertising), Vercel Analytics (unconditional page-view analytics — consent gating pending), Cloudflare/Vercel (hosting).

For the full picture, see the in-tree [`THREAT_MODEL.md`](./THREAT_MODEL.md) and the on-site [Privacy Policy](https://911callsimulator.com/privacy).

## Stack

- [Vite](https://vitejs.dev) + React + TypeScript + [shadcn/ui](https://ui.shadcn.com) + Tailwind — frontend
- [ElevenLabs Conversational AI](https://elevenlabs.io/conversational-ai) — voice + LLM dispatcher (WebRTC), via the maintained `@elevenlabs/react` client (migrated 2026-07-30 from the deprecated `@11labs/react@0.2.0`)
- **Vercel Edge Function** (`api/elevenlabs-conversation-token.ts`) — mints the short-lived ElevenLabs WebRTC token, holding `ELEVENLABS_API_KEY` server-side. Migrated 2026-07-30 from a Supabase Edge Function of the same name — see `DECISIONS.md`. Served from the same domain as the frontend, so the browser's request is same-origin; no CORS allowlist needed (the previous version's allowlist was the cause of two separate `999callbuddy.com` bugs).
- [Supabase](https://supabase.com) — Postgres storage for the `/feedback` page only. No longer in the call path.
- [Bun](https://bun.sh) — local dev runtime
- Deployed via **Vercel** (one project per production domain; `vercel.json` adds security headers). `wrangler.toml` is kept in tree so Cloudflare Pages remains a viable alternative host — note that the `api/` Edge Function is Vercel-specific and would need a Cloudflare Pages Functions equivalent if that alternative is ever actually used.

## Getting started

```sh
cp .env.example .env       # fill in Supabase publishable values
bun install
bun run dev
```

Open the URL the dev server prints.

> Server-side secrets (`ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`) live in each **Vercel project's environment variables**, not in `.env`. `.env` is for the public-by-design `VITE_*` Supabase client values only (Supabase is still used for `/feedback` storage).
>
> **Local dev limitation:** `bun run dev` runs the plain Vite dev server, which does not execute `api/` Edge Functions — dialing 911/999 locally will 404 against `/api/elevenlabs-conversation-token`. To test a real call locally, run `vercel dev` instead (reads `ELEVENLABS_API_KEY`/`ELEVENLABS_AGENT_ID` from `vercel env pull` or a local `.env`), or just test against a Vercel preview deploy.

## Deploying

The live site runs on **Vercel** with one project per production domain. The repo also keeps `wrangler.toml` so Cloudflare Pages remains a viable alternative host.

### Required env vars on the host

Before the first build of any new deployment (any Vercel or Cloudflare Pages project), set these on the host:

| Key | Source |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project → Settings → API → Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase project → Settings → API → anon / public key |
| `VITE_SUPABASE_PROJECT_ID` | The subdomain prefix of the Supabase Project URL |
| `VITE_SITE_URL` | This deployment's own production domain, e.g. `https://999callbuddy.com`. Used by `scripts/generate-sitemap.mjs` to emit a `sitemap.xml` scoped to the right domain — each of the three production domains is a separate Vercel project and needs its own value. |

These are public-by-design — the same values that ship to every browser via `import.meta.env.VITE_*`.

Also required, per Vercel project, as plain (non-`VITE_`-prefixed) **server-side** environment variables — these never reach the client bundle and must never be added with the `VITE_` prefix:

| Key | Source |
|---|---|
| `ELEVENLABS_API_KEY` | ElevenLabs dashboard → API keys |
| `ELEVENLABS_AGENT_ID` | ElevenLabs dashboard → your Conversational AI agent |

> **Failure mode if you forget:** the build still succeeds and the site serves HTTP 200, but every page is blank — Supabase's `createClient` throws `supabaseUrl is required` at module load, before React mounts. Uptime checks won't catch it. See the 2026-05-20 entry in `DECISIONS.md`.

## Governance

This project is a free, public tool aimed at children. It carries the same governance discipline as the rest of the portfolio.

### Phase: Operate (with carry-over Validate debt)

| Phase | Status | What |
|---|---|---|
| Frame | ✅ complete | Threat model, this README, audience and scope defined. |
| Data | 🔴 loopback | Vercel Analytics now consent-gated (2026-07-30, closes R5-prime). COPPA/AdSense assurance in Privacy.tsx still contradicts THREAT_MODEL.md. |
| Pipeline | 🔴 loopback | No CI/CD pipeline (no GitHub Actions). No pre-commit hooks. Bun lockfile may not be used in production Vercel builds. |
| Build | 🔴 loopback | TypeScript strict mode disabled (`strict: false`). Dead dependencies (`@tanstack/react-query`, 43 unused shadcn/ui components). |
| Validate | 🔴 loopback | Seed test suite (13 tests, utilities only). Named test-plan targets (state machine, scenario routing, prompt construction) undelivered — rate-limit math is no longer a target now that DB-backed rate limiting is gone (2026-07-30). Test runner (`tsx`) not available in current host environment. |
| Operate | ✅ live (degraded) | Deployed across three domains. `999callbuddy.com`'s CORS-allowlist bug is now moot: the token-mint function moved to a same-origin Vercel Edge Function (2026-07-30), which has no allowlist to be absent from. `999callbuddy.com` was also self-canonicalising to `911callsimulator.com` in all SEO surfaces — fixed 2026-07-30, but needs `VITE_SITE_URL` seeded on each Vercel project (see table above) before `sitemap.xml` generation takes effect. No real-browser uptime monitoring. |

### Outcome metrics

1. **First-response latency.** Dispatcher's first audible response < 800ms from end-of-child-utterance. Still ad-hoc — formal measurement pending. *(Validate-phase debt.)* **Related but distinct metric now measured (2026-07-30):** call-*setup* latency (dial → token ready, dial → WebRTC connected) is reported to GA as a `call_latency` event (`src/utils/googleAds.ts`) instead of only `console.log`. This covers time-to-connect, not the per-utterance dispatcher response time the metric above describes — that still needs instrumentation on the ElevenLabs agent side.
2. **Scenario completion rate.** Child reaches end-of-call feedback in ≥ 70% of started sessions. Tracked via Google Analytics.
3. **Cost per session.** ElevenLabs spend / completed session ≤ £0.05. Verified at month-end against ElevenLabs billing. As of 2026-07-30, ElevenLabs' own account-level spend cap is the *sole* abuse backstop (see `DECISIONS.md`) — no app-level rate limiting exists any more, so this metric is also the early-warning signal if that backstop isn't tight enough.

### Ethical posture

- **Privacy-first by default.** No accounts. No conversation storage by us.
- **Honest sub-processor disclosure.** This README and the on-site Privacy Policy name ElevenLabs, Supabase, and Google explicitly. No "no data leaves the device" claims.
- **Children-first design.** Scenarios calibrated to the 5–12 age band; dispatcher tone tuned for calm and reassurance, not interrogation.
- **Free and ad-supported, not data-monetised.** AdSense funds running costs; no first-party advertising or user-profile sharing.

### Decision log

Material decisions are recorded in [`DECISIONS.md`](./DECISIONS.md). Change history sits in [`CHANGELOG.md`](./CHANGELOG.md). Vulnerability reporting in [`SECURITY.md`](./SECURITY.md).

### Sunset criteria

Archive this project if any of these become true:

- ElevenLabs (or a comparable provider) ships a first-party "emergency-services training" agent template that does this job out-of-the-box.
- The threat model assumption — adult-supervised use, ages 5–12, free at the point of use — stops holding.
- A national education body picks up children-emergency-training as a publicly-funded programme; donate this codebase to that programme rather than maintain in parallel.
- ElevenLabs cost-per-session exceeds the £0.05/session metric for two consecutive months *and* AdSense revenue can't cover the gap.

## Licence

MIT.
