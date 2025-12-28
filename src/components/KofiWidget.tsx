import { useEffect, useRef } from 'react';

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
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    const initWidget = () => {
      if (window.kofiwidget2 && containerRef.current) {
        window.kofiwidget2.init('Support this site', '#73b8f5', 'Q5Q41R660M');
        window.kofiwidget2.draw();
        
        // Move the generated widget into our container
        const widget = document.querySelector('.btn-container');
        if (widget && containerRef.current && !containerRef.current.contains(widget)) {
          containerRef.current.appendChild(widget);
        }
        initialized.current = true;
      }
    };

    const existingScript = document.querySelector('script[src="https://storage.ko-fi.com/cdn/widget/Widget_2.js"]');
    
    if (existingScript && window.kofiwidget2) {
      initWidget();
    } else if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://storage.ko-fi.com/cdn/widget/Widget_2.js';
      script.async = true;
      script.onload = () => {
        setTimeout(initWidget, 100);
      };
      document.body.appendChild(script);
    }
  }, []);

  return <div ref={containerRef} className="inline-block" />;
};

export default KofiWidget;
