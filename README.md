# 911 / 999 Call Simulator

**Free interactive emergency-call simulator that teaches kids how to call 911 (US) or 999 (UK) safely.**

A realistic, AI-powered dispatcher role-plays real emergency scenarios so children can practise what to say and stay calm — without tying up a real emergency line. Designed for parents, schools, and safeguarding programmes.

> 🚀 **Try it live:** [911callsimulator.com](https://911callsimulator.com) (🇺🇸) or [999callsimulator.com](https://999callsimulator.com) (🇬🇧)
>
> **Phase:** Operate (with carry-over Validate debt — no automated tests yet). See [Governance](#governance) below.

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
- **Sub-processors used by this site:** ElevenLabs (voice & dialogue), Supabase (rate-limit table for the token endpoint), Google Analytics (anonymous usage), Google AdSense (advertising), Cloudflare/Vercel (hosting).

For the full picture, see the in-tree [`THREAT_MODEL.md`](./THREAT_MODEL.md) and the on-site [Privacy Policy](https://911callsimulator.com/privacy).

## Stack

- [Vite](https://vitejs.dev) + React + TypeScript + [shadcn/ui](https://ui.shadcn.com) + Tailwind — frontend
- [ElevenLabs Conversational AI](https://elevenlabs.io/conversational-ai) — voice + LLM dispatcher (WebRTC)
- [Supabase](https://supabase.com) — Edge Function for token minting + rate-limit table
- [Bun](https://bun.sh) — local dev runtime
- Deployed via Cloudflare Pages (`wrangler.toml`); `vercel.json` adds security headers if hosted there instead

## Getting started

```sh
cp .env.example .env       # fill in Supabase publishable values
bun install
bun run dev
```

Open the URL the dev server prints.

> Server-side secrets (the ElevenLabs API key, the Supabase service role key, the ElevenLabs agent ID) live in the **Supabase Edge Function environment**, not in `.env`. `.env` is for the public-by-design `VITE_*` Supabase client values only.

## Governance

This project is a free, public tool aimed at children. It carries the same governance discipline as the rest of the portfolio.

### Phase: Operate (with carry-over Validate debt)

| Phase | Status | What |
|---|---|---|
| Frame | ✅ complete | Threat model, this README, audience and scope defined. |
| Data | ✅ complete | Voice + scenario context flow documented; sub-processors named. |
| Pipeline | ✅ complete | Edge-function token mint, IP-hashed rate limit, CORS allowlist. |
| Build | ✅ complete | Vite/React/shadcn frontend, ElevenLabs WebRTC integration, scenario routing, ring-then-connect UX. |
| Validate | 🟡 debt | **No automated tests yet.** Manual smoke-tested across scenarios on desktop + mobile. Test plan documented in `DECISIONS.md`. |
| Operate | ✅ live | Deployed on the public web at the two domains above. |

### Outcome metrics

1. **First-response latency.** Dispatcher's first audible response < 800ms from end-of-child-utterance. Currently ad-hoc — formal measurement pending. *(Validate-phase debt.)*
2. **Scenario completion rate.** Child reaches end-of-call feedback in ≥ 70% of started sessions. Tracked via Google Analytics.
3. **Cost per session.** ElevenLabs spend / completed session ≤ £0.05 (sets the rate-limit calibration in the Edge Function). Verified at month-end against ElevenLabs billing.

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
