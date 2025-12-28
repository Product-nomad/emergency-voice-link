import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';

interface UseEmergencyCallProps {
  onCallEnd: () => void;
}

interface UseEmergencyCallReturn {
  callDuration: number;
  isConnecting: boolean;
  connectionError: string | null;
  handleEndCall: () => Promise<void>;
  formatDuration: (seconds: number) => string;
}

/**
 * Custom hook that encapsulates all emergency call logic
 * Handles ElevenLabs conversation, microphone access, and call state
 */
export const useEmergencyCall = ({
  onCallEnd,
}: UseEmergencyCallProps): UseEmergencyCallReturn => {
  const { toast } = useToast();
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      setIsConnecting(false);
      toast({
        title: 'Connected to Emergency Services',
        description: 'You are now connected to an emergency operator',
      });
    },
    onDisconnect: () => {
      // Session ended
    },
    onMessage: () => {
      // Message received
    },
    onError: () => {
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
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke(
        'elevenlabs-conversation-token'
      );

      if (error || !data?.signed_url) {
        throw new Error('connection_failed');
      }

      // Start the conversation with the signed URL
      await conversation.startSession({
        signedUrl: data.signed_url,
      });
    } catch (error) {
      let errorMessage = 'Unable to connect. Please try again.';

      if ((error as Error).name === 'NotAllowedError') {
        errorMessage = 'Please allow microphone access and try again.';
      } else if ((error as Error).name === 'NotFoundError') {
        errorMessage = 'No microphone detected.';
      }

      setConnectionError(errorMessage);
      toast({
        title: 'Connection Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [conversation, toast]);

  useEffect(() => {
    startCall();

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      conversation.endSession();
    };
  }, []);

  const handleEndCall = useCallback(async (): Promise<void> => {
    await conversation.endSession();
    onCallEnd();
  }, [conversation, onCallEnd]);

  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    callDuration,
    isConnecting,
    connectionError,
    handleEndCall,
    formatDuration,
  };
};
