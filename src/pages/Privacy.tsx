import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/MainLayout";

const Privacy = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Privacy Policy | 911/999 Call Simulator</title>
        <meta
          name="description"
          content="Privacy Policy for 911/999 Call Simulator — what data is processed, by whom, and what your rights are."
        />
        {/* Canonical is set globally by SeoCanonical so each domain self-canonicalises. */}
      </Helmet>
      <div className="py-16 px-4">
        <article className="max-w-2xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last updated: April 2026</p>
          </header>

          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Overview</h2>
            <p>
              911/999 Call Simulator ("we," "our," or "us") is a free educational tool that lets children practise
              calling emergency services with an AI-powered dispatcher. This page explains exactly what happens to
              data when you use the tool — including the third parties involved.
            </p>
            <p>
              Operator: <strong>Product-nomad</strong> (independent, UK-based). Contact via the{" "}
              <Link to="/about" className="text-primary hover:underline">About page</Link>.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">What we don't do</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>We don't ask you to create an account.</li>
              <li>We don't store or replay voice conversations on our servers.</li>
              <li>We don't sell, rent, or share personal data with third parties for marketing.</li>
              <li>We don't connect to real emergency services. The simulator is role-play only.</li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">What does happen to your voice</h2>
            <p>
              When a child speaks during a simulated call, audio streams in real time over a WebRTC connection from
              the browser to <strong>ElevenLabs</strong> (an AI voice and conversation provider). ElevenLabs performs
              speech-to-text, the dispatcher response, and text-to-speech, then streams audio back. We do not store
              this audio. ElevenLabs' own retention and use of conversation data is governed by their privacy policy:{" "}
              <a
                href="https://elevenlabs.io/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                elevenlabs.io/privacy-policy
              </a>
              .
            </p>
            <p>
              <strong>To be explicit:</strong> voice data does leave the device when the simulator is in use. If
              that's not acceptable, do not use the simulator.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Sub-processors</h2>
            <p>The following third parties process data on our behalf when you use the site:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>ElevenLabs</strong> — live voice and dialogue (as described above).
              </li>
              <li>
                <strong>Supabase</strong> — hosts a small server-side function that issues short-lived session
                tokens, plus a rate-limiting table that records a one-way hash of your IP address (not the IP itself)
                for up to 60 minutes to prevent abuse.
              </li>
              <li>
                <strong>Google Analytics</strong> — anonymous, aggregated traffic statistics (page views, session
                duration). No first-party identifiers.
              </li>
              <li>
                <strong>Google AdSense</strong> — advertising. We do not run first-party advertising or share
                personal data with advertisers; ad selection is handled by Google subject to their policies.
              </li>
              <li>
                <strong>Cloudflare and/or Vercel</strong> — hosting, CDN, and basic security headers.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Children's privacy</h2>
            <p>
              This tool is designed for children aged roughly 5–12, used <em>under adult supervision</em>. We do not
              knowingly collect personal data from children:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>No accounts, no logins, no profiles.</li>
              <li>No persistent identifiers tied to a child user.</li>
              <li>
                Voice conversations are scenario-driven; the dispatcher is configured to keep the role-play
                educational and age-appropriate.
              </li>
              <li>
                We do not enable personalised advertising for users under the age of 18 in jurisdictions where this
                requires explicit consent (the AdSense account is configured in line with Google's children-content
                policies).
              </li>
            </ul>
            <p>
              <strong>Parents and guardians:</strong> if you have any concern about a session or want to ask what was
              processed, contact us via the{" "}
              <Link to="/about" className="text-primary hover:underline">About page</Link>.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Cookies and tracking</h2>
            <p>The site uses:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Strictly necessary cookies</strong> for the cookie-banner choice itself.
              </li>
              <li>
                <strong>Analytics and advertising cookies</strong> via Google Analytics and Google AdSense, subject
                to your choice on the cookie banner.
              </li>
            </ul>
            <p className="text-sm text-gray-500">
              Known limitation: the analytics and advertising scripts currently load on page-load before the cookie
              banner choice is registered. Bringing this strictly in line with UK PECR / GDPR is on our roadmap; until
              then you can block these by declining the banner, by using browser-level privacy settings, or by
              installing a content blocker.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Your rights (UK GDPR)</h2>
            <p>If you are in the UK or EU, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ask what data we hold about you (we generally hold none, by design).</li>
              <li>Ask us to erase any data we do hold.</li>
              <li>Object to the use of analytics or advertising cookies via the cookie banner or your browser.</li>
              <li>
                Lodge a complaint with the UK Information Commissioner's Office:{" "}
                <a
                  href="https://ico.org.uk/make-a-complaint/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  ico.org.uk/make-a-complaint
                </a>
                .
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Data security</h2>
            <p>
              The server-side credentials that connect to ElevenLabs are held in the Supabase Edge Function
              environment, never in client code. The token-mint endpoint enforces a per-IP-hash rate limit and a CORS
              allowlist. The technical posture is documented in the public threat model:{" "}
              <a
                href="https://github.com/Product-nomad/emergency-voice-link/blob/main/THREAT_MODEL.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                THREAT_MODEL.md
              </a>
              .
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Changes to this policy</h2>
            <p>
              We may update this Privacy Policy as the tool evolves. Material changes will be reflected in the
              "Last updated" date at the top and noted in the project's public CHANGELOG.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8 mb-4">Contact</h2>
            <p>
              Questions or requests? Visit the{" "}
              <Link to="/about" className="text-primary hover:underline">About page</Link> for contact details.
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
