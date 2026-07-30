import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CONSENT_CHANGE_EVENT,
  CONSENT_KEY,
  getConsentState,
  loadAnalytics,
  setConsent,
} from "@/utils/consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const state = getConsentState(window.localStorage);
    if (state === "unknown") setVisible(true);

    const handleReset = () => setVisible(true);
    window.addEventListener("reset-cookie-consent", handleReset);
    return () => window.removeEventListener("reset-cookie-consent", handleReset);
  }, []);

  const handleAccept = () => {
    setConsent(window.localStorage, "accepted");
    loadAnalytics();
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    setVisible(false);
  };

  const handleDecline = () => {
    setConsent(window.localStorage, "declined");
    window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 right-4 z-50 max-w-sm bg-card border border-border rounded-lg shadow-xl p-4"
    >
      <p className="text-sm text-muted-foreground mb-3">
        We use analytics and advertising cookies. They only load if you accept.
        Strictly-necessary cookies (which remember this choice) are always on.{" "}
        <Link to="/privacy" className="text-primary hover:underline">
          Learn more
        </Link>
      </p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={handleDecline} className="flex-1">
          Decline
        </Button>
        <Button size="sm" onClick={handleAccept} className="flex-1">
          Accept
        </Button>
      </div>
    </div>
  );
};

// Re-export for tests / external bootstraps that just want the storage key.
export { CONSENT_KEY };

export default CookieBanner;
