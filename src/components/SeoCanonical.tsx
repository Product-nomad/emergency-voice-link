import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { US_DOMAIN, UK_DOMAIN, getCurrentDomainBase } from "@/utils/domain";

/**
 * Per-domain canonical + hreflang for the three-domain deployment
 * (911callsimulator.com → US, 999callsimulator.com → UK,
 * 999callbuddy.com → UK alt).
 *
 * Mounted once at the top of the app. Each domain self-canonicalises:
 * a visitor on any of the three domains sees a `<link rel="canonical">`
 * pointing at that same domain, so search engines credit ranking
 * signal to the domain that was actually visited instead of funnelling
 * it all to 911callsimulator.com.
 *
 * `hreflang` alternates only ever point at the two "primary" domains
 * (en-US → 911, en-GB → 999callsimulator) — 999callbuddy.com is an
 * alternate UK domain, not a distinct locale, so it isn't listed as
 * an hreflang target (a language/region should have one canonical
 * hreflang destination, not two competing ones).
 *
 * Individual page components must NOT set their own `<link rel="canonical">`
 * inside `<Helmet>` or this top-level value will be overridden / duplicated.
 */
const SeoCanonical = () => {
  const { pathname } = useLocation();

  // Determine current host. SSR-safe fallback to US domain.
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const baseForCurrent = getCurrentDomainBase(host);

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
