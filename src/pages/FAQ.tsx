import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import { AlertTriangle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: "Does this website actually call the police?",
    answer: "NO. This is a simulation only. It connects to an AI voice agent for training purposes. No real emergency services are contacted. If you have a real emergency, hang up and dial 911 on your phone immediately.",
    important: true
  },
  {
    question: "Is this free to use?",
    answer: "Yes! The 911 Call Simulator is completely free to use for educational purposes. We believe everyone should have access to emergency preparedness training, especially children and families."
  },
  {
    question: "Is my voice recorded?",
    answer: "The simulator uses AI voice technology to create a realistic experience. While the AI processes your voice in real-time to respond appropriately, we do not permanently store or record your conversations. Your privacy is important to us."
  },
  {
    question: "What age is this appropriate for?",
    answer: "This simulator is designed for children ages 4 and up, with adult supervision recommended for younger children. The AI dispatcher uses calm, reassuring language appropriate for all ages. Parents and teachers can use this tool to practice with children of any age."
  },
  {
    question: "Can I use this in a classroom or group setting?",
    answer: "Absolutely! Teachers and group leaders are welcome to use this simulator as part of their safety curriculum. It's a great way to demonstrate 911 procedures to multiple children in a controlled, educational environment."
  },
  {
    question: "How realistic is the simulation?",
    answer: "Our AI dispatcher is trained on real 911 protocols and asks the same questions a real dispatcher would ask: Where is your emergency? What's happening? Who needs help? The experience is designed to be educational while remaining appropriate for children."
  },
  {
    question: "What if my child gets scared during the simulation?",
    answer: "The simulation is designed to be educational, not frightening. However, if your child feels uncomfortable, they can end the call at any time by pressing the hang-up button. We recommend staying with younger children during their first few practice sessions to provide comfort and guidance."
  },
  {
    question: "Does this work on all devices?",
    answer: "Yes! The simulator works on smartphones, tablets, and computers with a microphone. For the best experience, we recommend using headphones and finding a quiet space to practice."
  },
  {
    question: "Can I practice different emergency scenarios?",
    answer: "Yes! You can practice various scenarios including fires, medical emergencies, and safety concerns. The AI dispatcher will respond appropriately to whatever situation you describe. Check out our Scripts page for example phrases you can practice."
  },
  {
    question: "What should I do if I accidentally call real 911?",
    answer: "If you accidentally dial the real 911 number, stay on the line and explain it was an accidental call. Do NOT hang up, as this may cause dispatchers to send emergency services to check on you. Simply say, 'I'm sorry, this was an accidental call. There is no emergency.'"
  },
  {
    question: "Is there a limit to how many times I can practice?",
    answer: "No! You can use the simulator as many times as you'd like. In fact, we encourage regular practice—just like fire drills, emergency calling skills stay sharp with repetition."
  },
  {
    question: "Who created this tool?",
    answer: "This simulator was created by educators and technology professionals who believe in the importance of emergency preparedness education. Our goal is to help families and schools teach children critical life-saving skills in a safe, accessible way."
  }
];

const FAQ = () => {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Frequently Asked Questions | 911 Call Simulator FAQ</title>
        <meta name="description" content="Common questions about the 911 Call Simulator. Learn about safety, privacy, and how to use this educational tool for emergency preparedness training." />
        <script type="application/ld+json">
          {JSON.stringify(faqStructuredData)}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about the 911 Call Simulator
          </p>
        </header>

        {/* Critical Notice */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-6 mb-8 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
          <div>
            <h2 className="font-bold text-destructive mb-2">Important Notice</h2>
            <p className="text-muted-foreground">
              This is an educational simulation only. It does NOT connect to real emergency services. 
              For actual emergencies, always dial 911 on your phone.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className={`border rounded-xl px-6 ${
                faq.important 
                  ? 'bg-primary/5 border-primary/30' 
                  : 'bg-muted/30 border-border'
              }`}
            >
              <AccordionTrigger className="text-left hover:no-underline py-4">
                <span className={`font-semibold ${faq.important ? 'text-primary' : 'text-foreground'}`}>
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Still Have Questions */}
        <div className="mt-12 bg-muted/50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-foreground mb-3">Still Have Questions?</h2>
          <p className="text-muted-foreground mb-4">
            We're here to help! If you have a question that isn't answered above, 
            feel free to reach out.
          </p>
          <a 
            href="/feedback" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Send Us Feedback
          </a>
        </div>
      </div>
    </MainLayout>
  );
};

export default FAQ;
