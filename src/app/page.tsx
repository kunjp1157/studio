

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Wand2, Swords, Sparkles, Trophy } from 'lucide-react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { getFacilitiesAction, getSiteSettingsAction } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { IconComponent } from '@/components/shared/Icon';

const HeroSection = () => (
  <section className="text-center py-20 lg:py-28">
    <div className="container mx-auto px-4 md:px-6">
      <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-foreground animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        Find & Book Your Perfect <span className="text-primary">Sports Arena</span>
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
        The ultimate platform to discover and book sports facilities in your city. Stop searching, start playing.
      </p>
      <div className="mt-8 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
        <Link href="/facilities">
          <Button size="lg" className="text-lg py-7 px-10 rounded-full hover:scale-105 transition-transform duration-300">
            Explore Facilities <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
    return (
        <Card className="text-center p-6 bg-secondary/30 transition-all duration-300 ease-in-out group preserve-3d hover:-translate-y-2 hover:[transform:rotateX(10deg)_rotateY(-5deg)_translateZ(20px)] hover:shadow-2xl hover:shadow-primary/20">
            <IconComponent name={icon} className="mx-auto h-10 w-10 text-primary mb-4 transition-transform duration-300 group-hover:scale-110" />
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </Card>
    );
};

const FeaturesSection = () => (
  <section className="py-16 lg:py-24">
    <div className="text-center">
      <h2 className="text-3xl font-bold font-headline">Why Choose Sports Arena?</h2>
      <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
        We offer unique tools and a seamless experience to make your sports life easier and more fun.
      </p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12 [perspective:1000px]">
      <FeatureCard 
        icon="Sparkles" 
        title="AI Weekend Planner" 
        description="Describe your ideal weekend and let our AI create a custom sports itinerary for you." 
      />
      <FeatureCard 
        icon="Swords" 
        title="Player Matchmaking" 
        description="Find other players for a casual game or to complete your team roster." 
      />
      <FeatureCard 
        icon="Trophy" 
        title="Events & Tournaments" 
        description="Discover and join exciting local sports events and compete for glory." 
      />
       <FeatureCard 
        icon="Wand2" 
        title="Smart Recommendations" 
        description="Get personalized facility suggestions based on your preferences and booking history." 
      />
    </div>
  </section>
);


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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 [perspective:1000px]">
                {featuredFacilities.map(facility => (
                <FacilityCard key={facility.id} facility={facility} currency={settings.defaultCurrency} />
                ))}
            </div>
        </section>
      )}
      
      <FeaturesSection />

    </div>
  );
}
