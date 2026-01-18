import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted');
    if (!accepted) {
      setVisible(true);
    }

    const handleReset = () => setVisible(true);
    window.addEventListener('reset-cookie-consent', handleReset);
    return () => window.removeEventListener('reset-cookie-consent', handleReset);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-card border border-border rounded-lg shadow-xl p-4">
      <p className="text-sm text-muted-foreground mb-3">
        We use cookies to analyze traffic and improve your experience.{' '}
        <Link to="/privacy" className="text-primary hover:underline">
          Learn more
        </Link>
      </p>
      <Button size="sm" onClick={handleAccept} className="w-full">
        Accept
      </Button>
    </div>
  );
};

export default CookieBanner;
