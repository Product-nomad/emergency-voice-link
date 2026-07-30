import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import EmergencyDialer from "@/components/EmergencyDialer";
import EmergencyCall from "@/components/EmergencyCall";
import HomepageContent from "@/components/HomepageContent";
import { trackConversion } from "@/utils/googleAds";
import MainLayout from "@/components/MainLayout";
import { getCurrentDomainBase } from "@/utils/domain";

// No aggregateRating here: we have no real review data. Fabricating one
// violates the project's data-honesty rule and risks a Google structured-data
// manual action for fake review markup — add it back only with real numbers.
function getStructuredData(base: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "911/999 Call Simulator",
        url: base,
        description:
          "Free interactive 911/999 simulator for kids. Teach your child how to call emergency services safely with our realistic, AI-powered dispatcher training tool.",
      },
      {
        "@type": "WebApplication",
        name: "911/999 Call Simulator",
        url: base,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description:
          "An AI-powered 911 call simulator that teaches children how to respond in emergencies. Practice calling 911 in a safe, controlled environment.",
        featureList: [
          "AI-powered dispatcher simulation",
          "Realistic emergency call experience",
          "Safe practice environment",
          "Age-appropriate for children 4+",
        ],
        screenshot: `${base}/og-image.png`,
      },
      {
        "@type": "Organization",
        name: "911/999 Call Simulator",
        url: base,
        logo: `${base}/favicon.ico`,
      },
    ],
  };
}

const Index = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const structuredData = getStructuredData(getCurrentDomainBase(host));

  const handleStartCall = (number: string) => {
    setActiveCall(number);
    trackConversion(number);
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  return (
    <MainLayout>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
      <div className="min-h-[calc(100vh-200px)] bg-background flex items-center justify-center relative p-4">
        {activeCall ? (
          <EmergencyCall number={activeCall} onEnd={handleEndCall} />
        ) : (
          <EmergencyDialer onCall={handleStartCall} />
        )}
      </div>
      <HomepageContent />
    </MainLayout>
  );
};

export default Index;
