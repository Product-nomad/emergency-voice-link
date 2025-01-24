import React, { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { PhoneOff } from 'lucide-react';
import { useConversation } from '@11labs/react';
import CallStatus from './CallStatus';
import MicrophoneError from './MicrophoneError';

interface EmergencyCallProps {
  number: string;
  onEnd: () => void;
}

const EmergencyCall = ({ number, onEnd }: EmergencyCallProps) => {
  const { toast } = useToast();
  const [callDuration, setCallDuration] = useState(0);
  const conversation = useConversation();
  const [isConnecting, setIsConnecting] = useState(true);
  const [micPermission, setMicPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleEndCall = useCallback(async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    await conversation.endSession();
    onEnd();
  }, [stream, conversation, onEnd]);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const startCall = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        
        setStream(audioStream);
        setMicPermission(true);
        
        await conversation.startSession({
          agentId: 'li8AdGwCO2tlhj8KMJBx'
        });

        setIsConnecting(false);
        toast({
          title: "Connected to Emergency Services",
          description: "You are now connected to an emergency operator",
        });
      } catch (error) {
        console.error('Microphone or connection error:', error);
        setMicPermission(false);
        toast({
          title: "Connection Error",
          description: error instanceof Error ? error.message : "Failed to connect. Please check your microphone permissions.",
          variant: "destructive"
        });
      }
    };

    startCall();
    timer = setInterval(() => setCallDuration(prev => prev + 1), 1000);

    return () => {
      clearInterval(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      conversation.endSession();
    };
  }, [conversation, toast]);

  if (micPermission === false) {
    return <MicrophoneError onBack={onEnd} />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Emergency Call</h2>
          <p className="text-gray-600">Connected to {number}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <CallStatus 
              isConnecting={isConnecting}
              micPermission={micPermission}
            />
          </div>

          <div className="text-center">
            <p className="text-xl font-mono">{formatDuration(callDuration)}</p>
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