import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-4">
      <p className="text-sm text-muted-foreground">
        We use cookies to improve your experience.
      </p>
      <Button size="sm" onClick={handleAccept}>
        Accept
      </Button>
    </div>
  );
};

export default CookieBanner;
