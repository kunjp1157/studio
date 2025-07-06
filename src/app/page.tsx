'use client';

import { useState, useEffect } from 'react';
import { FacilityCard } from '@/components/facilities/FacilityCard';
import { PageTitle } from '@/components/shared/PageTitle';
import type { Facility } from '@/lib/types';
import { getFacilitiesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const CardSkeleton = () => (
    <div className="bg-card p-4 rounded-lg shadow-md">
        <Skeleton className="h-48 w-full rounded mb-4" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-4 w-1/3" />
    </div>
);

export default function HomePage() {
  const [popularFacilities, setPopularFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      const allFacilities = await getFacilitiesAction();
      // Filter for popular facilities and sort them
      const popular = allFacilities
        .filter(f => f.isPopular)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4); // Show top 4 popular facilities
      setPopularFacilities(popular);
      setIsLoading(false);
    };

    fetchInitialData();
  }, []);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <PageTitle 
        title="Find & Book Your Perfect Sports Facility"
        description="The easiest way to discover and reserve sports venues in your city."
        className="text-center mb-12"
      />

      <div className="text-center mb-12">
        <Link href="/facilities">
          <Button size="lg" className="text-lg py-7 px-8">
            Explore All Facilities <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
      
      <section>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-8 font-headline">
              Popular Venues
          </h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularFacilities.map((facility) => (
                <FacilityCard key={facility.id} facility={facility} />
              ))}
            </div>
          )}
      </section>

      <section className="mt-16 text-center bg-muted/50 p-8 rounded-lg">
        <Sparkles className="mx-auto h-10 w-10 text-primary mb-4" />
        <h3 className="text-2xl font-bold mb-2 font-headline">Can't Decide Where to Play?</h3>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let our AI assistant recommend the perfect spot for you based on your preferences, past bookings, and popular choices.
        </p>
        <Link href="/recommendation">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Get AI Recommendation
          </Button>
        </Link>
      </section>
    </div>
  );
}
