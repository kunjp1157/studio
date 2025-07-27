

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Wand2, Swords, Sparkles, Trophy } from 'lucide-react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { getFacilitiesAction, getSiteSettingsAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IconComponent } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';

const HeroSection = () => {
    const title = "Find & Book Your Perfect Sports Arena";
    const description = "The ultimate platform to discover and book sports facilities in your city. Stop searching, start playing.";

    return (
        <section className="text-center py-20 lg:py-28 auth-background rounded-2xl shadow-2xl [perspective:1000px]">
            <div className="container mx-auto px-4 md:px-6">
                <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter">
                    {title.split("").map((char, index) => (
                        <span 
                            key={index} 
                            className="inline-block animate-letter-float" 
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {char === " " ? " " : char}
                        </span>
                    ))}
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                    {description.split("").map((char, index) => (
                        <span 
                            key={index} 
                            className="inline-block animate-letter-float" 
                            style={{ animationDelay: `${(title.length + index) * 0.02}s` }}
                        >
                            {char === " " ? " " : char}
                        </span>
                    ))}
                </p>
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
        <Card className={cn("text-center p-6 bg-secondary/30 transition-all duration-300 ease-in-out group preserve-3d h-full flex flex-col justify-center animate-float hover:!animate-none hover:-translate-y-2 hover:[transform:rotateY(-10deg)_scale(1.05)] hover:shadow-2xl hover:shadow-primary/20 rounded-xl")}
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
    
    return (
      <section className="py-16 lg:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold font-headline">Why Choose Sports Arena?</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            We offer unique tools and a seamless experience to make your sports life easier and more fun.
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


export default async function HomePage() {
  const allFacilities = await getFacilitiesAction();
  const settings = await getSiteSettingsAction();
  const featuredFacilities = allFacilities
    .filter(f => f.isPopular)
    .sort((a,b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <HeroSection />

      {featuredFacilities.length > 0 && (
        <section className="py-16 lg:py-24">
            <div className="text-center">
                <h2 className="text-3xl font-bold font-headline">Featured Facilities</h2>
                <p className="mt-2 text-muted-foreground">Check out some of the most popular venues on our platform.</p>
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
