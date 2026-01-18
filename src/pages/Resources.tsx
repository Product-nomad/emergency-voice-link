import React from 'react';
import { Helmet } from 'react-helmet-async';
import MainLayout from '@/components/MainLayout';
import { Phone, Flame, Shield, Heart, ExternalLink, AlertTriangle, BookOpen } from 'lucide-react';

const resourceCategories = [
  {
    icon: Heart,
    title: "Poison Control",
    color: "purple",
    bgClass: "bg-purple-50 dark:bg-purple-950/30",
    borderClass: "border-purple-200 dark:border-purple-800",
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600",
    resources: [
      {
        name: "National Poison Control Center",
        phone: "1-800-222-1222",
        description: "24/7 hotline for poison emergencies and questions. Free and confidential.",
        url: "https://www.poison.org"
      },
      {
        name: "Poison Help Online Tool",
        description: "Get guidance on what to do if someone swallows, inhales, or touches something harmful.",
        url: "https://www.poisonhelp.org"
      }
    ]
  },
  {
    icon: Shield,
    title: "Non-Emergency Police",
    color: "blue",
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    borderClass: "border-blue-200 dark:border-blue-800",
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600",
    resources: [
      {
        name: "Local Police Non-Emergency Line",
        description: "For non-urgent reports like noise complaints, minor vandalism, or general questions. Look up your local police department's non-emergency number.",
        note: "Search: '[Your City] police non-emergency number'"
      },
      {
        name: "Crime Tips Hotlines",
        description: "Many cities have anonymous tip lines for reporting suspicious activity.",
        note: "Search: '[Your City] crime stoppers'"
      }
    ]
  },
  {
    icon: Flame,
    title: "Fire Safety",
    color: "orange",
    bgClass: "bg-orange-50 dark:bg-orange-950/30",
    borderClass: "border-orange-200 dark:border-orange-800",
    iconBg: "bg-orange-100 dark:bg-orange-900",
    iconColor: "text-orange-600",
    resources: [
      {
        name: "National Fire Protection Association (NFPA)",
        description: "Fire safety tips, escape planning, and educational resources for families.",
        url: "https://www.nfpa.org/education"
      },
      {
        name: "Sparky the Fire Dog",
        description: "Kid-friendly fire safety education with games and activities.",
        url: "https://www.sparky.org"
      },
      {
        name: "Safe Kids Worldwide - Fire Safety",
        description: "Prevention tips and resources for keeping children safe from fires.",
        url: "https://www.safekids.org"
      }
    ]
  },
  {
    icon: Heart,
    title: "Medical Resources",
    color: "red",
    bgClass: "bg-red-50 dark:bg-red-950/30",
    borderClass: "border-red-200 dark:border-red-800",
    iconBg: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600",
    resources: [
      {
        name: "American Red Cross - First Aid",
        description: "Learn first aid, CPR, and emergency preparedness through courses and resources.",
        url: "https://www.redcross.org/take-a-class"
      },
      {
        name: "American Heart Association - CPR",
        description: "CPR training resources and information about hands-only CPR.",
        url: "https://www.heart.org/en/cpr"
      },
      {
        name: "Nurse Hotlines",
        description: "Many health insurance providers offer 24/7 nurse advice lines. Check your insurance card for the number.",
        note: "Check your insurance card for nurse hotline number"
      }
    ]
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    color: "green",
    bgClass: "bg-green-50 dark:bg-green-950/30",
    borderClass: "border-green-200 dark:border-green-800",
    iconBg: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600",
    resources: [
      {
        name: "Ready.gov - Kids Section",
        description: "FEMA's official resource for teaching kids about emergency preparedness.",
        url: "https://www.ready.gov/kids"
      },
      {
        name: "9-1-1 for Kids",
        description: "Educational organization dedicated to teaching children about emergency services.",
        url: "https://www.911forkids.com"
      },
      {
        name: "National Safety Council",
        description: "Safety resources for home, work, and community.",
        url: "https://www.nsc.org"
      }
    ]
  }
];

const Resources = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Emergency Resources | Helpful Numbers & Safety Links</title>
        <meta name="description" content="Essential emergency resources including Poison Control, non-emergency police lines, fire safety tips, and educational materials for families." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Emergency Resources
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Helpful numbers, websites, and safety information for families
          </p>
        </header>

        {/* Emergency Banner */}
        <div className="bg-destructive text-destructive-foreground rounded-2xl p-6 mb-12 flex items-center justify-center gap-4">
          <AlertTriangle className="h-8 w-8" />
          <div className="text-center">
            <p className="font-bold text-lg">For Life-Threatening Emergencies</p>
            <p className="text-3xl font-bold">Call 911</p>
          </div>
          <AlertTriangle className="h-8 w-8" />
        </div>

        {/* Resource Categories */}
        <div className="space-y-8">
          {resourceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div 
                key={category.title}
                className={`${category.bgClass} ${category.borderClass} border rounded-2xl overflow-hidden`}
              >
                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 ${category.iconBg} rounded-xl`}>
                      <Icon className={`h-7 w-7 ${category.iconColor}`} />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{category.title}</h2>
                  </div>

                  {/* Resources Grid */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.resources.map((resource, i) => (
                      <div key={i} className="bg-background rounded-xl p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{resource.name}</h3>
                          {resource.url && (
                            <a 
                              href={resource.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 flex-shrink-0"
                              aria-label={`Visit ${resource.name}`}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        
                        {resource.phone && (
                          <a 
                            href={`tel:${resource.phone.replace(/-/g, '')}`}
                            className="inline-flex items-center gap-2 text-primary font-bold text-lg mb-2 hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            {resource.phone}
                          </a>
                        )}
                        
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        
                        {resource.note && (
                          <p className="text-xs text-muted-foreground/70 mt-2 italic">
                            💡 {resource.note}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <div className="mt-12 bg-muted/50 rounded-2xl p-6 text-center">
          <p className="text-muted-foreground text-sm">
            The resources listed above are provided for educational purposes. Links may change over time. 
            Always verify information and contact your local emergency services for the most accurate numbers 
            in your area.
          </p>
        </div>

        {/* Practice CTA */}
        <div className="mt-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Practice?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Use our 911/999 simulator to practice emergency calls in a safe environment.
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

export default Resources;
