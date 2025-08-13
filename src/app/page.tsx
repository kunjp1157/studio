
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageTitle } from '@/components/shared/PageTitle';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { SportCard } from '@/components/sports/SportCard';
import type { Facility, Sport, SiteSettings } from '@/lib/types';
import { getFacilitiesAction, getAllSportsAction, getSiteSettingsAction } from '@/app/actions';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Search, CalendarCheck, Wand2, Users, Trophy, Swords, ArrowRight } from 'lucide-react';
import { getIconComponent } from '@/components/shared/Icon';

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <Card className="text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    <CardHeader className="items-center">
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <CardTitle className="mt-4">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function HomePage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [facilitiesData, sportsData, settingsData] = await Promise.all([
        getFacilitiesAction(),
        getAllSportsAction(),
        getSiteSettingsAction(),
      ]);
      setFacilities(facilitiesData);
      setSports(sportsData);
      setSiteSettings(settingsData);
    } catch (error) {
      console.error("Failed to fetch home page data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const popularFacilities = facilities.filter(f => f.isPopular).slice(0, 4);
  const featuredSports = sports.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 text-center bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <PageTitle
              title="Find Your Game, Book Your Court"
              description="The easiest way to discover and book sports facilities in your city. Your next match is just a few clicks away."
            />
            <div className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/facilities">
                  <Search className="mr-2 h-5 w-5" /> Browse Facilities
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/events">
                  <Trophy className="mr-2 h-5 w-5" /> View Events
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-12 font-headline">Why Choose Sports Arena?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <FeatureCard
                icon={Search}
                title="Advanced Search"
                description="Quickly find the perfect venue with powerful filters for sport, location, price, and amenities."
              />
              <FeatureCard
                icon={CalendarCheck}
                title="Real-Time Booking"
                description="See live availability and instantly confirm your booking without any phone calls."
              />
              <FeatureCard
                icon={Wand2}
                title="AI Weekend Planner"
                description="Let our AI create a custom sports itinerary for your weekend based on your preferences."
              />
              <FeatureCard
                icon={Swords}
                title="Player Matchmaking"
                description="Find other players for a game or post a request to assemble your own team."
              />
              <FeatureCard
                icon={Users}
                title="Team Management"
                description="Create your own sports teams, invite your friends, and manage your roster with ease."
              />
              <FeatureCard
                icon={Trophy}
                title="Leagues & Events"
                description="Discover and register for exciting local tournaments, leagues, and sports events."
              />
            </div>
          </div>
        </section>

        {/* Featured Facilities Section */}
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-headline">Popular Facilities</h2>
                    <p className="text-lg text-muted-foreground mt-2">Check out our top-rated venues</p>
                </div>
                {isLoading ? (
                    <div className="flex justify-center"><LoadingSpinner size={36}/></div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularFacilities.map(facility => (
                            <FacilityCard key={facility.id} facility={facility} currency={siteSettings?.defaultCurrency || 'INR'} />
                        ))}
                    </div>
                )}
                 <div className="text-center mt-12">
                    <Button asChild variant="outline" size="lg">
                        <Link href="/facilities">
                            View All Facilities <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

         {/* Featured Sports Section */}
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                 <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold font-headline">Explore Sports</h2>
                    <p className="text-lg text-muted-foreground mt-2">Find facilities for your favorite sport</p>
                </div>
                {isLoading ? (
                    <div className="flex justify-center"><LoadingSpinner size={36}/></div>
                ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredSports.map(sport => {
                            const venueCount = facilities.filter(f => f.sports.some(s => s.id === sport.id)).length;
                            return <SportCard key={sport.id} sport={sport} venueCount={venueCount} />
                        })}
                    </div>
                )}
                 <div className="text-center mt-12">
                    <Button asChild variant="outline" size="lg">
                        <Link href="/sports">
                            Explore All Sports <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}
