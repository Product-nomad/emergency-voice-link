import React from 'react';
import { Button } from '@/components/ui/button';
import { PhoneOff } from 'lucide-react';
import { useEmergencyCall } from '@/hooks/useEmergencyCall';
import { CallStatusIndicator, CallDuration } from '@/components/simulator';
import { CallProps } from '@/types/simulator';

/**
 * EmergencyCall Component
 * Handles the active call UI with ElevenLabs integration
 * Uses useEmergencyCall hook for call management logic
 * Implements "Ring-then-Connect" flow for better perceived latency
 */
const EmergencyCall: React.FC<CallProps> = ({ number, onEnd }) => {
  const { callDuration, callPhase, handleEndCall, formatDuration } = useEmergencyCall({
    onCallEnd: onEnd,
  });

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6 border border-border">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-foreground">
            Emergency Call
          </h2>
          <p className="text-muted-foreground">
            {callPhase === 'connected' ? `Connected to ${number}` : `Calling ${number}`}
          </p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            <CallStatusIndicator callPhase={callPhase} />
          </div>

          {/* Only show call duration when connected */}
          {callPhase === 'connected' && (
            <CallDuration seconds={callDuration} />
          )}

          {/* Show elapsed time indicator while connecting */}
          {(callPhase === 'ringing' || callPhase === 'connecting') && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-mono">
                --:--
              </p>
            </div>
          )}

          <Button
            onClick={handleEndCall}
            className="w-full bg-red-600 hover:bg-red-700"
            size="lg"
          >
            <PhoneOff className="mr-2 h-4 w-4" /> End Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCall;
