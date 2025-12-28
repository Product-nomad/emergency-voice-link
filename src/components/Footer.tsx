import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import KofiWidget from './KofiWidget';

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
  const siteUrl = 'https://911callsimulator.com';
  const shareText = '911 Call Simulator - Help your child learn how to call 911 in an emergency';

  const shareLinks = [
    {
      icon: Facebook,
      label: 'Share on Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    },
    {
      icon: Twitter,
      label: 'Share on X',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      icon: Linkedin,
      label: 'Share on LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`,
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    toast.success('Link copied to clipboard!');
  };

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
        
        {/* Social sharing */}
        <div className="flex justify-center items-center gap-3 mb-6">
          <span className="text-muted-foreground text-sm">Share:</span>
          {shareLinks.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
            >
              <social.icon className="h-4 w-4" />
            </a>
          ))}
          <button
            onClick={copyLink}
            aria-label="Copy link"
            className="p-2 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
          >
            <Link2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <KofiWidget />
        </div>
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
