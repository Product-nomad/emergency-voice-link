# emergency-voice-link — Threat Model

Phase: **Frame** (this document is one of the gate artefacts).

## Scope

The web UI, Supabase edge function, and conversational AI integration that together deliver a free 911/999 call simulator for children aged ~5–12, hosted at `911callsimulator.com` and `999callsimulator.com`.

In scope: client-side React app, Supabase Edge Function (`elevenlabs-conversation-token`), Supabase Postgres rate-limit table, the ElevenLabs voice/AI integration as a sub-processor, and the analytics + ad scripts loaded at the page level.

Out of scope: end-user device security, ElevenLabs' own infrastructure, the deployment platform's underlying infrastructure (Cloudflare Pages or Vercel), Supabase's underlying infrastructure.

## Trust boundaries and data flow

```
Child user (browser)
   │  [microphone audio + UI clicks]
   ▼
Static frontend (HTML/JS, Vite-built)
   │  [POST: request a session token]
   ▼
Supabase Edge Function (server-side, Deno)
   │  [server-to-server: ElevenLabs API key in env]
   ▼
ElevenLabs API ──► WebRTC token ──► back to client
   │
   ▼
Browser opens WebRTC channel to ElevenLabs ◄── voice in/out streams here
```

**Trusted:** the edge function (controls the API key), the Supabase service role (rate-limit table writes), Cloudflare/Vercel transport.

**Untrusted:** anything originating from the child's browser (audio, text, headers, IP).

**Sub-processor:** ElevenLabs receives the live voice stream. Their retention and use of conversation data is governed by their privacy policy, not ours. This is the most material trust dependency in the system.

## Assumptions

- The deploying party (Product-nomad) has read ElevenLabs' privacy and data-retention terms and accepts them on behalf of all users.
- The deploying party has read Supabase's terms similarly.
- Children using the tool are under adult supervision in the documented age range.
- Google Analytics and AdSense are subject to Google's policies for "Made for Kids" / under-13 traffic.

## In-scope risks

| ID | Risk | Mitigation in tree |
|---|---|---|
| R1 | Server-side ElevenLabs API key leakage | Held in Supabase Edge env, never sent to client. Edge function returns short-lived WebRTC tokens only. |
| R2 | Origin spoofing of edge function | CORS allowlist + 403 on unrecognised origin. |
| R3 | Token-mint abuse from a single source | IP-hashed rate limit, 10 requests / 60 min / IP, persisted in Supabase. |
| R4 | Voice / chat data retained or used to train models by the sub-processor | **Documented, not mitigated.** Disclosure must be in the user-facing privacy policy; users (and parents) need to know ElevenLabs is in the path. |
| R5 | Analytics + ads firing without user consent | **Open gap (high priority).** UK PECR / GDPR require prior consent for non-strictly-necessary cookies. Currently GA + AdSense scripts load on page-load regardless of cookie banner state. See DECISIONS 2026-04-27. |
| R6 | Children's PII captured incidentally in voice (names, addresses spoken aloud during scenarios) | Conversation never stored by us. Sub-processor retention per R4. |
| R7 | Cross-domain SEO confusion (`.com` vs `.co.uk`/999 routing) | **Open gap.** Canonical URL is fixed to `911callsimulator.com`; UK searches lose ranking equity. |
| R8 | Public-by-design Supabase anon key committed to repo history | Acceptable per Supabase's design (anon keys are public; security relies on Row-Level Security). `.gitignore` updated 2026-04-27 to prevent future server-side secret leakage. |

## Known gaps

- No automated tests covering scenario routing, dispatcher prompt construction, rate-limit math, or the call-state machine.
- Privacy page wording does not yet name ElevenLabs as a sub-processor (work pending — requires user sign-off because it's a legal document).
- Cookie consent banner exists in component tree but does not gate analytics/ad script loading.
- No formal Made-for-Families or COPPA configuration on the AdSense account verified in tree.

## Adversarial considerations

The tool is free, public, used by children. Realistic adversaries:

- **Drive-by abuse** — script that hammers the token endpoint to burn ElevenLabs credit. Rate-limiting (R3) is the primary defence; ElevenLabs account-level spend caps are the backstop.
- **Inappropriate content via prompt injection** — child says something the dispatcher LLM repeats verbatim. Mitigated by ElevenLabs' agent prompt (tuned for emergency-services role) — out-of-scope for this repo's mitigations but worth audit on the agent config side.
- **Tracking on a kids site** — see R5; the bigger reputational risk than a technical one.
