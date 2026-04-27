import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Feedback from "./pages/Feedback";
import Guide from "./pages/Guide";
import Scripts from "./pages/Scripts";
import Protocol from "./pages/Protocol";
import FAQ from "./pages/FAQ";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import SeoCanonical from "./components/SeoCanonical";
import { loadAnalyticsIfConsented } from "./utils/consent";

const queryClient = new QueryClient();

const App = () => {
  // If the user accepted cookies in a prior session, load analytics
  // immediately. New visitors see the cookie banner first; analytics
  // only loads when they click Accept.
  useEffect(() => {
    loadAnalyticsIfConsented();
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SeoCanonical />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/scripts" element={<Scripts />} />
              <Route path="/protocol" element={<Protocol />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
