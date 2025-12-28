import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import { MapPin, HelpCircle, Clipboard, Clock, Phone, Users } from 'lucide-react';

const Protocol = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>What Will 911 Ask You? | Dispatcher Protocol Explained</title>
        <meta name="description" content="Learn what questions 911 dispatchers ask and why. Understand the protocol so you can be prepared to give clear, helpful information in an emergency." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Will 911 Ask You?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Understanding the dispatcher protocol helps you stay calm and provide life-saving information
          </p>
        </header>

        {/* Introduction */}
        <div className="bg-muted/50 rounded-2xl p-6 mb-12">
          <p className="text-muted-foreground leading-relaxed">
            When you call 911, a trained dispatcher will answer. Their job is to quickly understand your 
            emergency and send the right help. They follow a specific protocol to gather critical information 
            as fast as possible. Here's what to expect:
          </p>
        </div>

        {/* The Three Golden Questions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            The Three Golden Questions
          </h2>

          <div className="space-y-6">
            {/* Question 1: WHERE */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-xl flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">FIRST</span>
                    <h3 className="text-xl font-bold text-foreground">WHERE is the emergency?</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    This is the MOST important question. Even if the call gets disconnected, dispatchers can send help 
                    if they know your location.
                  </p>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground mb-2">They will ask:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• "What is your address?"</li>
                      <li>• "What city are you in?"</li>
                      <li>• "Are you at a house, apartment, or business?"</li>
                      <li>• "What's the nearest cross street?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 2: WHAT */}
            <div className="bg-gradient-to-r from-secondary/50 to-secondary/30 border border-secondary rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary-foreground/10 rounded-xl flex-shrink-0">
                  <HelpCircle className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-foreground text-background text-xs font-bold px-2 py-1 rounded">SECOND</span>
                    <h3 className="text-xl font-bold text-foreground">WHAT is happening?</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    The dispatcher needs to understand the type of emergency to send the right help—police, 
                    fire, or medical (or all three).
                  </p>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground mb-2">They will ask:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• "What's your emergency?"</li>
                      <li>• "Is anyone hurt?"</li>
                      <li>• "Is the person conscious and breathing?"</li>
                      <li>• "Is the danger still present?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Question 3: WHO */}
            <div className="bg-gradient-to-r from-accent to-accent/50 border border-border rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted rounded-xl flex-shrink-0">
                  <Users className="h-6 w-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-muted-foreground text-muted text-xs font-bold px-2 py-1 rounded">THIRD</span>
                    <h3 className="text-xl font-bold text-foreground">WHO needs help?</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Information about the person in distress helps responders prepare the right equipment 
                    and approach.
                  </p>
                  <div className="bg-background rounded-lg p-4">
                    <p className="text-sm font-medium text-foreground mb-2">They will ask:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• "How old is the person?"</li>
                      <li>• "What's your name?"</li>
                      <li>• "What's your phone number?"</li>
                      <li>• "How many people are involved?"</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pre-Arrival Instructions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <Clipboard className="h-7 w-7 text-primary" />
            Pre-Arrival Instructions
          </h2>

          <div className="bg-muted/30 rounded-2xl p-6">
            <p className="text-muted-foreground mb-6">
              While help is on the way, the dispatcher may give you instructions to help before responders arrive. 
              These are called "pre-arrival instructions" and can save lives.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  title: "CPR Instructions",
                  desc: "Step-by-step guidance for chest compressions if someone isn't breathing"
                },
                {
                  title: "Choking Assistance",
                  desc: "How to help someone who is choking on food or an object"
                },
                {
                  title: "Bleeding Control",
                  desc: "How to apply pressure to stop serious bleeding"
                },
                {
                  title: "Fire Safety",
                  desc: "How to safely exit, where to meet, staying low under smoke"
                },
                {
                  title: "Intruder Safety",
                  desc: "Where to hide, how to lock doors, staying quiet and safe"
                },
                {
                  title: "Childbirth Assistance",
                  desc: "Emergency guidance if a baby is coming before help arrives"
                }
              ].map((item, i) => (
                <div key={i} className="bg-background rounded-xl p-4 shadow-sm">
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stay on the Line */}
        <section className="mb-12">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-start gap-4">
            <Phone className="h-8 w-8 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Stay on the Line</h3>
              <p className="text-muted-foreground mb-4">
                The dispatcher will tell you when it's okay to hang up. Staying on the line allows them to:
              </p>
              <ul className="text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Give you updates on when help will arrive</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Provide life-saving instructions in real-time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Get additional information to help responders</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Call you back if disconnected</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Response Time */}
        <section className="mb-12">
          <div className="bg-muted/30 rounded-2xl p-6 flex items-start gap-4">
            <Clock className="h-8 w-8 text-muted-foreground flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">What Happens Next?</h3>
              <p className="text-muted-foreground">
                While you're still on the phone, the dispatcher is already sending help. Police, fire, 
                or ambulance teams are being notified and heading to your location. The clearer your 
                information, the faster they can find you.
              </p>
            </div>
          </div>
        </section>

        {/* Practice CTA */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Practice Makes Prepared</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Now that you know what to expect, try our simulator to practice answering these questions 
            in a safe environment.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Try the Simulator
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default Protocol;
