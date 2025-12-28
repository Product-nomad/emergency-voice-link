import React from 'react';
import Navigation from './Navigation';
import Footer from './Footer';
import CookieBanner from './CookieBanner';

/**
 * MainLayout Component
 * Provides consistent page structure across all pages
 * Contains Navigation, Footer, and CookieBanner
 * Single Responsibility: Page layout composition only
 */
interface MainLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, showFooter = true }) => {
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

export default MainLayout;
