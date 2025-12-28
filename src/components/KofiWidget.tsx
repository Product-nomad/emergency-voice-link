import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kofiwidget2?: {
      init: (text: string, color: string, id: string) => void;
      draw: () => void;
    };
  }
}

const KofiWidget = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://storage.ko-fi.com/cdn/widget/Widget_2.js"]');
    
    const initWidget = () => {
      if (window.kofiwidget2 && containerRef.current) {
        containerRef.current.innerHTML = '';
        window.kofiwidget2.init('Support this site', '#73b8f5', 'Q5Q41R660M');
        const widgetHtml = window.kofiwidget2.draw();
        if (typeof widgetHtml === 'string') {
          containerRef.current.innerHTML = widgetHtml;
        }
      }
    };

    if (existingScript) {
      initWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    }
  }, []);

  return <div ref={containerRef} className="inline-block" />;
};

export default KofiWidget;
