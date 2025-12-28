import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { CallButtonProps } from '@/types/simulator';

/**
 * CallButton Component
 * Renders the Clear and Call action buttons
 * Single Responsibility: Only handles call initiation UI
 */
const CallButton: React.FC<CallButtonProps> = ({
  onCall,
  onClear,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4">
      <Button
        onClick={onClear}
        variant="outline"
        className="emergency-button h-12 sm:h-14"
        aria-label="Clear dialed number"
      >
        Clear
      </Button>
      <Button
        onClick={onCall}
        className="emergency-button bg-red-600 hover:bg-red-700 h-12 sm:h-14"
        disabled={disabled}
        aria-label="Start emergency call"
      >
        <Phone className="mr-2 h-4 w-4" /> Call
      </Button>
    </div>
  );
};

export default CallButton;
