// Simulator Types - Type definitions for the phone simulator components

export interface DialerProps {
  onCall: (number: string) => void;
}

export interface CallProps {
  number: string;
  onEnd: () => void;
}

export interface DialPadProps {
  onDigitPress: (digit: string) => void;
  disabled?: boolean;
}

export interface DisplayScreenProps {
  value: string;
  placeholder?: string;
}

export interface CallButtonProps {
  onCall: () => void;
  onClear: () => void;
  disabled?: boolean;
}

export interface DisclaimerHeaderProps {
  title: string;
  subtitle: string;
  warning?: string;
}

export type CallPhase = 'ringing' | 'connecting' | 'connected' | 'error';

export interface CallStatusIndicatorProps {
  callPhase: CallPhase;
}

export interface CallDurationProps {
  seconds: number;
}

export interface UsePhoneSimulatorReturn {
  number: string;
  handleDigitPress: (digit: string) => void;
  handleCall: () => void;
  clearNumber: () => void;
  isValidNumber: boolean;
}

export type EmergencyNumber = '911' | '999';

export const VALID_EMERGENCY_NUMBERS: readonly string[] = ['911', '999'] as const;
export const MAX_DIAL_LENGTH = 3;

export const DIAL_PAD_DIGITS: readonly (string | number)[] = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 9,
  '*', 0, '#'
] as const;
