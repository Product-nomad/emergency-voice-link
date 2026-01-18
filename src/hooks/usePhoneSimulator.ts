import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  UsePhoneSimulatorReturn,
  VALID_EMERGENCY_NUMBERS,
  MAX_DIAL_LENGTH,
} from '@/types/simulator';
import { warmupConnection } from '@/services/tokenPrefetch';

/**
 * Custom hook that encapsulates all phone simulator business logic
 * Separates dialing logic from UI rendering (SOLID - Single Responsibility)
 * Pre-fetches connection token when user starts dialing emergency numbers
 */
export const usePhoneSimulator = (
  onValidCall: (number: string) => void
): UsePhoneSimulatorReturn => {
  const [number, setNumber] = useState<string>('');
  const { toast } = useToast();

  // Pre-fetch token when user has dialed a valid prefix
  useEffect(() => {
    // Start warming up when user dials "9" (could be 911 or 999)
    if (number === '9' || number === '91' || number === '99') {
      console.log('[PhoneSimulator] Warming up connection...');
      warmupConnection();
    }
  }, [number]);

  const handleDigitPress = useCallback((digit: string): void => {
    setNumber((prev) => {
      if (prev.length < MAX_DIAL_LENGTH) {
        return prev + digit;
      }
      return prev;
    });
  }, []);

  const clearNumber = useCallback((): void => {
    setNumber('');
  }, []);

  const isValidNumber = VALID_EMERGENCY_NUMBERS.includes(number);

  const handleCall = useCallback((): void => {
    if (isValidNumber) {
      onValidCall(number);
    } else {
      toast({
        title: 'Invalid Emergency Number',
        description: 'Please dial 999 or 911 for emergency services',
        variant: 'destructive',
      });
    }
  }, [number, isValidNumber, onValidCall, toast]);

  return {
    number,
    handleDigitPress,
    handleCall,
    clearNumber,
    isValidNumber,
  };
};
