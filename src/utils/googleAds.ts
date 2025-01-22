// Function to track conversions for Google Ads
export const trackConversion = (phoneNumber: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', 'conversion', {
      'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
      'value': 1.0,
      'currency': 'USD',
      'transaction_id': Date.now().toString()
    });
    console.log('Google Ads conversion tracked for:', phoneNumber);
  }
};