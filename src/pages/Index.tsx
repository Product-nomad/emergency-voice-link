import React, { useState } from 'react';
import EmergencyDialer from '@/components/EmergencyDialer';
import EmergencyCall from '@/components/EmergencyCall';

const Index = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);

  const handleStartCall = (number: string) => {
    setActiveCall(number);
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