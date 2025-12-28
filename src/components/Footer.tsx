import React from 'react';
import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/guide', label: 'Parents Guide' },
  { to: '/scripts', label: 'Scripts' },
  { to: '/protocol', label: 'Dispatcher Protocol' },
  { to: '/faq', label: 'FAQ' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
];

const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex flex-wrap justify-center gap-4 md:gap-8 mb-6">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 911 Call Simulator - Educational Tool Only
          </p>
          <p className="text-muted-foreground/70 text-xs mt-2">
            This is a training simulation. For real emergencies, dial 911.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
