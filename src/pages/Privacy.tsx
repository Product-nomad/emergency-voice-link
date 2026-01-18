import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/MainLayout';

const Privacy = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Privacy Policy | 911 Call Simulator</title>
        <meta 
          name="description" 
          content="Privacy Policy for 911 Call Simulator - Learn how we handle your data and protect your privacy." 
        />
        <link rel="canonical" href="https://911callsimulator.com/privacy" />
      </Helmet>
      <div className="py-16 px-4">
        <article className="max-w-2xl mx-auto">
          <header className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: January 2025
            </p>
          </header>

          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Overview
            </h2>
            <p>
              911 Call Simulator ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, and safeguard information when 
              you use our educational emergency call simulation tool.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Information We Collect
            </h2>
            <p>
              <strong>No Personal Data or Voice Recordings Are Permanently Stored.</strong>
            </p>
            <p>
              Our simulator is designed with privacy in mind:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Voice Data:</strong> Voice interactions with our AI dispatcher are 
                processed in real-time and are not recorded or stored on our servers.
              </li>
              <li>
                <strong>Analytics:</strong> We use Google Analytics to understand how visitors 
                use our site. This collects anonymous usage data such as page views and 
                session duration.
              </li>
              <li>
                <strong>Cookies:</strong> We use essential cookies to improve your experience 
                and remember your preferences (such as cookie consent).
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              How We Use Information
            </h2>
            <p>
              The limited information we collect is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our educational simulation service</li>
              <li>Understand how users interact with our tool</li>
              <li>Ensure the security and proper functioning of the website</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Third-Party Services
            </h2>
            <p>
              Our service uses the following third-party providers:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Google Analytics:</strong> For anonymous website traffic analysis
              </li>
              <li>
                <strong>Google AdSense:</strong> To display relevant advertisements
              </li>
              <li>
                <strong>ElevenLabs:</strong> For AI-powered voice interaction (processed in real-time, not stored)
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Children's Privacy
            </h2>
            <p>
              Our simulator is designed as an educational tool for children. We do not 
              knowingly collect personal information from children. The voice simulation 
              feature processes audio in real-time without storing any recordings.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Data Security
            </h2>
            <p>
              We implement appropriate technical and organizational measures to protect 
              against unauthorized access, alteration, disclosure, or destruction of data.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Your Rights
            </h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Opt out of analytics tracking by using browser privacy settings</li>
              <li>Clear cookies stored in your browser at any time</li>
              <li>Contact us with any privacy-related questions</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be 
              posted on this page with an updated revision date.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">
              Contact Us
            </h2>
            <p>
              If you have questions about this Privacy Policy, please visit our{' '}
              <Link to="/about" className="text-primary hover:underline">
                About page
              </Link>{' '}
              to learn more about us.
            </p>
          </div>

          <hr className="my-12 border-border" />

          <div className="flex justify-center">
            <Button asChild size="lg">
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Simulator
              </Link>
            </Button>
          </div>
        </article>
      </div>
    </MainLayout>
  );
};

export default Privacy;
