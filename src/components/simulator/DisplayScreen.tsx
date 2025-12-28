import React from 'react';
import { DisplayScreenProps } from '@/types/simulator';

/**
 * DisplayScreen Component
 * Shows the currently dialed number
 * Single Responsibility: Only handles display of the number
 */
const DisplayScreen: React.FC<DisplayScreenProps> = ({
  value,
  placeholder = '',
}) => {
  return (
    <div
      className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 h-12 text-foreground"
      aria-live="polite"
      aria-label={`Dialed number: ${value || 'empty'}`}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
    </div>
  );
};

export default DisplayScreen;
