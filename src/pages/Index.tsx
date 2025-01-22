import React, { useState, useEffect } from 'react';
import EmergencyDialer from '@/components/EmergencyDialer';
import EmergencyCall from '@/components/EmergencyCall';
import { trackConversion } from '@/utils/googleAds';

const Index = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);

  useEffect(() => {
    // Load Google Ads script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-CONVERSION_ID';
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', 'AW-CONVERSION_ID');
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleStartCall = (number: string) => {
    setActiveCall(number);
    // Track conversion when call starts
    trackConversion(number);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {activeCall ? (
        <EmergencyCall number={activeCall} onEnd={handleEndCall} />
      ) : (
        <EmergencyDialer onCall={handleStartCall} />
      )}
    </div>
  );
};

export default Index;