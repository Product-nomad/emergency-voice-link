import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
      <CookieBanner />
    </div>
  );
};

export default Layout;
