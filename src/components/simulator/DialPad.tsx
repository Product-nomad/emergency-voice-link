import React from 'react';
import { Button } from '@/components/ui/button';
import { DialPadProps, DIAL_PAD_DIGITS } from '@/types/simulator';

/**
 * DialPad Component
 * Renders the numeric keypad for dialing
 * Single Responsibility: Only handles digit input UI
 */
const DialPad: React.FC<DialPadProps> = ({ onDigitPress, disabled = false }) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
      {DIAL_PAD_DIGITS.map((digit) => (
        <Button
          key={digit}
          onClick={() => onDigitPress(digit.toString())}
          className="emergency-button h-12 sm:h-14 text-lg sm:text-xl"
          variant="outline"
          disabled={disabled}
          aria-label={`Dial ${digit}`}
        >
          {digit}
        </Button>
      ))}
    </div>
  );
};

export default DialPad;
