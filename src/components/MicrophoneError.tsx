import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MicrophoneErrorProps {
  onBack: () => void;
}

const MicrophoneError = ({ onBack }: MicrophoneErrorProps) => (
  <div className="w-full max-w-md mx-auto p-6">
    <Alert variant="destructive">
      <AlertDescription>
        Microphone access is required for emergency calls. Please enable microphone access in your browser settings and try again.
      </AlertDescription>
    </Alert>
    <Button
      onClick={onBack}
      className="w-full mt-4"
      variant="secondary"
    >
      Back
    </Button>
  </div>
);

export default MicrophoneError;