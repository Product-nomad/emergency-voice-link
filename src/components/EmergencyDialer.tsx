import React from 'react';
import { usePhoneSimulator } from '@/hooks/usePhoneSimulator';
import {
  DialPad,
  DisplayScreen,
  CallButton,
  DisclaimerHeader,
} from '@/components/simulator';
import { DialerProps } from '@/types/simulator';

/**
 * EmergencyDialer Component
 * Composes smaller components to create the full dialer interface
 * Uses usePhoneSimulator hook for business logic (Dependency Inversion)
 */
const EmergencyDialer: React.FC<DialerProps> = ({ onCall }) => {
  const { number, handleDigitPress, handleCall, clearNumber } =
    usePhoneSimulator(onCall);

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <DisclaimerHeader
        title="Emergency Call Simulator"
        subtitle="Dial 999 or 911"
        warning="For training purposes only"
      />

      <div className="bg-card rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-border">
        <DisplayScreen value={number} />
        <DialPad onDigitPress={handleDigitPress} />
        <CallButton onCall={handleCall} onClear={clearNumber} />
      </div>
    </div>
  );
};

export default EmergencyDialer;
