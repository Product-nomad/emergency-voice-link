# Security policy

## Reporting a vulnerability

If you find a security issue in `emergency-voice-link` — particularly anything that could expose children's data, leak the ElevenLabs API key, allow abuse of the token-mint endpoint, or undermine the educational integrity of the simulator — please report it privately rather than opening a public issue.

**Email:** open a private security advisory via GitHub: <https://github.com/Product-nomad/emergency-voice-link/security/advisories/new>

You should expect an initial acknowledgement within **3 business days**. We aim to ship a fix or a documented mitigation within **14 days** of confirming the issue, depending on severity and scope.

## Scope

In scope:
- The Supabase Edge Function in `supabase/functions/`.
- The client React app in `src/`.
- The static deployment artefacts (`index.html`, build output).
- Any leak of secrets through git history, releases, or built bundles.

Out of scope (report to the upstream vendor):
- Vulnerabilities in ElevenLabs, Supabase, Cloudflare, Vercel, or Google's infrastructure.
- Issues in upstream npm packages — please file with the package maintainer first; we'll bump the version once a fix lands.

## What we'll do

- Acknowledge receipt and assign an internal ID.
- Confirm or dispute the issue, with reasoning.
- Fix in a private branch, regression-test, deploy.
- Co-ordinate disclosure with the reporter — credit by name in `CHANGELOG.md` if welcome.

## What we won't do

- Run a bug-bounty programme. We'll thank reporters in `CHANGELOG.md` and on the project README; no monetary reward.
- Ship a fix without testing it against the documented scenarios first. See the threat model.
