import React from 'react';
import { AlertTriangle, MapPin, Phone, MessageCircle } from 'lucide-react';

const HomepageContent = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900/50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Section 1: Why Practice */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Why Practice?
          </h2>
          <p className="text-lg text-foreground/90 leading-relaxed">
            In an emergency, panic affects fine motor skills. This simulator builds the muscle memory needed to dial 911/999.
          </p>
        </div>

        {/* Section 2: 3 Golden Rules */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            3 Golden Rules
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  1. Know Your Location
                </h3>
                <p className="text-foreground/80">
                  Cell phones don't always pinpoint you. Know your address.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  2. Don't Hang Up
                </h3>
                <p className="text-foreground/80">
                  If you dial by mistake, stay on the line.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1">
                  3. Listen First
                </h3>
                <p className="text-foreground/80">
                  Answer the dispatcher's questions clearly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Safety Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
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
