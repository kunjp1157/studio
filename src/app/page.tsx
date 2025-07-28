
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Wand2, Swords, Sparkles, Trophy } from 'lucide-react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { getFacilitiesAction, getSiteSettingsAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IconComponent } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';
import type { Facility, SiteSettings } from '@/lib/types';


const AnimatedText = ({ text, el: El = 'span', className, stagger = 80, repeatInterval = 5000 }: { text: string; el?: React.ElementType; className?: string; stagger?: number, repeatInterval?: number }) => {
    const letters = text.split('');
    const containerRef = useRef<HTMLElement>(null);

    const runAnimation = () => {
        const spans = containerRef.current?.children;
        if (!spans) return;

        // Reset by removing the 'fall' class
        for (let i = 0; i < spans.length; i++) {
            spans[i].classList.remove('fall');
        }

        // Add 'fall' class with a stagger after a short delay to allow reset
        setTimeout(() => {
            for (let i = 0; i < spans.length; i++) {
                setTimeout(() => {
                    spans[i].classList.add('fall');
                }, i * stagger);
            }
        }, 100);
    };

    useEffect(() => {
        // Initial animation
        runAnimation();

        // Set up repeating animation
        const interval = setInterval(runAnimation, repeatInterval);

        // Cleanup on component unmount
        return () => clearInterval(interval);
    }, [text, stagger, repeatInterval]);

    return (
        <El className={className} ref={containerRef}>
            {letters.map((char, index) => (
                <span
                    key={`${char}-${index}`}
                    className="letter"
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </El>
    );
};


const HeroSection = () => {
    return (
        <section className="text-center py-20 lg:py-28 auth-background rounded-2xl shadow-2xl" style={{ perspective: '500px' }}>
            <div className="container mx-auto px-4 md:px-6">
                 <AnimatedText 
                    text="Find & Book Your Perfect Sports Arena"
                    el="h1"
                    className="text-4xl md:text-6xl font-bold font-headline tracking-tighter break-words"
                    stagger={50}
                    repeatInterval={7000}
                />
                <AnimatedText
                    text="The ultimate platform to discover and book sports facilities in your city. Stop searching, start playing."
                    el="p"
                    className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground break-words"
                    stagger={20}
                    repeatInterval={7000}
                />
                <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '2.5s' }}>
                    <Link href="/facilities">
                        <Button size="lg" className="text-lg py-7 px-10 rounded-full hover:scale-110 transition-transform duration-300 animate-glow">
                            Explore Facilities <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};


const FeatureCard = ({ icon, title, description, index }: { icon: string; title: string; description: string; index: number }) => {
    return (
        <Card className={cn("text-center p-6 bg-secondary/30 transition-all duration-300 ease-in-out group preserve-3d h-full flex flex-col justify-center animate-float-3d hover:!animate-none hover:-translate-y-2 hover:[transform:rotateX(10deg)_rotateY(-5deg)_scale(1.05)] hover:shadow-2xl hover:shadow-primary/20 rounded-xl")}
              style={{ animationDelay: `${index * 200}ms` }}
        >
            <IconComponent name={icon} className="mx-auto h-10 w-10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </Card>
    );
};


const FeaturesSection = () => {
    const features = [
      { 
        icon: "Sparkles", 
        title: "AI Weekend Planner", 
        description: "Describe your ideal weekend and let our AI create a custom sports itinerary for you." 
      },
      { 
        icon: "Swords", 
        title: "Player Matchmaking", 
        description: "Find other players for a casual game or to complete your team roster." 
      },
      { 
        icon: "Trophy", 
        title: "Events & Tournaments", 
        description: "Discover and join exciting local sports events and compete for glory." 
      },
       { 
        icon: "Wand2", 
        title: "Smart Recommendations", 
        description: "Get personalized facility suggestions based on your preferences and booking history." 
      },
    ];
    const title = "Why Choose Sports Arena?";
    const description = "We offer unique tools and a seamless experience to make your sports life easier and more fun.";
    
    return (
      <section className="py-16 lg:py-24">
        <div className="text-center preserve-3d">
            <h2 className="text-3xl font-bold font-headline">
                {title.split("").map((char, index) => (
                    <span 
                        key={index} 
                        className="inline-block animate-wave" 
                        style={{ animationDelay: `${index * 0.07}s` }}
                    >
                        {char === " " ? " " : char}
                    </span>
                ))}
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                 {description.split("").map((char, index) => (
                    <span 
                        key={index} 
                        className="inline-block animate-wave" 
                        style={{ animationDelay: `${(title.length + index) * 0.05}s` }}
                    >
                        {char === " " ? " " : char}
                    </span>
                ))}
            </p>
        </div>
        <div className="mt-12 overflow-hidden [perspective:1000px] [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
                {[...features, ...features].map((feature, index) => (
                    <div key={index} className="w-[280px] mx-4 shrink-0">
                        <FeatureCard 
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            index={index}
                        />
                    </div>
                ))}
            </div>
        </div>
      </section>
    );
};


export default function HomePage() {
  const [allFacilities, setAllFacilities] = useState<Facility[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [facilitiesData, settingsData] = await Promise.all([
        getFacilitiesAction(),
        getSiteSettingsAction()
      ]);
      setAllFacilities(facilitiesData);
      setSettings(settingsData);
    };
    fetchData();
  }, []);
  
  const featuredFacilities = allFacilities
    .filter(f => f.isPopular)
    .sort((a,b) => b.rating - a.rating)
    .slice(0, 4);
    
  const featuredTitle = "Featured Facilities";
  const featuredDescription = "Check out some of the most popular venues on our platform.";

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <HeroSection />

      {featuredFacilities.length > 0 && settings && (
        <section className="py-16 lg:py-24">
            <div className="text-center">
                <h2 className="text-3xl font-bold font-headline">
                    {featuredTitle.split("").map((char, index) => (
                        <span 
                            key={index} 
                            className="animate-letter-fall-3d" 
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {char === " " ? " " : char}
                        </span>
                    ))}
                </h2>
                <p className="mt-2 text-muted-foreground">
                    {featuredDescription.split("").map((char, index) => (
                        <span 
                            key={index} 
                            className="animate-letter-fall-3d" 
                            style={{ animationDelay: `${(featuredTitle.length + index) * 0.02}s` }}
                        >
                            {char === " " ? " " : char}
                        </span>
                    ))}
                </p>
            </div>
            <div className="mt-12 overflow-hidden [perspective:1000px] [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                <div className="flex animate-marquee hover:[animation-play-state:paused] w-max">
                    {[...featuredFacilities, ...featuredFacilities].map((facility, index) => (
                        <div key={`${facility.id}-${index}`} className="w-[300px] mx-4 shrink-0">
                            <FacilityCard facility={facility} currency={settings.defaultCurrency} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
      )}
      
      <FeaturesSection />

    </div>
  );
}
