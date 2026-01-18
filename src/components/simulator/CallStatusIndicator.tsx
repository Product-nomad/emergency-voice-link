import React from 'react';
import { Phone, Mic, Loader2 } from 'lucide-react';

type CallPhase = 'ringing' | 'connecting' | 'connected' | 'error';

interface CallStatusIndicatorProps {
  callPhase: CallPhase;
}

/**
 * CallStatusIndicator Component
 * Shows the current call connection status with visual feedback
 */
const CallStatusIndicator: React.FC<CallStatusIndicatorProps> = ({
  callPhase,
}) => {
  if (callPhase === 'ringing') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="animate-pulse">
          <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-amber-500 flex items-center justify-center ring-4 ring-amber-500/30 ring-offset-2 ring-offset-background animate-[ping_1.5s_ease-in-out_infinite]">
            <Phone className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
          </div>
        </div>
        <p className="text-amber-600 dark:text-amber-400 font-medium animate-pulse">
          Ringing...
        </p>
      </div>
    );
  }

  if (callPhase === 'connecting') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-blue-500 flex items-center justify-center">
          <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 text-white animate-spin" />
        </div>
        <p className="text-blue-600 dark:text-blue-400 font-medium animate-pulse">
          Connecting...
        </p>
      </div>
    );
  }

  if (callPhase === 'error') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-red-600 flex items-center justify-center">
          <Phone className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
        </div>
        <p className="text-red-600 dark:text-red-400 font-medium">
          Connection Failed
        </p>
      </div>
    );
  }

  // Connected state
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-green-500 flex items-center justify-center">
        <Mic className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
      </div>
      <p className="text-green-600 dark:text-green-400 font-medium">
        Connected
      </p>
    </div>
  );
};

export default CallStatusIndicator;
