import React from 'react';
import { CallDurationProps } from '@/types/simulator';

/**
 * CallDuration Component
 * Displays the formatted call duration
 */
const CallDuration: React.FC<CallDurationProps> = ({ seconds }) => {
  const formatDuration = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <p className="text-lg sm:text-xl font-mono text-foreground">
        {formatDuration(seconds)}
      </p>
    </div>
  );
};

export default CallDuration;
