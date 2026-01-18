import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import EmergencyDialer from "@/components/EmergencyDialer";
import EmergencyCall from "@/components/EmergencyCall";
import HomepageContent from "@/components/HomepageContent";
import { trackConversion } from "@/utils/googleAds";
import MainLayout from "@/components/MainLayout";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "911/999 Call Simulator",
      url: "https://911callsimulator.com",
      description:
        "Free interactive 911/999 simulator for kids. Teach your child how to call emergency services safely with our realistic, AI-powered dispatcher training tool.",
    },
    {
      "@type": "WebApplication",
      name: "911/999 Call Simulator",
      url: "https://911callsimulator.com",
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
      screenshot: "https://911callsimulator.com/og-image.png",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "150",
      },
    },
    {
      "@type": "Organization",
      name: "911/999 Call Simulator",
      url: "https://911callsimulator.com",
      logo: "https://911callsimulator.com/favicon.ico",
    },
  ],
};

const Index = () => {
  const [activeCall, setActiveCall] = useState<string | null>(null);

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
