import React from 'react';
import { AlertTriangle } from 'lucide-react';

const HomepageContent = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Section 1: The Science of Panic */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Why "Knowing" Isn't Enough: The Science of Panic
          </h2>
          <p className="text-lg text-foreground/90 leading-relaxed">
            Most children know the number 911 (or 999), but knowing the number is different from being able to dial it under pressure. In a high-stress emergency, the human brain enters a "fight or flight" state, which can degrade fine motor skills and cognitive recall. This simulator is designed to bridge the gap between theory and practice, building the specific "muscle memory" required to unlock a phone, open the keypad, and dial calmly.
          </p>
        </div>

        {/* Section 2: The 3 Golden Rules */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            The 3 Golden Rules of Emergency Calls
          </h2>

          {/* Rule 1 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              1. Location is Your Superpower
            </h3>
            <p className="text-foreground/90 leading-relaxed">
              Many parents assume that calling 911 instantly transmits their exact location to the police. This is not always true. Cell phone triangulation can be imprecise, especially in apartment buildings or rural areas.
            </p>
            <div className="pl-4 border-l-4 border-primary/50">
              <p className="text-foreground/80 italic">
                <strong className="text-foreground not-italic">The Lesson:</strong> Teach your child to state their full address immediately. "I am at 123 Main Street." Make sure they know to look for landmarks if they are away from home.
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              2. Never Hang Up (Even if it's a Mistake)
            </h3>
            <p className="text-foreground/90 leading-relaxed">
              Curiosity often leads children to dial 911 just to see what happens. If they panic and hang up, the dispatcher must assume the worst. They will call back or dispatch an officer to investigate, wasting critical resources.
            </p>
            <div className="pl-4 border-l-4 border-primary/50">
              <p className="text-foreground/80 italic">
                <strong className="text-foreground not-italic">The Lesson:</strong> Teach your child that if they dial by accident, they should stay on the line and simply say, "I'm sorry, there is no emergency." The dispatcher will thank them and hang up—no trouble, no police.
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground">
              3. The "Dispatcher Handshake"
            </h3>
            <p className="text-foreground/90 leading-relaxed">
              Children often expect help to arrive the second they hear a voice. They may scream or cry over the operator.
            </p>
            <div className="pl-4 border-l-4 border-primary/50">
              <p className="text-foreground/80 italic">
                <strong className="text-foreground not-italic">The Lesson:</strong> Explain that the voice on the phone is a teammate. The dispatcher has a specific script of questions to ask ("What is the emergency?", "Who is with you?"). Teaching your child to stop, listen, and answer clearly is the fastest way to get help.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: When Should You Call? */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            When Should You Call?
          </h2>
          <p className="text-foreground/90 leading-relaxed">
            Use this simulator to role-play specific scenarios.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">
                ✓ DO Call For:
              </h4>
              <ul className="text-foreground/80 space-y-1 text-sm">
                <li>• A fire</li>
                <li>• A person who won't wake up</li>
                <li>• A dangerous stranger</li>
                <li>• A family member who is hurt and can't speak</li>
              </ul>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 dark:text-red-400 mb-2">
                ✗ DO NOT Call For:
              </h4>
              <ul className="text-foreground/80 space-y-1 text-sm">
                <li>• A lost pet</li>
                <li>• A minor cut</li>
                <li>• Being locked out of the house</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700 rounded-lg p-6">
          <div className="flex gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Safety Disclaimer
              </h2>
              <p className="text-foreground/90">
                This tool is for educational simulation only. It does NOT connect to 
                real emergency services. In a real emergency, always dial 911 or 999 
                on a real phone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomepageContent;
