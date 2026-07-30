# emergency-voice-link — Threat Model

Phase: **Frame** (this document is one of the gate artefacts).

## Scope

The web UI, the token-minting Edge Function, and conversational AI integration that together deliver a free 911/999 call simulator for children aged ~5–12, hosted at `911callsimulator.com`, `999callsimulator.com`, and `999callbuddy.com`.

In scope: client-side React app, the Vercel Edge Function (`api/elevenlabs-conversation-token.ts`, migrated 2026-07-30 from a Supabase Edge Function of the same name — see `DECISIONS.md`), the ElevenLabs voice/AI integration as a sub-processor, the analytics + ad scripts loaded at the page level, and Supabase (now scoped to `/feedback` message storage only).

Out of scope: end-user device security, ElevenLabs' own infrastructure, the deployment platform's underlying infrastructure (Vercel, or Cloudflare Pages as the documented alternative host), Supabase's underlying infrastructure.

## Trust boundaries and data flow

```
Child user (browser)
   │  [microphone audio + UI clicks]
   ▼
Static frontend (HTML/JS, Vite-built)
   │  [GET, same-origin: request a session token]
   ▼
Vercel Edge Function — api/elevenlabs-conversation-token.ts
   │  [server-to-server: ElevenLabs API key in env]
   ▼
ElevenLabs API ──► WebRTC token ──► back to client
   │
   ▼
Browser opens WebRTC channel to ElevenLabs ◄── voice in/out streams here
```

**Trusted:** the Edge Function (controls the API key), Vercel's platform transport.

**Untrusted:** anything originating from the child's browser (audio, text, headers, IP) — including the fact that the request being same-origin from a real page proves nothing about who's actually calling the endpoint; see R2 below.

**Sub-processor:** ElevenLabs receives the live voice stream. Their retention and use of conversation data is governed by their privacy policy, not ours. This is the most material trust dependency in the system.

## Assumptions

- The deploying party (Product-nomad) has read ElevenLabs' privacy and data-retention terms and accepts them on behalf of all users.
- The deploying party has read Supabase's terms similarly (now scoped to `/feedback` storage) and Vercel's, given the Edge Function moved there 2026-07-30.
- Children using the tool are under adult supervision in the documented age range.
- Google Analytics and AdSense are subject to Google's policies for "Made for Kids" / under-13 traffic.

## In-scope risks

| ID | Risk | Mitigation in tree |
|---|---|---|
| R1 | Server-side ElevenLabs API key leakage | Held in the Vercel Edge Function's server-side environment (`ELEVENLABS_API_KEY`, non-`VITE_`-prefixed — never reaches the client bundle), never sent to client. The function returns short-lived WebRTC tokens only. |
| R2 | Unauthorised / scripted token-mint requests | **Accepted, not mitigated (2026-07-30).** The old Supabase version's CORS allowlist only ever stopped *browser* JS running on an unrecognised origin from reading the response — it never stopped a script calling the endpoint directly (`curl`, a bot, server-to-server), since CORS is a browser-enforced restriction, not server-side auth. Moving to a same-origin Vercel Function removes the allowlist entirely — and with it the exact bug class that twice broke the voice feature on `999callbuddy.com` (missing from the list, then fixed in code but never redeployed to the running function) — but doesn't add any new protection against direct calls either; the endpoint was never truly protected by it in the first place. ElevenLabs' account-level spend cap (R3) is the actual backstop, unchanged by this move. |
| R3 | Token-mint abuse from a single source | **Changed 2026-07-30:** the IP-hashed Supabase rate limit (10 req/60 min/IP) is gone — dropped along with the Supabase-backed token function, deliberately (see `DECISIONS.md`), rather than replaced with an external store (e.g. Upstash Redis) for a free, low-traffic educational tool. ElevenLabs' own account-level spend cap is now the *sole* backstop against runaway cost from either R2 or genuine abuse. If usage grows enough that this stops being sufficient, reintroducing a rate limit (e.g. Vercel KV or Upstash) is the documented next step, not a full re-architecture. |
| R4 | Voice / chat data retained or used to train models by the sub-processor | **Documented, not mitigated.** Disclosure must be in the user-facing privacy policy; users (and parents) need to know ElevenLabs is in the path. |
| R5 | Analytics + ads firing without user consent | **Mitigated for GA + AdSense (2026-04-27, commit e081a31).** Both scripts are now deferred via `src/utils/consent.ts` and load only after explicit user consent. **R5-prime mitigated (2026-07-30).** `@vercel/analytics` (`<Analytics />` in `src/App.tsx`) is now consent-gated: it only mounts after `getConsentState` reads "accepted", re-checked live via the `cookie-consent-changed` event dispatched from `CookieBanner`. |
| R6 | Children's PII captured incidentally in voice (names, addresses spoken aloud during scenarios) | Conversation never stored by us. Sub-processor retention per R4. |
| R7 | Cross-domain SEO confusion (three production domains self-cannibalising ranking signal) | **Mitigated (2026-04-27, commit e081a31; extended 2026-07-30).** `src/components/SeoCanonical.tsx` injects per-domain `<link rel="canonical">` at the router level via `src/utils/domain.ts`'s three-way map. **Residual gap closed 2026-07-30:** the original fix only recognised `911callsimulator.com`/`999callsimulator.com` — `999callbuddy.com` fell through to the US branch, so every 999callbuddy.com page was self-canonicalising to `911callsimulator.com`, telling search engines to credit a different domain entirely for that domain's own traffic. Same bug was also present in `Index.tsx`'s JSON-LD (`url`/`screenshot`/`logo` hardcoded to `911callsimulator.com` regardless of serving domain) — both now resolve dynamically via `getCurrentDomainBase()`. `999callbuddy.com` is treated as canonicalising to itself, not folded into the `999callsimulator.com` hreflang target — see the 2026-07-30 `DECISIONS.md` entry for why. |
| R9 | Fabricated review data in structured markup | **Mitigated (2026-07-30).** `Index.tsx`'s JSON-LD `WebApplication` node carried a hardcoded `aggregateRating` (4.9★ / 150 ratings) with no underlying review data — a data-honesty violation (`~/WAYS_OF_WORKING.md` §2) and a live risk of a Google manual action for fake review markup, which can strip rich-result eligibility across all three domains at once. Removed; add back only with real, sourced review counts. |
| R8 | Public-by-design Supabase anon key committed to repo history | Acceptable per Supabase's design (anon keys are public; security relies on Row-Level Security). `.gitignore` updated 2026-04-27 to prevent future server-side secret leakage. |

## Known gaps

- No automated tests covering scenario routing, dispatcher prompt construction, or the call-state machine. (Rate-limit math is no longer a target — see R3.)
- Privacy page wording does not yet name ElevenLabs as a sub-processor (work pending — requires user sign-off because it's a legal document).
- No formal Made-for-Families or COPPA configuration on the AdSense account verified in tree.
- No `sitemap.xml`/`robots.txt` served until `VITE_SITE_URL` is set per-Vercel-project (see 2026-07-30 `DECISIONS.md` entry) — a build without it degrades safely (relative `Sitemap:` line, no `sitemap.xml`) rather than shipping a wrong-domain one, but discovery is degraded until the env var is seeded.

## Adversarial considerations

The tool is free, public, used by children. Realistic adversaries:

- **Drive-by abuse** — script that hammers the token endpoint to burn ElevenLabs credit. As of 2026-07-30, ElevenLabs' account-level spend cap is the *only* defence (see R2, R3) — there is no app-level rate limiting any more. Watch the cost-per-session outcome metric in `README.md` for early warning if this stops being sufficient.
- **Inappropriate content via prompt injection** — child says something the dispatcher LLM repeats verbatim. Mitigated by ElevenLabs' agent prompt (tuned for emergency-services role) — out-of-scope for this repo's mitigations but worth audit on the agent config side.
- **Tracking on a kids site** — see R5; the bigger reputational risk than a technical one.
