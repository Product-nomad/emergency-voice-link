import React from 'react';
import { Phone, Mic } from 'lucide-react';
import { CallStatusIndicatorProps } from '@/types/simulator';

/**
 * CallStatusIndicator Component
 * Shows the current call connection status with visual feedback
 */
const CallStatusIndicator: React.FC<CallStatusIndicatorProps> = ({
  isConnecting,
}) => {
  if (isConnecting) {
    return (
      <div className="pulse">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-red-500 flex items-center justify-center">
          <Phone className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-green-500 flex items-center justify-center">
      <Mic className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
    </div>
  );
};

export default CallStatusIndicator;
