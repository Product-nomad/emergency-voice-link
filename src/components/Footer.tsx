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
            © 2025 911 Call Simulator - Educational Tool Only
          </p>
          <p className="text-gray-500 text-xs">
            This is a training simulation. For real emergencies, dial 911.
          </p>
          <Link 
            to="/privacy" 
            className="inline-block text-gray-400 hover:text-white text-sm transition-colors mt-2"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
