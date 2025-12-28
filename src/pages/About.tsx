import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Linkedin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import simonPhoto from '@/assets/simon-photo.jpeg';

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About | 911 Call Simulator</title>
        <meta name="description" content="Learn about Simon, the creator of 911 Call Simulator - a safety tool built to help children learn emergency response." />
      </Helmet>
      <div className="py-16 px-4">
        <article className="max-w-2xl mx-auto">
          {/* Header */}
          <header className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              About Me
            </h1>
            <p className="font-serif text-xl md:text-2xl text-muted-foreground italic">
              Architecting Solutions. Mitigating Risk. Saving Lives.
            </p>
          </header>

          {/* Author intro with LinkedIn and photo */}
          <div className="flex items-start justify-between gap-6 mb-2">
            <div className="flex items-center gap-3 self-end">
              <p className="text-lg text-foreground">
                Hi, I'm <span className="font-semibold">Simon</span>
              </p>
              <a
                href="https://www.linkedin.com/in/newton-simon/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Simon's LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <img
              src={simonPhoto}
              alt="Simon - Creator of 911 Call Simulator"
              className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-lg"
            />
          </div>

          {/* Body content */}
          <div className="prose prose-lg max-w-none text-foreground/90 space-y-6">
            <p>
              I am a Senior Project Manager who believes that the best technology doesn't just solve business problems—it solves human ones.
            </p>

            <p>
              My career is defined by building complex enterprise systems, but this project—<strong>911 Call Simulator</strong>—was born from a much simpler, yet terrifying requirement: <strong>My own family's safety.</strong>
            </p>

            <h3 className="font-serif text-2xl font-bold text-foreground mt-10 mb-4">
              The Risk Assessment
            </h3>

            <p>
              As a father to a 6-year-old daughter, I identified a critical "Single Point of Failure" in our household safety plan. If I were to have an accident and become incapacitated, my daughter would be the sole responder.
            </p>

            <p>
              I implemented mitigation strategies—standard role-play scenarios—but I immediately hit a hard constraint: <strong>The Simulation Gap.</strong>
            </p>

            <p>
              We could talk about calling 911, but we couldn't <em>actually</em> dial it. This meant her training lacked the tactile reality needed to ensure performance under stress.
            </p>

            <h3 className="font-serif text-2xl font-bold text-foreground mt-10 mb-4">
              The Agile Solution
            </h3>

            <p>
              I approached this gap the same way I approach any enterprise roadblock: <strong>Build a Proof of Concept (POC).</strong>
            </p>

            <p>
              Adhering to PMP best practices, I avoided "Gold Plating" (adding unnecessary features that look cool but add no value). Instead, I focused on the <strong>MVP (Minimum Viable Product)</strong>:
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li><strong>The Requirement:</strong> A realistic dialler that connects to a voice agent.</li>
              <li><strong>The Tech Stack:</strong> Low-code/No-code tools for rapid deployment.</li>
              <li><strong>The Execution:</strong> I built the simulator to test the core hypothesis—that interactive AI could bridge the gap between role-play and reality.</li>
            </ul>

            <p>
              As I often tell my teams: <em>"We can build anything, but not everything."</em> I chose to build what mattered most.
            </p>

            <h3 className="font-serif text-2xl font-bold text-foreground mt-10 mb-4">
              Value Delivery
            </h3>

            <p>
              The result is a tool that delivers measurable value:
            </p>

            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Confidence:</strong> Removes the fear of the unknown for children.</li>
              <li><strong>Competence:</strong> Teaches the specific "handshake" protocol of emergency calls.</li>
              <li><strong>Outcome:</strong> A potential reduction in "Time to Response" during a real medical emergency.</li>
            </ol>

            <p>
              Whether I'm delivering physical or cloud infrastructure or a safety tool for toddlers, my goal is the same: <strong>Identify the problem, avoid the noise, and deliver the solution.</strong>
            </p>
          </div>

          <hr className="my-12 border-border" />

          {/* Footer action */}
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
    </Layout>
  );
};

export default About;
