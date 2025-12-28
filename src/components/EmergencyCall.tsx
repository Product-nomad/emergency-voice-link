import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Phone, PhoneOff, Mic } from 'lucide-react';
import { useConversation } from '@11labs/react';
import { supabase } from '@/integrations/supabase/client';

interface EmergencyCallProps {
  number: string;
  onEnd: () => void;
}

const EmergencyCall = ({ number, onEnd }: EmergencyCallProps) => {
  const { toast } = useToast();
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('ElevenLabs: Connected to agent');
      setIsConnecting(false);
      toast({
        title: "Connected to Emergency Services",
        description: "You are now connected to an emergency operator",
      });
    },
    onDisconnect: () => {
      console.log('ElevenLabs: Disconnected from agent');
    },
    onMessage: (message) => {
      console.log('ElevenLabs message:', message);
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      const errorMessage = typeof error === 'string' ? error : 'Connection failed';
      setConnectionError(errorMessage);
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    },
  });

  const startCall = useCallback(async () => {
    try {
      console.log('Requesting microphone permission...');
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      console.log('Microphone permission granted, fetching signed URL...');
      
      // Get signed URL from our edge function
      const { data, error } = await supabase.functions.invoke('elevenlabs-conversation-token');
      
      if (error) {
        console.error('Edge function error:', error);
        throw new Error('Failed to get conversation token');
      }
      
      if (!data?.signed_url) {
        console.error('No signed URL in response:', data);
        throw new Error('No signed URL received');
      }
      
      console.log('Got signed URL, starting session...');
      
      // Start the conversation with the signed URL
      await conversation.startSession({
        signedUrl: data.signed_url,
      });
      
      console.log('Session started successfully');
    } catch (error) {
      console.error('Call setup error:', error);
      
      let errorMessage = "Failed to connect to emergency services. ";
      
      if ((error as Error).name === 'NotAllowedError') {
        errorMessage += "Please allow microphone access and try again.";
      } else if ((error as Error).name === 'NotFoundError') {
        errorMessage += "No microphone detected.";
      } else {
        errorMessage += (error as Error).message || "Please check your device settings and try again.";
      }

      setConnectionError(errorMessage);
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [conversation, toast]);

  useEffect(() => {
    startCall();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      conversation.endSession();
    };
  }, []);

  const handleEndCall = async () => {
    await conversation.endSession();
    onEnd();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Emergency Call</h2>
          <p className="text-gray-600">Connected to {number}</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            {isConnecting ? (
              <div className="pulse">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-red-500 flex items-center justify-center">
                  <Phone className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-green-500 flex items-center justify-center">
                <Mic className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
              </div>
            )}
          </div>

          <div className="text-center">
            <p className="text-lg sm:text-xl font-mono">{formatDuration(callDuration)}</p>
          </div>

          <Button
            onClick={handleEndCall}
            className="w-full bg-red-600 hover:bg-red-700"
            size="lg"
          >
            <PhoneOff className="mr-2 h-4 w-4" /> End Call
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCall;
