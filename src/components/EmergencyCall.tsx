import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Phone, PhoneOff, Mic } from 'lucide-react';
import { useConversation } from '@11labs/react';

interface EmergencyCallProps {
  number: string;
  onEnd: () => void;
}

const EmergencyCall = ({ number, onEnd }: EmergencyCallProps) => {
  const { toast } = useToast();
  const [callDuration, setCallDuration] = useState(0);
  const conversation = useConversation();
  const [isConnecting, setIsConnecting] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const startCall = async () => {
      try {
        // Safari and iOS Chrome specific audio constraints
        const audioConstraints = {
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
          }
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(audioConstraints);
        setStream(mediaStream);
        
        await conversation.startSession({
          agentId: 'li8AdGwCO2tlhj8KMJBx',
          overrides: {
            agent: {
              firstMessage: `Emergency operator connected. How can I help you?`,
              language: 'en'
            }
          }
        });

        setIsConnecting(false);
        toast({
          title: "Connected to Emergency Services",
          description: "You are now connected to an emergency operator",
        });
      } catch (error) {
        console.error('Emergency call error:', error);
        let errorMessage = "Failed to connect to emergency services. ";
        
        if (error instanceof Error) {
          if (error.name === 'NotAllowedError') {
            errorMessage += "Please allow microphone access and try again.";
          } else if (error.name === 'NotFoundError') {
            errorMessage += "No microphone found. Please check your device settings.";
          } else {
            errorMessage += error.message;
          }
        }

        toast({
          title: "Connection Error",
          description: errorMessage,
          variant: "destructive"
        });
        onEnd();
      }
    };

    startCall();

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      conversation.endSession();
    };
  }, []);

  const handleEndCall = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    await conversation.endSession();
    onEnd();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Emergency Call</h2>
          <p className="text-gray-600">Connected to {number}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            {isConnecting ? (
              <div className="pulse">
                <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center">
                  <Phone className="h-12 w-12 text-white" />
                </div>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
                <Mic className="h-12 w-12 text-white" />
              </div>
            )}
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