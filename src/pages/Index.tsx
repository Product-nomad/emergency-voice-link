import React, { useState } from 'react';
import EmergencyDialer from '@/components/EmergencyDialer';
import EmergencyCall from '@/components/EmergencyCall';
import { trackConversion } from '@/utils/googleAds';
import Layout from '@/components/Layout';

const Index = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);

  const handleStartCall = (number: string) => {
    setActiveCall(number);
    trackConversion(number);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] bg-background flex items-center justify-center relative p-4">
        {activeCall ? (
          <EmergencyCall number={activeCall} onEnd={handleEndCall} />
        ) : (
          <EmergencyDialer onCall={handleStartCall} />
        )}
      </div>
    </Layout>
  );
};

export default Index;