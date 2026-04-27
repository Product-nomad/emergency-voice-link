import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

/**
 * Per-domain canonical + hreflang for the dual-domain deployment
 * (911callsimulator.com → US, 999callsimulator.com → UK).
 *
 * Mounted once at the top of the app. Each domain self-canonicalises:
 * a UK visitor on 999callsimulator.com sees `<link rel="canonical"
 * href="https://999callsimulator.com/...">`, so search engines preserve
 * UK ranking equity instead of redirecting all signal to the .com.
 *
 * `hreflang` tells search engines which domain to surface for which
 * audience — `en-US` → 911, `en-GB` → 999, `x-default` → 911 as fallback.
 *
 * Individual page components must NOT set their own `<link rel="canonical">`
 * inside `<Helmet>` or this top-level value will be overridden / duplicated.
 */
const US_DOMAIN = "https://911callsimulator.com";
const UK_DOMAIN = "https://999callsimulator.com";

const SeoCanonical = () => {
  const { pathname } = useLocation();

  // Determine current host. SSR-safe fallback to US domain.
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const isUK = host.includes("999callsimulator");

  const baseForCurrent = isUK ? UK_DOMAIN : US_DOMAIN;
  const canonical = `${baseForCurrent}${pathname}`;
  const usHref = `${US_DOMAIN}${pathname}`;
  const ukHref = `${UK_DOMAIN}${pathname}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en-US" href={usHref} />
      <link rel="alternate" hrefLang="en-GB" href={ukHref} />
      <link rel="alternate" hrefLang="x-default" href={usHref} />
    </Helmet>
  );
};

export default SeoCanonical;
