import React from 'react';
import { Link } from 'react-router-dom';
import KofiWidget from './KofiWidget';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-6">
          <KofiWidget />
        </div>
        <div className="text-center space-y-2">
          <p className="text-gray-300 text-sm">
            © 2025 911/999 Call Simulator - Educational Tool Only
          </p>
          <p className="text-gray-500 text-xs">
            This is a training simulation. For real emergencies, dial 911.
          </p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Link 
              to="/privacy" 
              className="text-gray-400 hover:text-white text-sm transition-colors hover:underline"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600">|</span>
            <button
              onClick={() => {
                localStorage.removeItem('cookies-accepted');
                window.dispatchEvent(new CustomEvent('reset-cookie-consent'));
              }}
              className="text-gray-400 hover:text-white text-sm transition-colors hover:underline"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
