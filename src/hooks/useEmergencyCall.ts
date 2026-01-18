import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';
import { useRingingSound } from './useRingingSound';

type CallPhase = 'ringing' | 'connecting' | 'connected' | 'error';

interface UseEmergencyCallProps {
  onCallEnd: () => void;
}

interface UseEmergencyCallReturn {
  callDuration: number;
  callPhase: CallPhase;
  connectionError: string | null;
  handleEndCall: () => Promise<void>;
  formatDuration: (seconds: number) => string;
}

/**
 * Custom hook that encapsulates all emergency call logic
 * Handles ElevenLabs conversation, microphone access, and call state
 * Implements "Ring-then-Connect" flow for better perceived latency
 */
export const useEmergencyCall = ({
  onCallEnd,
}: UseEmergencyCallProps): UseEmergencyCallReturn => {
  const { toast } = useToast();
  const [callDuration, setCallDuration] = useState<number>(0);
  const [callPhase, setCallPhase] = useState<CallPhase>('ringing');
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { startRinging, stopRinging } = useRingingSound();

  const conversation = useConversation({
    onConnect: () => {
      // Agent WebSocket connected - stop ringing and start timer
      stopRinging();
      setCallPhase('connected');
      
      // Start the call timer only when truly connected
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      toast({
        title: 'Connected to Emergency Services',
        description: 'You are now connected to an emergency operator',
      });
    },
    onDisconnect: () => {
      stopRinging();
    },
    onMessage: () => {
      // If we receive a message, ensure we're in connected state
      if (callPhase !== 'connected') {
        stopRinging();
        setCallPhase('connected');
      }
    },
    onError: () => {
      stopRinging();
      setCallPhase('error');
      setConnectionError('Connection issue occurred');
      toast({
        title: 'Connection Error',
        description: 'Unable to connect. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const startCall = useCallback(async (): Promise<void> => {
    try {
      // Start ringing immediately for perceived latency reduction
      setCallPhase('ringing');
      startRinging();

      // Request microphone permission and fetch token in parallel
      const [, tokenResponse] = await Promise.all([
        navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        }),
        supabase.functions.invoke('elevenlabs-conversation-token'),
      ]);

      const { data, error } = tokenResponse;

      if (error || !data?.signed_url) {
        throw new Error('connection_failed');
      }

      // Transition to connecting phase
      setCallPhase('connecting');

      // Start the conversation with the signed URL
      await conversation.startSession({
        signedUrl: data.signed_url,
      });
    } catch (error) {
      stopRinging();
      let errorMessage = 'Unable to connect. Please try again.';

      if ((error as Error).name === 'NotAllowedError') {
        errorMessage = 'Please allow microphone access and try again.';
      } else if ((error as Error).name === 'NotFoundError') {
        errorMessage = 'No microphone detected.';
      }

      setCallPhase('error');
      setConnectionError(errorMessage);
      toast({
        title: 'Connection Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [conversation, toast, startRinging, stopRinging]);

  useEffect(() => {
    startCall();

    return () => {
      stopRinging();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      conversation.endSession();
    };
  }, []);

  const handleEndCall = useCallback(async (): Promise<void> => {
    stopRinging();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    await conversation.endSession();
    onCallEnd();
  }, [conversation, onCallEnd, stopRinging]);

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    callDuration,
    callPhase,
    connectionError,
    handleEndCall,
    formatDuration,
  };
};
