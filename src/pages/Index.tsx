import React, { useState, useEffect } from 'react';
import EmergencyDialer from '@/components/EmergencyDialer';
import EmergencyCall from '@/components/EmergencyCall';
import { trackConversion } from '@/utils/googleAds';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const Index = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Google AdSense
    window.adsbygoogle = window.adsbygoogle || [];

    // Load Google Ads script
    const script = document.createElement('script');
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1138854450517299';
    document.head.appendChild(script);

    // Initialize ads after script loads
    script.onload = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('Error initializing ads:', err);
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleStartCall = (number: string) => {
    setActiveCall(number);
    trackConversion(number);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      {/* Google AdSense Ad Unit */}
      <div className="w-full max-w-[728px] mx-auto mb-4">
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1138854450517299"
          data-ad-slot="your-ad-slot-id"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
      </div>

      {activeCall ? (
        <EmergencyCall number={activeCall} onEnd={handleEndCall} />
      ) : (
        <EmergencyDialer onCall={handleStartCall} />
      )}
    </div>
  );
};

export default Index;