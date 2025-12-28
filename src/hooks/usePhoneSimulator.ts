import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import {
  UsePhoneSimulatorReturn,
  VALID_EMERGENCY_NUMBERS,
  MAX_DIAL_LENGTH,
} from '@/types/simulator';

/**
 * Custom hook that encapsulates all phone simulator business logic
 * Separates dialing logic from UI rendering (SOLID - Single Responsibility)
 */
export const usePhoneSimulator = (
  onValidCall: (number: string) => void
): UsePhoneSimulatorReturn => {
  const [number, setNumber] = useState<string>('');
  const { toast } = useToast();

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
