import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import { Flame, Heart, Shield, AlertTriangle } from 'lucide-react';

const scenarios = [
  {
    icon: Flame,
    title: "Fire Emergency",
    color: "orange",
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    borderClass: "border-orange-200 dark:border-orange-800",
    iconBg: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600",
    titleColor: "text-orange-800 dark:text-orange-300",
    description: "What to say when there's a fire or you see smoke",
    phrases: [
      { say: "There's a fire at my house!", context: "Start with the emergency" },
      { say: "I see smoke coming from the kitchen.", context: "Describe what you see" },
      { say: "The smoke alarm is going off.", context: "Mention any alerts" },
      { say: "I'm getting out of the house now.", context: "Tell them you're evacuating" },
      { say: "I'll meet the firefighters outside.", context: "Confirm you're safe" },
    ],
    tips: [
      "Get out first, then call 911 if possible",
      "If you can't get out, stay low under the smoke",
      "Never go back inside for anything",
      "Go to your meeting spot outside"
    ]
  },
  {
    icon: Heart,
    title: "Medical Emergency",
    color: "red",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600",
    titleColor: "text-red-800 dark:text-red-300",
    description: "What to say when someone is hurt or very sick",
    phrases: [
      { say: "Someone needs help! They're very sick.", context: "Explain it's medical" },
      { say: "My [mom/dad/grandma] fell and won't wake up.", context: "Describe unconsciousness" },
      { say: "They're having trouble breathing.", context: "Breathing problems" },
      { say: "There's a lot of blood.", context: "Describe injuries" },
      { say: "They're holding their chest and it hurts.", context: "Possible heart issue" },
    ],
    tips: [
      "Stay with the person if it's safe",
      "Don't move them unless there's danger",
      "Follow the dispatcher's instructions",
      "Keep talking to the person to comfort them"
    ]
  },
  {
    icon: Shield,
    title: "Police / Danger",
    color: "blue",
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderClass: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600",
    titleColor: "text-blue-800 dark:text-blue-300",
    description: "What to say when you feel unsafe or see danger",
    phrases: [
      { say: "Someone is trying to get into our house.", context: "Report intruder" },
      { say: "I'm hiding in my room.", context: "Tell them where you are" },
      { say: "(whisper) I need help. Someone is in our house.", context: "If you need to be quiet" },
      { say: "I saw someone breaking a car window.", context: "Report a crime" },
      { say: "There's a stranger who won't leave.", context: "Suspicious person" },
    ],
    tips: [
      "Hide somewhere safe if there's danger",
      "It's okay to whisper if you need to be quiet",
      "Lock doors if you can do so safely",
      "Stay on the line until help arrives"
    ]
  }
];

const Scripts = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Emergency Call Scripts | What to Say When Calling 911</title>
        <meta name="description" content="Learn exactly what to say when calling 911 for fire, medical, or police emergencies. Practice scripts and phrases for children and adults." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Emergency Call Scripts
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Learn exactly what to say in different emergency situations
          </p>
        </header>

        {/* Key Reminder */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-12 text-center">
          <h2 className="text-lg font-semibold text-foreground mb-2">Remember the Three Key Things</h2>
          <div className="flex flex-wrap justify-center gap-4 text-muted-foreground">
            <span className="bg-background px-4 py-2 rounded-lg shadow-sm">1️⃣ WHERE is the emergency?</span>
            <span className="bg-background px-4 py-2 rounded-lg shadow-sm">2️⃣ WHAT is happening?</span>
            <span className="bg-background px-4 py-2 rounded-lg shadow-sm">3️⃣ WHO needs help?</span>
          </div>
        </div>

        {/* Scenario Cards */}
        <div className="space-y-8">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon;
            return (
              <div 
                key={scenario.title}
                className={`${scenario.bgClass} ${scenario.borderClass} border rounded-2xl overflow-hidden`}
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 ${scenario.iconBg} rounded-xl`}>
                      <Icon className={`h-8 w-8 ${scenario.iconColor}`} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${scenario.titleColor}`}>{scenario.title}</h2>
                      <p className="text-muted-foreground">{scenario.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* What to Say */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        💬 What to Say
                      </h3>
                      <div className="space-y-3">
                        {scenario.phrases.map((phrase, i) => (
                          <div key={i} className="bg-background rounded-lg p-4 shadow-sm">
                            <p className="font-medium text-foreground mb-1">"{phrase.say}"</p>
                            <p className="text-xs text-muted-foreground">{phrase.context}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Safety Tips */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                        ✅ Safety Tips
                      </h3>
                      <div className="bg-background rounded-lg p-5 shadow-sm">
                        <ul className="space-y-3">
                          {scenario.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-muted-foreground">
                              <span className="text-green-500 mt-0.5">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Practice Prompt */}
        <div className="mt-12 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Practice?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Use our simulator to practice these scripts in a safe environment. 
            The AI dispatcher will respond just like a real 911 operator.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Try the Simulator
          </a>
        </div>

        {/* Warning */}
        <div className="mt-8 bg-destructive/10 border border-destructive/30 rounded-2xl p-6 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-destructive mb-2">For Real Emergencies</h3>
            <p className="text-muted-foreground">
              This page is for educational purposes only. In a real emergency, dial 911 immediately on your phone. 
              Stay calm and follow the dispatcher's instructions.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Scripts;
