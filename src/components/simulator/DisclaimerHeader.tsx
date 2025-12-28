import React from 'react';
import { DisclaimerHeaderProps } from '@/types/simulator';

/**
 * DisclaimerHeader Component
 * Displays the simulator title and training disclaimer
 * Single Responsibility: Only handles header/disclaimer display
 */
const DisclaimerHeader: React.FC<DisclaimerHeaderProps> = ({
  title,
  subtitle,
  warning,
}) => {
  return (
    <div className="text-center mb-4">
      <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
        {title}
      </h1>
      <p className="text-muted-foreground">{subtitle}</p>
      {warning && (
        <p className="text-sm text-destructive mt-1">{warning}</p>
      )}
    </div>
  );
};

export default DisclaimerHeader;
