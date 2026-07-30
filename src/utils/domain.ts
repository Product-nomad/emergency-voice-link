/**
 * Canonical base URLs for the three production domains this app is
 * deployed to (one Vercel project each, per README). Used anywhere
 * a page needs to self-reference an absolute URL — canonical tags,
 * JSON-LD, hreflang — so each domain credits itself rather than a
 * sibling domain.
 */
export const US_DOMAIN = "https://911callsimulator.com";
export const UK_DOMAIN = "https://999callsimulator.com";
export const UK_ALT_DOMAIN = "https://999callbuddy.com";

/**
 * Resolve the current hostname to its own canonical base URL.
 * Falls back to US_DOMAIN (SSR / unknown host).
 */
export function getCurrentDomainBase(hostname: string): string {
  if (hostname.includes("999callbuddy")) return UK_ALT_DOMAIN;
  if (hostname.includes("999callsimulator")) return UK_DOMAIN;
  return US_DOMAIN;
}
