// Function to track conversions for Google Ads
export const trackConversion = (phoneNumber: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      'send_to': 'ca-pub-1138854450517299',
      'value': 1.0,
      'currency': 'USD',
      'transaction_id': Date.now().toString()
    });
    console.log('Google Ads conversion tracked for:', phoneNumber);
  }
};

/**
 * Reports the two call-setup timings useEmergencyCall already computes
 * (token-ready and WebRTC-connected, both measured from dial) as a GA event.
 * Turns README's "first-response latency < 800ms" outcome metric from an
 * ad-hoc console.log into a real, aggregable production number. No-ops
 * silently if analytics hasn't been consented to (gtag won't be defined yet).
 */
export const trackCallLatency = (tokenMs: number, connectedMs: number) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'call_latency', {
      token_ready_ms: Math.round(tokenMs),
      connected_ms: Math.round(connectedMs),
    });
  }
};