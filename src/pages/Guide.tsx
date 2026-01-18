import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import { Phone, MapPin, AlertTriangle, CheckCircle, XCircle, BookOpen } from 'lucide-react';

const howToStructuredData = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Teach Kids to Call 911",
  "description": "Step-by-step guide for parents and teachers on teaching children when and how to call 911. Learn safe practice methods and address memorization tips.",
  "image": "https://911callsimulator.com/og-image.png",
  "totalTime": "PT30M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "0"
  },
  "supply": [
    {
      "@type": "HowToSupply",
      "name": "Phone or tablet with microphone"
    }
  ],
  "tool": [
    {
      "@type": "HowToTool",
      "name": "911/999 Call Simulator"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Explain What 911 Is",
      "text": "Tell your child that 911 is a special phone number that connects them to helpers like police, firefighters, and paramedics who come when someone is in danger.",
      "position": 1
    },
    {
      "@type": "HowToStep",
      "name": "Show Them How to Dial",
      "text": "Practice finding and pressing 9-1-1 on your phone. Explain that on most phones, emergency calls work even without a password.",
      "position": 2
    },
    {
      "@type": "HowToStep",
      "name": "Teach Them to Stay Calm",
      "text": "Role-play staying calm. Practice taking deep breaths before speaking. The dispatcher needs to understand them clearly.",
      "position": 3
    },
    {
      "@type": "HowToStep",
      "name": "Practice the Key Information",
      "text": "Drill the essentials: their name, address, what's wrong, and where they are in the house. Keep it simple for young children.",
      "position": 4
    },
    {
      "@type": "HowToStep",
      "name": "Use This Simulator",
      "text": "Let them practice with our 911/999 simulator. It provides a safe, realistic experience without tying up real emergency lines.",
      "position": 5
    },
    {
      "@type": "HowToStep",
      "name": "Review Regularly",
      "text": "Like any skill, calling 911 requires practice. Review every few months to keep the knowledge fresh.",
      "position": 6
    }
  ]
};

const Guide = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>How to Teach Kids to Call 911 | Parents & Teachers Guide</title>
        <meta name="description" content="Step-by-step guide for parents and teachers on teaching children when and how to call 911. Learn safe practice methods and address memorization tips." />
        <script type="application/ld+json">
          {JSON.stringify(howToStructuredData)}
        </script>
      </Helmet>
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How to Teach Kids to Call 911
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive guide for parents and teachers on preparing children for emergency situations
          </p>
        </header>

        {/* Why This Matters */}
        <section className="mb-12">
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">Why This Training Matters</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In an emergency, a child who knows how to call 911 can save a life—including their own. 
                  Studies show that children as young as 4 can learn to dial 911, but they need practice 
                  in a safe, controlled environment to build confidence and muscle memory.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* When to Call vs When Not to Call */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            When to Call 911
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* When TO Call */}
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">Yes, Call 911 When:</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Someone is seriously hurt or very sick",
                  "There is a fire or you smell smoke",
                  "Someone is breaking into your home",
                  "You see a serious car accident",
                  "Someone is not breathing",
                  "A grown-up is unconscious and won't wake up",
                  "You feel unsafe and no adult can help"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-green-700 dark:text-green-400">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* When NOT to Call */}
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="h-6 w-6 text-red-600" />
                <h3 className="text-xl font-semibold text-red-800 dark:text-red-300">Do NOT Call 911 For:</h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Small cuts or minor injuries",
                  "Lost pets or toys",
                  "Homework help or questions",
                  "To test if it works (except simulators like this)",
                  "Sibling arguments or small fights",
                  "Power outages (unless dangerous)",
                  "Non-emergency police questions"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-red-700 dark:text-red-400">
                    <span className="text-red-500 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Teaching Their Address */}
        <section className="mb-12">
          <div className="bg-accent/50 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Teaching Your Address</h2>
            </div>
            
            <p className="text-muted-foreground mb-6">
              One of the most critical pieces of information in an emergency is your home address. 
              Here are proven methods to help children memorize it:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-background rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-2">🎵 Make It a Song</h4>
                <p className="text-sm text-muted-foreground">
                  Set your address to a familiar tune like "Twinkle Twinkle Little Star" or create a simple rhyme.
                </p>
              </div>
              <div className="bg-background rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-2">📝 Practice Writing</h4>
                <p className="text-sm text-muted-foreground">
                  Have them write or trace their address regularly. Visual and kinetic learning reinforces memory.
                </p>
              </div>
              <div className="bg-background rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-2">🎮 Quiz Games</h4>
                <p className="text-sm text-muted-foreground">
                  Turn address practice into a game with small rewards for correct answers.
                </p>
              </div>
              <div className="bg-background rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-2">🏠 Visual Cues</h4>
                <p className="text-sm text-muted-foreground">
                  Post the address in their room. Point out the house number when coming home.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Step-by-Step Teaching Guide
          </h2>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Explain What 911 Is",
                desc: "Tell your child that 911 is a special phone number that connects them to helpers like police, firefighters, and paramedics who come when someone is in danger."
              },
              {
                step: 2,
                title: "Show Them How to Dial",
                desc: "Practice finding and pressing 9-1-1 on your phone. Explain that on most phones, emergency calls work even without a password."
              },
              {
                step: 3,
                title: "Teach Them to Stay Calm",
                desc: "Role-play staying calm. Practice taking deep breaths before speaking. The dispatcher needs to understand them clearly."
              },
              {
                step: 4,
                title: "Practice the Key Information",
                desc: "Drill the essentials: their name, address, what's wrong, and where they are in the house. Keep it simple for young children."
              },
              {
                step: 5,
                title: "Use This Simulator",
                desc: "Let them practice with our 911/999 simulator. It provides a safe, realistic experience without tying up real emergency lines."
              },
              {
                step: 6,
                title: "Review Regularly",
                desc: "Like any skill, calling 911 requires practice. Review every few months to keep the knowledge fresh."
              }
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start bg-muted/30 rounded-xl p-5">
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Use This Simulator */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
            <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Why Use This Simulator?
            </h2>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">Safe Practice:</strong> Children can practice as many times as needed without accidentally calling real emergency services.
              </p>
              <p>
                <strong className="text-foreground">Realistic Experience:</strong> Our AI-powered dispatcher responds just like a real 911 operator, asking the same questions in a calm, reassuring voice.
              </p>
              <p>
                <strong className="text-foreground">Build Confidence:</strong> Familiarity reduces fear. When children know what to expect, they're more likely to act effectively in a real emergency.
              </p>
            </div>
          </div>
        </section>

        {/* Important Reminder */}
        <section>
          <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-destructive mb-2">Important Reminder</h3>
              <p className="text-muted-foreground">
                This website is for educational purposes only. It does not connect to real emergency services. 
                If you have an actual emergency, please dial 911 on your phone immediately.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Guide;
