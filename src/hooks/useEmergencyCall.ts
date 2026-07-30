import { useEffect, useState, useCallback, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useConversation } from '@elevenlabs/react';
import { useRingingSound } from './useRingingSound';
import { getCachedToken, prefetchToken, clearTokenCache } from '@/services/tokenPrefetch';
import { formatDuration } from '@/utils/duration';
import { trackCallLatency } from '@/utils/googleAds';

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
 * Implements "Ring-then-Connect" flow with WebRTC for lowest latency
 *
 * Must be rendered under a <ConversationProvider> (mounted in App.tsx) —
 * @elevenlabs/react's useConversation requires one, unlike the deprecated
 * @11labs/react it replaced.
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

  // Latency instrumentation. startSession() no longer returns a promise that
  // resolves on connect (see below), so "connected" timing has to be read
  // inside the async onConnect callback instead of after an awaited call —
  // these refs carry the dial-start time and token-ready time across to it.
  const startTimeRef = useRef<number>(0);
  const tokenMsRef = useRef<number>(0);

  const conversation = useConversation({
    onConnect: () => {
      // Agent WebRTC connected - stop ringing and start timer
      stopRinging();
      setCallPhase('connected');

      const connectedMs = performance.now() - startTimeRef.current;
      console.log(`[EmergencyCall] Connected in ${connectedMs.toFixed(0)}ms`);
      trackCallLatency(tokenMsRef.current, connectedMs);

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
    onError: (message, context) => {
      console.error('[EmergencyCall] Conversation error:', message, context);
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
    startTimeRef.current = performance.now();

    try {
      // Start ringing immediately for perceived latency reduction
      setCallPhase('ringing');
      startRinging();

      // Check for pre-fetched token first (from warmup during dialing)
      let token = getCachedToken();

      // Request microphone permission immediately
      const micPromise = navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // If no cached token, fetch one in parallel with mic permission
      if (!token) {
        console.log('[EmergencyCall] No cached token, fetching...');
        const [, fetchedToken] = await Promise.all([
          micPromise,
          prefetchToken(),
        ]);
        token = fetchedToken;
      } else {
        console.log('[EmergencyCall] Using pre-fetched token');
        await micPromise;
      }

      if (!token) {
        throw new Error('connection_failed');
      }

      tokenMsRef.current = performance.now() - startTimeRef.current;
      console.log(`[EmergencyCall] Token ready in ${tokenMsRef.current.toFixed(0)}ms`);

      // Transition to connecting phase
      setCallPhase('connecting');

      // Start the conversation with WebRTC for lowest latency. Unlike the
      // previous SDK, startSession() is fire-and-forget: it never returns a
      // promise or throws for connection failures. Success is reported via
      // onConnect above, failure via onError — both registered on the hook.
      conversation.startSession({
        conversationToken: token,
        connectionType: 'webrtc',
      });
    } catch (error) {
      // Only mic-permission and token-fetch failures land here now —
      // connection failures are handled by the onError callback instead.
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
      clearTokenCache();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      conversation.endSession();
    };
  }, []);

  const handleEndCall = useCallback(async (): Promise<void> => {
    stopRinging();
    clearTokenCache();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    conversation.endSession();
    onCallEnd();
  }, [conversation, onCallEnd, stopRinging]);

  return {
    callDuration,
    callPhase,
    connectionError,
    handleEndCall,
    // Pure helper imported from `@/utils/duration` so it can be unit-tested.
    formatDuration,
  };
};
