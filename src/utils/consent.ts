/**
 * Cookie-consent gating for analytics + advertising scripts.
 *
 * Under UK PECR / GDPR, non-strictly-necessary cookies require prior
 * informed consent. This module:
 *   1. Reads/writes the user's consent decision to localStorage.
 *   2. Loads the Google Analytics + Google AdSense scripts only after
 *      consent is given (deferred-load pattern).
 *
 * The functions that don't touch the DOM accept a Storage interface so
 * they can be unit-tested without a browser.
 */

export type ConsentState = "accepted" | "declined" | "unknown";

export const CONSENT_KEY = "cookies-accepted";

// Fired on window whenever the user's consent decision changes, so
// components (e.g. the consent-gated <Analytics /> in App.tsx) can
// react without polling localStorage.
export const CONSENT_CHANGE_EVENT = "cookie-consent-changed";

const GA_MEASUREMENT_ID = "G-51DDNPLJSB";
const ADSENSE_CLIENT_ID = "ca-pub-1138854450517299";

interface MinimalStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/**
 * Read the current consent state. Recognises:
 *   - "true" or "accepted" → accepted (legacy + new spelling)
 *   - "declined" → declined
 *   - anything else (or absent) → unknown
 */
export function getConsentState(storage: MinimalStorage): ConsentState {
  const v = storage.getItem(CONSENT_KEY);
  if (v === "true" || v === "accepted") return "accepted";
  if (v === "declined") return "declined";
  return "unknown";
}

export function setConsent(
  storage: MinimalStorage,
  value: Exclude<ConsentState, "unknown">,
): void {
  storage.setItem(CONSENT_KEY, value);
}

/**
 * Inject a `<script>` tag with the given attributes. Idempotent —
 * if a script with the same `src` already exists, this is a no-op.
 */
function injectScript(src: string, attrs: Record<string, string> = {}): void {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v);
  document.head.appendChild(s);
}

let analyticsLoaded = false;

/**
 * Load Google Analytics + Google AdSense. Only call this when consent
 * has been granted. Idempotent — repeated calls are a no-op.
 */
export function loadAnalytics(): void {
  if (analyticsLoaded) return;
  analyticsLoaded = true;

  // Google Analytics (gtag)
  injectScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  // gtag bootstrap — must run after the script tag is in the DOM but
  // can be inline; uses dataLayer which gtag.js will pick up on load.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params, @typescript-eslint/no-explicit-any
  w.gtag = function gtag(..._args: any[]) {
    w.dataLayer.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", GA_MEASUREMENT_ID);

  // Google AdSense
  injectScript(
    `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`,
    { crossorigin: "anonymous" },
  );
}

/**
 * Bootstrap helper for app start: if the user has already accepted
 * cookies in a prior session, load analytics now.
 */
export function loadAnalyticsIfConsented(): void {
  if (typeof window === "undefined") return;
  if (getConsentState(window.localStorage) === "accepted") {
    loadAnalytics();
  }
}
