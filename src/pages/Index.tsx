import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmergencyDialer from '@/components/EmergencyDialer';
import EmergencyCall from '@/components/EmergencyCall';
import { Button } from '@/components/ui/button';
import { trackConversion } from '@/utils/googleAds';

const Index = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStartCall = (number: string) => {
    setActiveCall(number);
    trackConversion(number);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center relative">
      {activeCall ? (
        <EmergencyCall number={activeCall} onEnd={handleEndCall} />
      ) : (
        <EmergencyDialer onCall={handleStartCall} />
      )}
      <Button
        onClick={() => navigate('/feedback')}
        className="fixed bottom-4 right-4"
        variant="outline"
      >
        Submit Feedback
      </Button>
    </div>
  );
};

export default Index;