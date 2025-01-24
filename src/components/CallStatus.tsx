import React from 'react';
import { Mic, MicOff, Phone } from 'lucide-react';

interface CallStatusProps {
  isConnecting: boolean;
  micPermission: boolean | null;
}

const CallStatus = ({ isConnecting, micPermission }: CallStatusProps) => {
  if (isConnecting) {
    return (
      <div className="pulse">
        <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center">
          <Phone className="h-12 w-12 text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center">
      {micPermission ? (
        <Mic className="h-12 w-12 text-white" />
      ) : (
        <MicOff className="h-12 w-12 text-white" />
      )}
    </div>
  );
};

export default CallStatus;